import re
from typing import List, Dict, Optional
from ..api.schemas import DifficultySignal
from ..core.config import settings

def calculate_local_complexity(
    affected_files: List[str],
    file_contents_map: Dict[str, str] = None
) -> DifficultySignal:
    """
    Signal 3: Local Complexity.
    Measures LOC, branching, nesting, and function size in target files.
    """
    weight = settings.SIGNAL_WEIGHTS["local_complexity"]
    evidence = []
    
    if not affected_files or not file_contents_map:
        score = 30.0
        evidence.append("Standard cyclomatic complexity baseline inferred.")
        return DifficultySignal(
            name="Local Complexity",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 2),
            evidence=evidence,
            explanation="Normal local complexity with standard branching."
        )

    total_lines = 0
    max_indentation = 0
    branch_count = 0
    
    for path in affected_files:
        content = file_contents_map.get(path, "")
        if not content:
            continue
            
        lines = content.splitlines()
        total_lines += len(lines)
        
        for line in lines:
            if not line.strip() or line.strip().startswith(("#", "//", "/*", "*")):
                continue
            # Measure indentation levels (tabs or 4 spaces)
            leading_spaces = len(line) - len(line.lstrip(" "))
            indent_level = leading_spaces // 4
            if indent_level > max_indentation:
                max_indentation = indent_level
                
            # Count branch points
            if re.search(r"\b(if|elif|else|for|while|switch|case|catch|except|try)\b", line):
                branch_count += 1

    avg_lines = total_lines / max(1, len(affected_files))
    
    if avg_lines > 800 or max_indentation >= 6 or branch_count > 60:
        score = 80.0
        evidence.append(f"High local complexity: target file has {int(avg_lines)} LOC with {max_indentation} levels of nesting.")
    elif avg_lines > 300 or max_indentation >= 4 or branch_count > 25:
        score = 55.0
        evidence.append(f"Moderate complexity: target file has {int(avg_lines)} LOC and {branch_count} branch points.")
    else:
        score = 25.0
        evidence.append(f"Clean, low-complexity target file ({int(avg_lines)} LOC, max nesting {max_indentation}).")

    weighted = round(score * weight, 2)
    explanation = f"Target code complexity is {'simple and accessible' if score < 40 else 'moderately complex' if score < 70 else 'dense and deeply nested'}."

    return DifficultySignal(
        name="Local Complexity",
        score=score,
        weight=weight,
        weighted_score=weighted,
        evidence=evidence,
        explanation=explanation
    )
