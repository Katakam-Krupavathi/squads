import os
from typing import List, Dict, Any, Set
from ..core.config import settings

# Directories and extensions to ignore or deprioritize (Section 8)
IGNORED_DIRECTORIES: Set[str] = {
    "node_modules", ".git", "dist", "build", "coverage", ".next", ".nuxt",
    "vendor", "__pycache__", ".pytest_cache", ".venv", "venv", "env",
    ".idea", ".vscode", "target", "bin", "obj", ".mypy_cache", ".tox",
    ".cache", ".turbo", "out", "pkg", "Pods"
}

IGNORED_EXTENSIONS: Set[str] = {
    # Binaries & archives
    ".exe", ".dll", ".so", ".dylib", ".bin", ".zip", ".tar", ".gz", ".7z", ".rar",
    # Images & media
    ".png", ".jpg", ".jpeg", ".gif", ".ico", ".svg", ".webp", ".mp4", ".mp3", ".pdf",
    # Fonts
    ".woff", ".woff2", ".ttf", ".eot", ".otf",
    # Minified & maps
    ".min.js", ".min.css", ".map", ".bundle.js",
    # Lockfiles (deprioritized from AST/code analysis)
    ".lock", ".lockb", "package-lock.json", "yarn.lock", "pnpm-lock.yaml"
}

# High-priority code directories
PRIORITY_DIRECTORIES: List[str] = [
    "src", "app", "lib", "packages", "internal", "cmd", "core", "api", "components",
    "tests", "test", "__tests__"
]

def is_ignored_path(path: str) -> bool:
    """
    Checks whether a relative path matches ignored directories or extensions.
    """
    if not path:
        return True
    
    parts = path.replace("\\", "/").split("/")
    
    # Check directory names
    for part in parts[:-1]:
        if part in IGNORED_DIRECTORIES:
            return True
            
    # Check extension
    filename = parts[-1]
    name_lower = filename.lower()
    
    for ext in IGNORED_EXTENSIONS:
        if name_lower.endswith(ext):
            return True
            
    return False

def is_priority_path(path: str) -> bool:
    """
    Checks whether path resides in high-priority source directories.
    """
    parts = path.replace("\\", "/").split("/")
    for part in parts:
        if part.lower() in PRIORITY_DIRECTORIES:
            return True
    return False

def filter_repository_tree(tree_items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """
    Filters and caps repository tree files according to hackathon resource limits.
    Returns prioritized and capped list of file descriptors.
    """
    valid_files: List[Dict[str, Any]] = []
    total_bytes = 0
    
    # Separate priority vs secondary files
    priority_files: List[Dict[str, Any]] = []
    secondary_files: List[Dict[str, Any]] = []
    
    for item in tree_items:
        # GitHub tree items have 'type' ('blob' or 'tree') and 'path'
        item_type = item.get("type", "blob")
        if item_type != "blob":
            continue
            
        path = item.get("path", "")
        if is_ignored_path(path):
            continue
            
        size = item.get("size", 0)
        if size > settings.MAX_FILE_SIZE_BYTES:
            continue
            
        if is_priority_path(path):
            priority_files.append(item)
        else:
            secondary_files.append(item)
            
    # Combine priority files first, then secondary
    combined = priority_files + secondary_files
    
    for item in combined:
        if len(valid_files) >= settings.MAX_FILES_TO_ANALYZE:
            break
            
        size = item.get("size", 0)
        if total_bytes + size > settings.MAX_TOTAL_BYTES:
            break
            
        valid_files.append(item)
        total_bytes += size
        
    return valid_files
