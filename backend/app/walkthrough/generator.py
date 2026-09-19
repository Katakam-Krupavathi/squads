import re
from typing import List, Dict, Any, Optional
from ..api.schemas import GroundedWalkthrough, FileReadingStep, IssueCandidate
from .conventions import extract_repository_conventions

def validate_and_filter_paths(suggested_paths: List[str], repo_file_paths: List[str]) -> List[str]:
    """
    Section 18 Grounding Rule:
    Never display an LLM-generated file path unless the path exists in the repository.
    """
    repo_set = set(repo_file_paths)
    validated = []
    
    for path in suggested_paths:
        clean = path.strip().lstrip("/").replace("\\", "/")
        if clean in repo_set:
            validated.append(clean)
        else:
            # Check for close matching base name in repo
            basename = clean.split("/")[-1]
            match = next((p for p in repo_file_paths if p.endswith(f"/{basename}") or p == basename), None)
            if match and match not in validated:
                validated.append(match)
                
    return validated

def generate_grounded_walkthrough(
    issue: IssueCandidate,
    repo_file_paths: List[str],
    contributing_content: Optional[str] = None,
    readme_content: Optional[str] = None,
    test_framework: Optional[str] = None
) -> GroundedWalkthrough:
    """
    Generates a structured, evidence-grounded contribution brief for an issue candidate.
    Strictly validates all file paths against repository tree.
    """
    # 1. Gather candidate files
    raw_suggested_files = list(issue.likely_affected_files)
    
    # If no files detected in issue, pick relevant source files & entry points from tree
    if not raw_suggested_files:
        for p in repo_file_paths:
            if any(p.startswith(prefix) for prefix in ["src/", "app/", "lib/"]) and not p.endswith((".test.ts", "_test.py", ".spec.ts")):
                raw_suggested_files.append(p)
                if len(raw_suggested_files) >= 3:
                    break

    # 2. Strict grounding validation against repository tree
    validated_files = validate_and_filter_paths(raw_suggested_files, repo_file_paths)
    
    # 3. Find related tests
    all_tests = [
        p for p in repo_file_paths
        if any(p.startswith(prefix) for prefix in ["tests/", "test/", "__tests__/"]) or
           p.endswith(("_test.go", ".test.ts", ".test.js", ".spec.ts", ".spec.js", "test_.py", "_test.py"))
    ]
    
    relevant_tests = []
    for target in validated_files:
        base = target.split("/")[-1].split(".")[0]
        for t in all_tests:
            if base in t and t not in relevant_tests:
                relevant_tests.append(t)

    # If no direct test file, suggest first 2 repo tests
    if not relevant_tests and all_tests:
        relevant_tests = all_tests[:2]

    # 4. Construct file reading steps in logical order
    files_to_read: List[FileReadingStep] = []
    order = 1
    
    # If README or CONTRIBUTING exists, put reading them first
    if "README.md" in repo_file_paths:
        files_to_read.append(FileReadingStep(
            order=order,
            path="README.md",
            purpose="Understand project overview, architecture, and developer setup instructions.",
            is_target_file=False,
            exists_in_repo=True
        ))
        order += 1

    for vf in validated_files:
        files_to_read.append(FileReadingStep(
            order=order,
            path=vf,
            purpose="Primary module to implement the required changes or bug fix.",
            is_target_file=True,
            exists_in_repo=True
        ))
        order += 1

    for tf in relevant_tests[:2]:
        files_to_read.append(FileReadingStep(
            order=order,
            path=tf,
            purpose="Verify existing test assertions and add new test cases covering the fix.",
            is_target_file=False,
            exists_in_repo=True
        ))
        order += 1

    # 5. Formulate explanations
    simple_explanation = (
        f"This issue requests a fix for: **{issue.title}**. "
        f"The goal is to update the target module behavior while maintaining backwards compatibility and green test suites."
    )
    
    difficulty_justification = (
        f"Difficulty rated as **{issue.difficulty.category.value}** ({issue.difficulty.total_score}/100). "
        f"{issue.difficulty.summary_explanation}"
    )

    likely_change_location = (
        f"Likely located in `{validated_files[0]}`" if validated_files else "FirstPR could not confidently identify the exact change location."
    )

    test_guidance = (
        f"Execute `{test_framework or 'test runner'}` after making changes. "
        f"Add unit tests inside `{relevant_tests[0]}` to validate both happy path and edge cases."
        if relevant_tests else "No direct unit test suite found. Run repository build and manual smoke tests."
    )

    conventions = extract_repository_conventions(contributing_content, readme_content, repo_file_paths)

    return GroundedWalkthrough(
        issue_number=issue.number,
        issue_title=issue.title,
        simple_explanation=simple_explanation,
        difficulty_justification=difficulty_justification,
        files_to_read=files_to_read,
        likely_change_location=likely_change_location,
        likely_functions_or_classes=[],
        relevant_tests=relevant_tests,
        test_validation_guidance=test_guidance,
        repository_conventions=conventions,
        grounding_validated=True,
        validated_file_count=len(files_to_read),
        model_provider="Amazon Bedrock + FirstPR Grounding Verifier"
    )
