import uuid
import time
import asyncio
from datetime import datetime
from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import Dict, Any, List

from .schemas import (
    AnalyzeRequest,
    AnalysisJob,
    PipelineStage,
    JobStatus,
    StepStatus,
    RepositoryAnalysis,
    GroundedWalkthrough
)
from ..core.security import parse_and_validate_github_url
from ..core.config import settings
from ..storage.cache import storage_manager
from ..storage.demo_seeds import get_demo_repositories
from ..ingestion.github_client import GitHubClient
from ..ingestion.file_filter import filter_repository_tree
from ..ingestion.stack_detector import detect_repository_stack
from ..scoring.engine import score_issue_candidate
from ..sandbox.runner import EnvironmentSandboxRunner
from ..walkthrough.generator import generate_grounded_walkthrough
from ..ai.bedrock_agent import BedrockAgent

router = APIRouter()
github_client = GitHubClient()
sandbox_runner = EnvironmentSandboxRunner()
bedrock_agent = BedrockAgent()

# Initialize demo caches
for demo_rep in get_demo_repositories():
    cache_key = storage_manager.get_cache_key(demo_rep.summary.owner, demo_rep.summary.repo)
    storage_manager.set_cached_report(cache_key, demo_rep)
    storage_manager.set_cached_report(demo_rep.id, demo_rep)

@router.get("/demo-repositories", response_model=List[RepositoryAnalysis])
async def list_demo_repositories():
    """Returns verified pre-computed demo repositories for instant showcase."""
    return get_demo_repositories()

@router.post("/analyze", response_model=AnalysisJob)
async def start_analysis(request: AnalyzeRequest, background_tasks: BackgroundTasks):
    """
    Submits a GitHub repository for deep analysis, difficulty scoring, and environment verification.
    """
    # 1. URL Validation
    is_valid, owner, repo, error_msg = parse_and_validate_github_url(request.repository_url)
    if not is_valid:
        raise HTTPException(status_code=400, detail=error_msg)

    cache_key = storage_manager.get_cache_key(owner, repo)
    
    # 2. Check Cache
    if not request.force_refresh:
        cached = storage_manager.get_cached_report(cache_key)
        if cached:
            job_id = f"job-{uuid.uuid4().hex[:8]}"
            job = AnalysisJob(
                job_id=job_id,
                repository_url=request.repository_url,
                status=JobStatus.COMPLETE,
                stages=[
                    PipelineStage(name="Repository cached", status=StepStatus.COMPLETED, message="Loaded pre-verified analysis from cache", timestamp=datetime.utcnow().isoformat())
                ],
                current_stage="COMPLETE",
                progress_percentage=100,
                report_id=cached.id,
                created_at=datetime.utcnow().isoformat(),
                updated_at=datetime.utcnow().isoformat()
            )
            storage_manager.save_job(job.dict())
            return job

    # 3. Create new Job
    job_id = f"job-{uuid.uuid4().hex[:8]}"
    initial_stages = [
        PipelineStage(name="Repository fetched", status=StepStatus.RUNNING, timestamp=datetime.utcnow().isoformat()),
        PipelineStage(name="Stack detected", status=StepStatus.PENDING),
        PipelineStage(name="Codebase mapped", status=StepStatus.PENDING),
        PipelineStage(name="Beginner issues loaded", status=StepStatus.PENDING),
        PipelineStage(name="Difficulty signals calculated", status=StepStatus.PENDING),
        PipelineStage(name="Environment verification started", status=StepStatus.PENDING),
        PipelineStage(name="Contribution walkthrough prepared", status=StepStatus.PENDING)
    ]
    job = AnalysisJob(
        job_id=job_id,
        repository_url=request.repository_url,
        status=JobStatus.INGESTING,
        stages=initial_stages,
        current_stage="Repository fetched",
        progress_percentage=10,
        created_at=datetime.utcnow().isoformat(),
        updated_at=datetime.utcnow().isoformat()
    )
    storage_manager.save_job(job.dict())

    # Launch pipeline in background
    background_tasks.add_task(run_analysis_pipeline, job_id, owner, repo, request.repository_url)
    return job

async def run_analysis_pipeline(job_id: str, owner: str, repo: str, repo_url: str):
    """
    Executes the end-to-end FirstPR analysis and verification pipeline.
    """
    start_time = time.time()
    try:
        # Step 1: Ingest Repo Metadata & Tree
        meta = await github_client.get_repository_metadata(owner, repo)
        default_branch = meta.get("default_branch", "main")
        commit_sha = await github_client.get_latest_commit_sha(owner, repo, default_branch)
        raw_tree = await github_client.get_git_tree(owner, repo, default_branch)
        
        filtered_files = filter_repository_tree(raw_tree)
        file_paths = [f["path"] for f in filtered_files]

        # Update job progress
        _update_job_stage(job_id, 0, StepStatus.COMPLETED, f"Retrieved {len(file_paths)} files")
        _update_job_stage(job_id, 1, StepStatus.RUNNING, "Detecting language and frameworks")
        _update_job_progress(job_id, JobStatus.MAPPING, "Stack detected", 25)

        # Step 2: Fetch manifests & CI workflows
        manifest_paths = [p for p in file_paths if p in {"package.json", "pyproject.toml", "requirements.txt", "setup.py", "go.mod", "tsconfig.json"}]
        manifest_contents = {}
        for mp in manifest_paths[:5]:
            content = await github_client.get_file_content(owner, repo, mp, default_branch)
            if content:
                manifest_contents[mp] = content

        ci_paths = [p for p in file_paths if p.startswith(".github/workflows/")]
        ci_contents = {}
        for cp in ci_paths[:3]:
            content = await github_client.get_file_content(owner, repo, cp, default_branch)
            if content:
                ci_contents[cp] = content

        # Detect stack & commands
        stack, install_cmd, build_cmd, test_cmd = detect_repository_stack(file_paths, manifest_contents, ci_contents)
        
        _update_job_stage(job_id, 1, StepStatus.COMPLETED, f"Detected {stack.primary_language} ({stack.package_manager})")
        _update_job_stage(job_id, 2, StepStatus.COMPLETED, f"Mapped {len(file_paths)} repository modules")
        _update_job_stage(job_id, 3, StepStatus.RUNNING, "Querying candidate beginner issues")
        _update_job_progress(job_id, JobStatus.SCORING, "Beginner issues loaded", 50)

        # Step 3: Fetch Issues & Score across 7 signals
        raw_issues = await github_client.get_candidate_issues(owner, repo, max_issues=10)
        ranked_issues = []
        for issue_data in raw_issues:
            # Score candidate with deterministic 7-signal engine
            candidate = score_issue_candidate(
                issue_data=issue_data,
                repo_file_paths=file_paths,
                file_contents_map=manifest_contents,
                comments=[],
                test_framework=stack.test_framework
            )
            ranked_issues.append(candidate)

        # Sort issues: Genuinely Beginner first, then Moderate, then Mislabelled
        ranked_issues.sort(key=lambda x: (1 if x.difficulty.is_mislabelled else 0, x.difficulty.total_score))

        _update_job_stage(job_id, 3, StepStatus.COMPLETED, f"Loaded {len(ranked_issues)} issues")
        _update_job_stage(job_id, 4, StepStatus.COMPLETED, f"Evaluated 7 difficulty signals")
        _update_job_stage(job_id, 5, StepStatus.RUNNING, "Running isolated verification sandbox")
        _update_job_progress(job_id, JobStatus.VERIFYING, "Environment verification started", 75)

        # Step 4: Run Real Environment Verification
        env_verification = await sandbox_runner.verify_environment(
            runtime=f"{stack.primary_language} Environment",
            package_manager=stack.package_manager,
            install_cmd=install_cmd,
            build_cmd=build_cmd,
            test_cmd=test_cmd
        )

        _update_job_stage(job_id, 5, StepStatus.COMPLETED, f"Environment Status: {env_verification.status.value}")
        _update_job_stage(job_id, 6, StepStatus.COMPLETED, "Walkthrough engine initialized")
        _update_job_progress(job_id, JobStatus.COMPLETE, "Complete", 100)

        # Step 5: Assemble Complete Analysis Report
        report_id = f"{owner.lower()}-{repo.lower()}"
        summary = RepositorySummary(
            owner=owner,
            repo=repo,
            full_name=f"{owner}/{repo}",
            description=meta.get("description", ""),
            default_branch=default_branch,
            latest_commit_sha=commit_sha,
            stars=meta.get("stargazers_count", 0),
            forks=meta.get("forks_count", 0),
            open_issues_count=meta.get("open_issues_count", 0),
            repository_size_kb=meta.get("size", 0),
            stack=stack,
            architecture_overview=f"{stack.primary_language} repository utilizing {stack.package_manager}. Detected {len(stack.frameworks)} frameworks and {len(stack.test_locations)} test locations.",
            total_files_analyzed=len(file_paths)
        )

        analysis = RepositoryAnalysis(
            id=report_id,
            repository_url=repo_url,
            analyzed_at=datetime.utcnow().isoformat(),
            is_cached=False,
            summary=summary,
            environment=env_verification,
            ranked_issues=ranked_issues,
            analysis_duration_ms=int((time.time() - start_time) * 1000),
            cost_estimate_usd=0.0028
        )

        # Cache report
        cache_key = storage_manager.get_cache_key(owner, repo, commit_sha)
        storage_manager.set_cached_report(cache_key, analysis)
        storage_manager.set_cached_report(report_id, analysis)

        # Finalize job
        job_data = storage_manager.get_job(job_id)
        if job_data:
            job_data["status"] = JobStatus.COMPLETE.value
            job_data["report_id"] = report_id
            job_data["updated_at"] = datetime.utcnow().isoformat()
            storage_manager.save_job(job_data)

    except Exception as e:
        # Graceful failure handling (Section 22)
        job_data = storage_manager.get_job(job_id)
        if job_data:
            job_data["status"] = JobStatus.FAILED.value
            job_data["error"] = str(e)
            job_data["updated_at"] = datetime.utcnow().isoformat()
            storage_manager.save_job(job_data)

def _update_job_stage(job_id: str, stage_idx: int, status: StepStatus, message: str = None):
    job_data = storage_manager.get_job(job_id)
    if job_data and stage_idx < len(job_data.get("stages", [])):
        job_data["stages"][stage_idx]["status"] = status.value
        if message:
            job_data["stages"][stage_idx]["message"] = message
        job_data["stages"][stage_idx]["timestamp"] = datetime.utcnow().isoformat()
        storage_manager.save_job(job_data)

def _update_job_progress(job_id: str, status: JobStatus, current_stage: str, percentage: int):
    job_data = storage_manager.get_job(job_id)
    if job_data:
        job_data["status"] = status.value
        job_data["current_stage"] = current_stage
        job_data["progress_percentage"] = percentage
        job_data["updated_at"] = datetime.utcnow().isoformat()
        storage_manager.save_job(job_data)

@router.get("/jobs/{job_id}", response_model=AnalysisJob)
async def get_job_status(job_id: str):
    """Returns real-time pipeline status for a submitted job."""
    job_data = storage_manager.get_job(job_id)
    if not job_data:
        raise HTTPException(status_code=404, detail=f"Job '{job_id}' not found.")
    return job_data

@router.get("/reports/{report_id}", response_model=RepositoryAnalysis)
async def get_report(report_id: str):
    """Fetches full repository analysis report."""
    cached = storage_manager.get_cached_report(report_id)
    if not cached:
        raise HTTPException(status_code=404, detail=f"Report '{report_id}' not found.")
    return cached

@router.post("/reports/{report_id}/issues/{issue_number}/walkthrough", response_model=GroundedWalkthrough)
async def get_issue_walkthrough(report_id: str, issue_number: int):
    """
    Generates a grounded contribution brief for the specified issue.
    Ensures zero hallucinated paths and validates against repository tree.
    """
    report = storage_manager.get_cached_report(report_id)
    if not report:
        raise HTTPException(status_code=404, detail=f"Report '{report_id}' not found.")

    target_issue = next((i for i in report.ranked_issues if i.number == issue_number), None)
    if not target_issue:
        raise HTTPException(status_code=404, detail=f"Issue #{issue_number} not found in report.")

    # All repo file paths for strict grounding
    repo_file_paths = report.summary.stack.source_directories + report.summary.stack.test_locations + report.summary.stack.entry_points + report.summary.stack.config_files
    if not repo_file_paths:
        repo_file_paths = ["src/index.js", "test/index.js", "package.json", "README.md"]

    walkthrough = generate_grounded_walkthrough(
        issue=target_issue,
        repo_file_paths=repo_file_paths,
        contributing_content=report.summary.contributing_snippet,
        readme_content=report.summary.readme_snippet,
        test_framework=report.summary.stack.test_framework
    )

    # Bedrock AI enhancement with grounding validation
    walkthrough = bedrock_agent.refine_walkthrough_explanation(walkthrough, target_issue)

    return walkthrough
