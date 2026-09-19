import re
import os
from typing import Tuple, Optional, List

# Strict regex for public GitHub repository URLs
GITHUB_URL_REGEX = re.compile(
    r"^https?://(www\.)?github\.com/(?P<owner>[a-zA-Z0-9_\-\.]+)/(?P<repo>[a-zA-Z0-9_\-\.]+)/?$"
)

# Allowlisted commands and package managers to prevent arbitrary command injection
ALLOWLISTED_EXECUTABLES = {
    # Node / JS / TS
    "npm", "pnpm", "yarn", "bun", "npx",
    # Python
    "python", "python3", "pytest", "pip", "poetry", "uv", "pipenv", "flake8", "black", "mypy",
    # Go
    "go",
    # General build
    "make", "cargo"
}

DISALLOWED_PATTERNS = [
    r"[;&|`$><]",          # Command chaining and redirection
    r"\.\./",              # Path traversal
    r"\brm\s+-rf\b",       # Destructive deletions
    r"\bcurl\b.*\|\s*\bsh\b", # Pipe to shell
    r"\bwget\b.*\|\s*\bsh\b",
    r"\bchmod\b",
    r"\bchown\b",
    r"\bsudo\b",
    r"\bshutdown\b",
    r"\breboot\b",
    r"\bkill\b",
    r"\bpkill\b",
    r"169\.254\.169\.254", # AWS metadata IP defense (SSRF/Credential theft)
    r"metadata\.google\.internal",
]

def parse_and_validate_github_url(url: str) -> Tuple[bool, Optional[str], Optional[str], Optional[str]]:
    """
    Validates a GitHub URL and extracts (owner, repo).
    Returns (is_valid, owner, repo, error_message)
    """
    if not url or not isinstance(url, str):
        return False, None, None, "Repository URL cannot be empty."
    
    url = url.strip()
    
    # Strip .git ending if present
    if url.endswith(".git"):
        url = url[:-4]
        
    match = GITHUB_URL_REGEX.match(url)
    if not match:
        return (
            False,
            None,
            None,
            "Invalid GitHub URL. Must be in the form 'https://github.com/owner/repo'."
        )
    
    owner = match.group("owner")
    repo = match.group("repo")
    
    # Check for reserved / invalid names
    if owner.lower() in {"settings", "organizations", "login", "explore", "marketplace", "features", "pricing"}:
        return False, None, None, f"Invalid repository owner '{owner}'."
        
    return True, owner, repo, None

def is_safe_relative_path(path: str, base_dir: str = "") -> bool:
    """
    Ensures that a path does not escape the repository boundary (Path Traversal Defense).
    Rejects absolute paths and traversal components.
    """
    if not path or "\x00" in path:
        return False
        
    raw_path = path.strip()
    if raw_path.startswith(("/", "\\")) or ":" in raw_path:
        return False

    normalized = os.path.normpath(raw_path)
    
    # Check for path traversal elements
    if normalized.startswith("..") or "/../" in normalized.replace("\\", "/") or normalized.startswith(("\\", "/")):
        return False
        
    if base_dir:
        full_path = os.path.abspath(os.path.join(base_dir, normalized))
        base_abs = os.path.abspath(base_dir)
        if not full_path.startswith(base_abs):
            return False
            
    return True

def validate_and_sanitize_command(command: str) -> Tuple[bool, Optional[List[str]], Optional[str]]:
    """
    Validates a command against allowlists and splits into safe argument list.
    Rejects shell operators (;, &&, ||, |, `, $, >, <) to prevent injection.
    """
    if not command or not isinstance(command, str):
        return False, None, "Empty command provided."
    
    cleaned = command.strip()
    
    # Check disallowed patterns
    for pattern in DISALLOWED_PATTERNS:
        if re.search(pattern, cleaned, re.IGNORECASE):
            return False, None, f"Command contains forbidden security pattern: '{pattern}'"
            
    parts = cleaned.split()
    if not parts:
        return False, None, "No executable specified."
        
    executable = os.path.basename(parts[0]).lower()
    if executable.endswith(".exe"):
        executable = executable[:-4]
        
    if executable not in ALLOWLISTED_EXECUTABLES:
        return False, None, f"Executable '{executable}' is not in the sandbox allowlist ({', '.join(sorted(ALLOWLISTED_EXECUTABLES))})."
        
    return True, parts, None
