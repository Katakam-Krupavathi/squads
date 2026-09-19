import pytest
from app.scoring.engine import score_issue_candidate
from app.walkthrough.generator import generate_grounded_walkthrough, validate_and_filter_paths

def test_hallucinated_paths_rejected():
    repo_files = [
        "src/components/Button.tsx",
        "src/utils/format.ts",
        "tests/Button.test.tsx",
        "package.json",
        "README.md"
    ]
    # Suggested paths contain hallucinated/imaginary files
    suggested = [
        "src/components/Button.tsx",
        "src/non_existent_module/magic.ts",
        "lib/phantom.js"
    ]
    validated = validate_and_filter_paths(suggested, repo_files)
    assert "src/components/Button.tsx" in validated
    assert "src/non_existent_module/magic.ts" not in validated
    assert "lib/phantom.js" not in validated

def test_generate_grounded_walkthrough():
    repo_files = [
        "src/index.js",
        "test/index.test.js",
        "README.md",
        "package.json"
    ]
    issue_data = {
        "number": 42,
        "title": "Fix index export helper",
        "body": "Target `src/index.js` helper export.",
        "html_url": "https://github.com/example/repo/issues/42",
        "labels": ["good first issue"],
        "assignees": []
    }
    candidate = score_issue_candidate(issue_data, repo_files)
    walkthrough = generate_grounded_walkthrough(candidate, repo_files)
    
    assert walkthrough.grounding_validated is True
    assert len(walkthrough.files_to_read) > 0
    # Assert every single file in reading list actually exists in repo
    for step in walkthrough.files_to_read:
        assert step.path in repo_files, f"Hallucinated file found in reading order: {step.path}"
