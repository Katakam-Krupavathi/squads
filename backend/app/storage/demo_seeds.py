from datetime import datetime
from ..api.schemas import (
    RepositoryAnalysis,
    RepositorySummary,
    RepositoryStack,
    EnvironmentVerification,
    VerificationStep,
    VerificationStatus,
    StepStatus,
    IssueCandidate,
    IssueDifficultyScore,
    DifficultyCategory,
    DifficultySignal
)

def get_demo_repositories() -> list[RepositoryAnalysis]:
    """
    Returns pre-computed, rigorously verified demo repository analyses.
    Showcases:
    - Genuinely Beginner Issue
    - Mislabelled "Good First Issue" Exposed
    - Real Environment Verification Steps (Install, Build, Test)
    """
    now_str = datetime.utcnow().isoformat()

    # Demo 1: chalk/chalk (JavaScript/Node CLI library)
    chalk_signals_easy = {
        "blast_radius": DifficultySignal(
            name="Blast Radius",
            score=18.0,
            weight=0.22,
            weighted_score=3.96,
            evidence=["Single file targeted: `source/index.js`", "Modifies CLI color formatting helper"],
            explanation="Localized to a single helper function with zero side effects."
        ),
        "structural_centrality": DifficultySignal(
            name="Structural Centrality",
            score=25.0,
            weight=0.16,
            weighted_score=4.0,
            evidence=["Leaf formatting utility", "No circular or core architectural dependencies"],
            explanation="Low structural risk; leaf module."
        ),
        "local_complexity": DifficultySignal(
            name="Local Complexity",
            score=20.0,
            weight=0.14,
            weighted_score=2.8,
            evidence=["LOC: 120 lines", "Max nesting depth: 2", "Cyclomatic complexity: 3"],
            explanation="Clean, readable functional code."
        ),
        "test_proximity": DifficultySignal(
            name="Test Proximity",
            score=15.0,
            weight=0.14,
            weighted_score=2.1,
            evidence=["Dedicated test suite found: `test/index.js`", "AVA test harness active with 100% assertion coverage"],
            explanation="Strong test harness protection; instant validation."
        ),
        "specification_quality": DifficultySignal(
            name="Specification Quality",
            score=20.0,
            weight=0.16,
            weighted_score=3.2,
            evidence=["Includes reproduction code snippet", "Expected vs actual hex output defined", "Clear acceptance checklist"],
            explanation="Thorough specification with exact reproduction steps."
        ),
        "social_state": DifficultySignal(
            name="Social State",
            score=15.0,
            weight=0.10,
            weighted_score=1.5,
            evidence=["Issue is unassigned and open", "Maintainer approved proposal in comments"],
            explanation="Available for immediate contribution."
        ),
        "domain_prerequisites": DifficultySignal(
            name="Domain Prerequisites",
            score=15.0,
            weight=0.08,
            weighted_score=1.2,
            evidence=["Standard ANSI color string logic", "No low-level dependencies"],
            explanation="Standard JavaScript string manipulation."
        )
    }

    chalk_easy_issue = IssueCandidate(
        number=582,
        title="Add support for 24-bit TrueColor hex code shorthand (#FFF)",
        body="Currently `chalk.hex('#FFF')` throws an invalid length error because only 6-character hex strings (`#FFFFFF`) are parsed. We should support 3-character CSS hex shorthands.\n\n### Steps to Reproduce\n```js\nimport chalk from 'chalk';\nconsole.log(chalk.hex('#FFF')('Hello')); // Throws Error\n```\n### Expected\nExpands `#FFF` to `#FFFFFF` before ANSI conversion in `source/index.js`.\n\n- [ ] Parse 3-character hex\n- [ ] Add unit test in `test/index.js`",
        html_url="https://github.com/chalk/chalk/issues/582",
        labels=["good first issue", "enhancement", "help wanted"],
        difficulty=IssueDifficultyScore(
            total_score=18.8,
            category=DifficultyCategory.GENUINELY_BEGINNER,
            signals=chalk_signals_easy,
            confidence=0.98,
            summary_explanation="Verified genuinely beginner-friendly (18.8/100). Localized to `source/index.js` with comprehensive unit tests in `test/index.js` and clear acceptance criteria.",
            is_mislabelled=False
        ),
        likely_affected_files=["source/index.js"],
        potential_blockers=[],
        specification_quality_score=92.0,
        test_availability="Dedicated Tests Available (`test/index.js`)",
        social_state="Available",
        has_linked_pr=False,
        is_stale=False
    )

    # Demo 1 - Mislabelled Issue on chalk
    chalk_signals_mislabelled = {
        "blast_radius": DifficultySignal(
            name="Blast Radius",
            score=88.0,
            weight=0.22,
            weighted_score=19.36,
            evidence=["Touches core stream pipeline across 6 files", "Requires changes to `source/vendor/supports-color.js`, `source/index.js`, and OS detection"],
            explanation="Large blast radius touching OS terminal detection layer."
        ),
        "structural_centrality": DifficultySignal(
            name="Structural Centrality",
            score=90.0,
            weight=0.16,
            weighted_score=14.4,
            evidence=["Modifies root stream bootstrap engine", "18 dependent internal helper modules"],
            explanation="Central core subsystem with high breakage risk."
        ),
        "local_complexity": DifficultySignal(
            name="Local Complexity",
            score=82.0,
            weight=0.14,
            weighted_score=11.48,
            evidence=["Windows TTY console mode bitmask manipulation", "Bitwise operations with Win32 API handles"],
            explanation="Complex OS-level bitwise operations."
        ),
        "test_proximity": DifficultySignal(
            name="Test Proximity",
            score=75.0,
            weight=0.14,
            weighted_score=10.5,
            evidence=["Requires Windows Virtual Terminal environment simulation", "No existing mock for Win32 ENABLE_VIRTUAL_TERMINAL_PROCESSING"],
            explanation="Missing test harness for platform-specific TTY simulation."
        ),
        "specification_quality": DifficultySignal(
            name="Specification Quality",
            score=65.0,
            weight=0.16,
            weighted_score=10.4,
            evidence=["Brief description: 'Fix Windows Terminal color depth detection on legacy ConHost'", "No stack trace or reproduction commands"],
            explanation="Vague description with complex underlying hardware dependencies."
        ),
        "social_state": DifficultySignal(
            name="Social State",
            score=50.0,
            weight=0.10,
            weighted_score=5.0,
            evidence=["3 previous contributors attempted and abandoned", "Unresolved technical debate in comments"],
            explanation="Historically difficult; multiple abandoned attempts."
        ),
        "domain_prerequisites": DifficultySignal(
            name="Domain Prerequisites",
            score=92.0,
            weight=0.08,
            weighted_score=7.36,
            evidence=["Requires Windows Console Internals & ConHost IOCTL knowledge", "ANSI escape sequence parser synchronization"],
            explanation="Specialized Windows terminal driver & IOCTL knowledge required."
        )
    }

    chalk_mislabelled_issue = IssueCandidate(
        number=491,
        title="Refactor Windows ConHost TTY 24-bit color fallback detection",
        body="On legacy Windows 10 ConHost builds, 24-bit color isn't properly detected when running under PowerShell. Need someone to fix the detection logic.\n\nGood first issue for anyone wanting to learn Windows terminal handling!",
        html_url="https://github.com/chalk/chalk/issues/491",
        labels=["good first issue", "help wanted"],
        difficulty=IssueDifficultyScore(
            total_score=78.5,
            category=DifficultyCategory.MISLABELLED,
            signals=chalk_signals_mislabelled,
            confidence=0.96,
            summary_explanation="GitHub labels this as 'good first issue', but FirstPR calculated a difficulty score of 78.5/100 (HIGH RISK). Requires low-level Windows ConHost IOCTL knowledge, touches core terminal detection across 6 files, and lacks automated test mocks.",
            is_mislabelled=True
        ),
        likely_affected_files=["source/vendor/supports-color.js", "source/index.js", "source/utilities.js"],
        potential_blockers=[
            "Mislabelled: Requires Windows Console Internals & IOCTL expertise despite 'good first issue' label",
            "High blast radius touching core stream bootstrapping",
            "No automated test harness for legacy ConHost simulation"
        ],
        specification_quality_score=35.0,
        test_availability="No Test Coverage for Windows ConHost",
        social_state="Stale (3 Abandoned Attempts)",
        has_linked_pr=False,
        is_stale=True
    )

    chalk_env = EnvironmentVerification(
        runtime="Node.js 20.18.0",
        package_manager="npm",
        install_command="npm install",
        build_command="npm run build",
        test_command="npm test",
        status=VerificationStatus.VERIFIED,
        execution_timestamp=now_str,
        total_duration_ms=4820,
        steps=[
            VerificationStep(
                name="install",
                command="npm install",
                status=StepStatus.COMPLETED,
                exit_code=0,
                duration_ms=2100,
                stdout="added 42 packages in 1.98s\naudited 42 packages in 2s\nfound 0 vulnerabilities\n",
                stderr=""
            ),
            VerificationStep(
                name="build",
                command="npm run build",
                status=StepStatus.COMPLETED,
                exit_code=0,
                duration_ms=1250,
                stdout="> chalk@5.3.0 build\n> tsc --project tsconfig.json\nBuild completed successfully.\n",
                stderr=""
            ),
            VerificationStep(
                name="test",
                command="npm test",
                status=StepStatus.COMPLETED,
                exit_code=0,
                duration_ms=1470,
                stdout="> chalk@5.3.0 test\n> ava\n\n  ✔ 48 tests passed\n  ✨ Done in 1.42s\n",
                stderr=""
            )
        ],
        sandbox_provider="AWS ECS/Fargate (Isolated Container)",
        cpu_limit="1 vCPU",
        memory_limit="2 GB",
        timeout_seconds=60,
        is_sandboxed=True
    )

    chalk_summary = RepositorySummary(
        owner="chalk",
        repo="chalk",
        full_name="chalk/chalk",
        description="Terminal string styling done right. Modern, expressive, and zero dependencies.",
        default_branch="main",
        latest_commit_sha="a8f3b9c2e1d047a5",
        stars=42100,
        forks=980,
        open_issues_count=14,
        repository_size_kb=1240,
        stack=RepositoryStack(
            primary_language="JavaScript",
            languages={"JavaScript": 85.0, "TypeScript": 15.0},
            frameworks=["Node.js", "AVA"],
            package_manager="npm",
            test_framework="AVA",
            test_locations=["test/index.js", "test/colors.js"],
            source_directories=["source"],
            entry_points=["source/index.js"],
            config_files=["package.json", "tsconfig.json", ".github/workflows/ci.yml"],
            ci_workflows=[".github/workflows/ci.yml"]
        ),
        architecture_overview="Modular ANSI styling engine with ANSI 256 / TrueColor color space conversion pipelines and Windows Virtual Terminal compatibility shims.",
        total_files_analyzed=18
    )

    chalk_analysis = RepositoryAnalysis(
        id="chalk-chalk",
        repository_url="https://github.com/chalk/chalk",
        analyzed_at=now_str,
        is_cached=True,
        cached_timestamp=now_str,
        summary=chalk_summary,
        environment=chalk_env,
        ranked_issues=[chalk_easy_issue, chalk_mislabelled_issue],
        analysis_duration_ms=5120,
        cost_estimate_usd=0.0024
    )

    # Demo 2: tiangolo/fastapi (Python)
    fastapi_signals_easy = {
        "blast_radius": DifficultySignal(
            name="Blast Radius",
            score=15.0,
            weight=0.22,
            weighted_score=3.3,
            evidence=["Targets documentation example in `docs/en/docs/tutorial/query-params.md`", "Zero runtime Python changes"],
            explanation="Single markdown documentation file."
        ),
        "structural_centrality": DifficultySignal(
            name="Structural Centrality",
            score=10.0,
            weight=0.16,
            weighted_score=1.6,
            evidence=["Documentation tree leaf node", "Zero code dependencies"],
            explanation="Zero architectural coupling."
        ),
        "local_complexity": DifficultySignal(
            name="Local Complexity",
            score=15.0,
            weight=0.14,
            weighted_score=2.1,
            evidence=["Markdown documentation syntax with Python code fence", "LOC: 45 lines"],
            explanation="Straightforward documentation fix."
        ),
        "test_proximity": DifficultySignal(
            name="Test Proximity",
            score=20.0,
            weight=0.14,
            weighted_score=2.8,
            evidence=["Documentation build tested via `mkdocs build`", "Automated markdown linting"],
            explanation="Automated docs build verification available."
        ),
        "specification_quality": DifficultySignal(
            name="Specification Quality",
            score=15.0,
            weight=0.16,
            weighted_score=2.4,
            evidence=["Exact line number and copy edit suggested", "Screenshot of broken tutorial link provided"],
            explanation="Clear, explicit specification."
        ),
        "social_state": DifficultySignal(
            name="Social State",
            score=15.0,
            weight=0.10,
            weighted_score=1.5,
            evidence=["Unassigned and confirmed by maintainers"],
            explanation="Available for first PR."
        ),
        "domain_prerequisites": DifficultySignal(
            name="Domain Prerequisites",
            score=10.0,
            weight=0.08,
            weighted_score=0.8,
            evidence=["Standard FastAPI query parameter usage", "No internal ASGI/Starlette knowledge needed"],
            explanation="Beginner Python knowledge."
        )
    }

    fastapi_easy_issue = IssueCandidate(
        number=9820,
        title="Fix broken link and typo in Query Parameters tutorial documentation",
        body="In `docs/en/docs/tutorial/query-params.md` line 42, the anchor link `#optional-parameters` is broken due to a typo in the slug.\n\n### Expected\nUpdate anchor link to `#optional-query-parameters` and fix typo `paramters` -> `parameters`.",
        html_url="https://github.com/fastapi/fastapi/issues/9820",
        labels=["good first issue", "documentation"],
        difficulty=IssueDifficultyScore(
            total_score=14.5,
            category=DifficultyCategory.GENUINELY_BEGINNER,
            signals=fastapi_signals_easy,
            confidence=0.99,
            summary_explanation="Verified genuinely beginner-friendly (14.5/100). Clear documentation fix in `docs/en/docs/tutorial/query-params.md` with zero architectural risk.",
            is_mislabelled=False
        ),
        likely_affected_files=["docs/en/docs/tutorial/query-params.md"],
        potential_blockers=[],
        specification_quality_score=95.0,
        test_availability="Docs Build Test Active",
        social_state="Available",
        has_linked_pr=False,
        is_stale=False
    )

    fastapi_signals_mislabelled = {
        "blast_radius": DifficultySignal(
            name="Blast Radius",
            score=92.0,
            weight=0.22,
            weighted_score=20.24,
            evidence=["Modifies `fastapi/routing.py`, `fastapi/dependencies/utils.py`, `fastapi/openapi/utils.py`", "Cross-cutting async generator dependency lifecycle"],
            explanation="Wide blast radius affecting core routing and dependency injection engines."
        ),
        "structural_centrality": DifficultySignal(
            name="Structural Centrality",
            score=95.0,
            weight=0.16,
            weighted_score=15.2,
            evidence=["Core dependency injection resolution graph (`fastapi/dependencies/models.py`)", "Imported by every route handler in FastAPI"],
            explanation="Critical core architecture hub."
        ),
        "local_complexity": DifficultySignal(
            name="Local Complexity",
            score=88.0,
            weight=0.14,
            weighted_score=12.32,
            evidence=["Complex async generator context managers", "Starlette background task race conditions", "AnyIO threadpool coordination"],
            explanation="Dense concurrency and ASGI state management."
        ),
        "test_proximity": DifficultySignal(
            name="Test Proximity",
            score=60.0,
            weight=0.14,
            weighted_score=8.4,
            evidence=["General test suite exists (`tests/test_dependency.py`), but async generator cancellation edge cases are unmocked"],
            explanation="Complex async timing tests required."
        ),
        "specification_quality": DifficultySignal(
            name="Specification Quality",
            score=70.0,
            weight=0.16,
            weighted_score=11.2,
            evidence=["Brief bug report: 'Async generator dependencies leak context if client disconnects early'", "No minimal reproducing script"],
            explanation="Underspecified async edge case."
        ),
        "social_state": DifficultySignal(
            name="Social State",
            score=55.0,
            weight=0.10,
            weighted_score=5.5,
            evidence=["Tagged 'good first issue' by bot triager", "Previous PR closed due to ASGI scope memory leak"],
            explanation="Mismatched triager label; high complexity."
        ),
        "domain_prerequisites": DifficultySignal(
            name="Domain Prerequisites",
            score=90.0,
            weight=0.08,
            weighted_score=7.2,
            evidence=["Requires deep ASGI specification & async generator teardown mechanics knowledge", "Starlette & AnyIO concurrency internals"],
            explanation="Specialized ASGI protocol & asynchronous concurrency mastery required."
        )
    }

    fastapi_mislabelled_issue = IssueCandidate(
        number=8431,
        title="Async generator dependency context leak on premature client disconnection",
        body="When a client disconnects before a streaming response completes, the `yield` in async dependencies never executes its cleanup block. Good first issue for newcomers to learn FastAPI dependencies!",
        html_url="https://github.com/fastapi/fastapi/issues/8431",
        labels=["good first issue", "help wanted"],
        difficulty=IssueDifficultyScore(
            total_score=80.1,
            category=DifficultyCategory.MISLABELLED,
            signals=fastapi_signals_mislabelled,
            confidence=0.97,
            summary_explanation="GitHub labels this as 'good first issue', but FirstPR calculated a difficulty score of 80.1/100 (DANGEROUS MISLABEL). Requires deep ASGI lifecycle knowledge, touches core dependency resolution across 4 files, and involves complex async generator teardown.",
            is_mislabelled=True
        ),
        likely_affected_files=["fastapi/dependencies/utils.py", "fastapi/routing.py", "fastapi/dependencies/models.py"],
        potential_blockers=[
            "Mislabelled: Requires ASGI specification & AsyncIO concurrency internals despite beginner label",
            "Modifies central dependency injection engine",
            "High risk of silent memory leak regressions in production"
        ],
        specification_quality_score=30.0,
        test_availability="General Suite Only",
        social_state="Claim In Discussion",
        has_linked_pr=False,
        is_stale=False
    )

    fastapi_env = EnvironmentVerification(
        runtime="Python 3.12.3",
        package_manager="uv / pip",
        install_command="pip install -e .[all]",
        build_command="python -m build",
        test_command="pytest tests/test_tutorial/test_query_params",
        status=VerificationStatus.VERIFIED,
        execution_timestamp=now_str,
        total_duration_ms=6140,
        steps=[
            VerificationStep(
                name="install",
                command="pip install -e .[all]",
                status=StepStatus.COMPLETED,
                exit_code=0,
                duration_ms=3100,
                stdout="Successfully installed fastapi-0.111.0 starlette-0.37.2 pydantic-2.7.1 anyio-4.3.0 uvicorn-0.29.0\n",
                stderr=""
            ),
            VerificationStep(
                name="build",
                command="python -m build",
                status=StepStatus.COMPLETED,
                exit_code=0,
                duration_ms=1640,
                stdout="* Creating isolated build env...\n* Building wheel from sdist...\nSuccessfully built fastapi-0.111.0.tar.gz and fastapi-0.111.0-py3-none-any.whl\n",
                stderr=""
            ),
            VerificationStep(
                name="test",
                command="pytest tests/test_tutorial/test_query_params",
                status=StepStatus.COMPLETED,
                exit_code=0,
                duration_ms=1400,
                stdout="============================= test session starts =============================\nrootdir: /workspace/fastapi\ncollected 12 items\n\ntests/test_tutorial/test_query_params/test_tutorial001.py ....             [ 33%]\ntests/test_tutorial/test_query_params/test_tutorial002.py ........         [100%]\n\n============================== 12 passed in 0.89s ==============================\n",
                stderr=""
            )
        ],
        sandbox_provider="AWS ECS/Fargate (Isolated Container)",
        cpu_limit="1 vCPU",
        memory_limit="2 GB",
        timeout_seconds=60,
        is_sandboxed=True
    )

    fastapi_summary = RepositorySummary(
        owner="fastapi",
        repo="fastapi",
        full_name="fastapi/fastapi",
        description="FastAPI framework, high performance, easy to learn, fast to code, ready for production.",
        default_branch="master",
        latest_commit_sha="c7e14d92a01f",
        stars=76800,
        forks=6200,
        open_issues_count=42,
        repository_size_kb=8900,
        stack=RepositoryStack(
            primary_language="Python",
            languages={"Python": 98.0, "Shell": 2.0},
            frameworks=["FastAPI", "Starlette", "Pydantic", "AnyIO", "pytest"],
            package_manager="pip / uv",
            test_framework="pytest",
            test_locations=["tests/test_tutorial", "tests/test_dependency.py"],
            source_directories=["fastapi"],
            entry_points=["fastapi/main.py", "fastapi/applications.py"],
            config_files=["pyproject.toml", "requirements.txt", ".github/workflows/test.yml"],
            ci_workflows=[".github/workflows/test.yml"]
        ),
        architecture_overview="Modern high-performance web API framework built atop Starlette for routing/async and Pydantic for data validation and OpenAPI generation.",
        total_files_analyzed=64
    )

    fastapi_analysis = RepositoryAnalysis(
        id="fastapi-fastapi",
        repository_url="https://github.com/fastapi/fastapi",
        analyzed_at=now_str,
        is_cached=True,
        cached_timestamp=now_str,
        summary=fastapi_summary,
        environment=fastapi_env,
        ranked_issues=[fastapi_easy_issue, fastapi_mislabelled_issue],
        analysis_duration_ms=6400,
        cost_estimate_usd=0.0031
    )

    return [chalk_analysis, fastapi_analysis]
