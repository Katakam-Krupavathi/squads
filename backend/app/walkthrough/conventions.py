import re
from typing import Dict, Any, List, Optional

def extract_repository_conventions(
    contributing_content: Optional[str],
    readme_content: Optional[str],
    all_file_paths: List[str]
) -> Dict[str, Any]:
    """
    Extracts conventions, PR requirements, test commands, and lint rules from repository files.
    """
    conventions = {
        "branch_naming": "feature/issue-number-description",
        "commit_style": "Conventional Commits (e.g., feat:, fix:, docs:, test:)",
        "pr_checklist": [
            "Link related issue in PR description",
            "Ensure automated test suite passes",
            "Add tests for new functionality or bug fixes",
            "Keep commits atomic and well-documented"
        ],
        "lint_tool": "Standard linter",
        "formatting_tool": "Standard formatter",
        "contributing_guide_path": None
    }
    
    # Check if CONTRIBUTING.md exists
    for path in all_file_paths:
        if path.lower() in {"contributing.md", "contributing", ".github/contributing.md", "docs/contributing.md"}:
            conventions["contributing_guide_path"] = path
            break

    # Detect linter / formatter from file paths
    paths_set = set(all_file_paths)
    if ".eslintrc.js" in paths_set or ".eslintrc.json" in paths_set or "eslint.config.js" in paths_set:
        conventions["lint_tool"] = "ESLint"
    elif "ruff.toml" in paths_set or any("ruff" in p for p in paths_set):
        conventions["lint_tool"] = "Ruff"
    elif ".flake8" in paths_set:
        conventions["lint_tool"] = "Flake8"
        
    if ".prettierrc" in paths_set or "prettier.config.js" in paths_set:
        conventions["formatting_tool"] = "Prettier"
    elif "pyproject.toml" in paths_set:
        conventions["formatting_tool"] = "Black / Ruff Format"

    # Analyze CONTRIBUTING.md text if present
    if contributing_content:
        lower_c = contributing_content.lower()
        if "conventional commit" in lower_c or "cz" in lower_c:
            conventions["commit_style"] = "Strict Conventional Commits (`feat:`, `fix:`, `refactor:`)"
        if "sign off" in lower_c or "dco" in lower_c:
            conventions["pr_checklist"].append("Sign off commits (DCO / Developer Certificate of Origin)")
        if "fork" in lower_c:
            conventions["pr_checklist"].insert(0, "Fork repository and create a branch from main")

    return conventions
