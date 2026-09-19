import re
from typing import List, Dict, Any, Tuple
from ..api.schemas import DifficultySignal
from ..core.config import settings

# Regex to detect file paths and symbols inside issue body / title
PATH_REGEX = re.compile(r"([a-zA-Z0-9_\-\./]+\.[a-zA-Z0-9_]{1,10})")
SYMBOL_REGEX = re.compile(r"`([a-zA-Z0-9_]{3,40}(?:\(\))?)`")

def calculate_blast_radius(
    issue_title: str,
    issue_body: str,
    repo_file_paths: List[str]
) -> Tuple[DifficultySignal, List[str]]:
    """
    Signal 1: Blast Radius.
    Estimates the number of files/modules affected and calculates risk.
    """
    text = f"{issue_title}\n{issue_body or ''}"
    weight = settings.SIGNAL_WEIGHTS["blast_radius"]
    
    # 1. Detect mentioned paths matching actual repository files
    mentioned_paths = set()
    for match in PATH_REGEX.finditer(text):
        candidate = match.group(1).lstrip("/").replace("\\", "/")
        if candidate in repo_file_paths or any(p.endswith(candidate) for p in repo_file_paths):
            matching_full = next((p for p in repo_file_paths if p == candidate or p.endswith(candidate)), candidate)
            mentioned_paths.add(matching_full)
            
    # 2. Check for broad scope keywords
    broad_scope_keywords = ["refactor", "rewrite", "migrate", "architecture", "deprecate", "redesign", "all files", "global"]
    has_broad_keyword = any(kw in text.lower() for kw in broad_scope_keywords)
    
    # 3. Check for specific single-file/localized keywords
    localized_keywords = ["typo", "docs", "readme", "comment", "lint", "css", "color", "button", "rename", "fix link"]
    has_localized_keyword = any(kw in text.lower() for kw in localized_keywords)
    
    evidence = []
    affected_files = list(mentioned_paths)
    
    # Calculate score (0 = very localized/1 file, 100 = entire repo refactor)
    if has_localized_keyword and len(affected_files) <= 1:
        raw_score = 15.0
        evidence.append("Issue concerns localized changes (e.g., documentation, typo, or single UI element).")
    elif len(affected_files) == 1:
        raw_score = 25.0
        evidence.append(f"Directly targets a single file: `{affected_files[0]}`.")
    elif len(affected_files) == 2:
        raw_score = 45.0
        evidence.append(f"Targets {len(affected_files)} localized files: {', '.join(f'`{f}`' for f in affected_files)}.")
    elif len(affected_files) >= 3:
        raw_score = min(85.0, 40.0 + len(affected_files) * 10.0)
        evidence.append(f"Large blast radius: touches at least {len(affected_files)} separate modules.")
    else:
        # If no explicit paths, estimate from text breadth
        if has_broad_keyword:
            raw_score = 80.0
            evidence.append("Issue description indicates architectural or cross-cutting changes.")
        else:
            raw_score = 35.0
            evidence.append("Moderate scope with localized feature changes inferred.")
            
    if has_broad_keyword and raw_score < 70.0:
        raw_score = 75.0
        evidence.append("Flagged: Contains broad refactoring scope terms.")

    score = max(5.0, min(100.0, raw_score))
    weighted = round(score * weight, 2)
    
    explanation = f"Estimated blast radius is {'low (1-2 files)' if score < 40 else 'moderate' if score < 70 else 'high (cross-module)'} with score {score}/100."
    
    signal = DifficultySignal(
        name="Blast Radius",
        score=score,
        weight=weight,
        weighted_score=weighted,
        evidence=evidence,
        explanation=explanation
    )
    return signal, affected_files
