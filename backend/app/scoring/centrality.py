from typing import List, Dict, Set, Tuple
from ..api.schemas import DifficultySignal
from ..core.config import settings

def calculate_structural_centrality(
    affected_files: List[str],
    all_file_paths: List[str],
    import_map: Dict[str, List[str]] = None
) -> DifficultySignal:
    """
    Signal 2: Structural Centrality.
    Measures whether target files are core architectural hubs vs leaf modules.
    """
    weight = settings.SIGNAL_WEIGHTS["structural_centrality"]
    evidence = []
    
    if not affected_files:
        # Default neutral leaf assumption
        score = 30.0
        evidence.append("No central core bottlenecks identified in target files.")
        return DifficultySignal(
            name="Structural Centrality",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 2),
            evidence=evidence,
            explanation="Target appears to be a leaf module or localized feature."
        )

    # Core system paths heuristics
    core_prefixes = ["src/core", "core/", "lib/core", "engine/", "kernel/", "internal/core", "base/", "common/"]
    leaf_prefixes = ["docs/", "examples/", "website/", "ui/components", "templates/", "scripts/"]
    
    is_core = any(any(af.startswith(p) or f"/{p}" in af for p in core_prefixes) for af in affected_files)
    is_leaf = any(any(af.startswith(p) for p in leaf_prefixes) for af in affected_files)
    
    # Check entry point or config file modification
    is_entry_point = any(af in {"src/index.ts", "src/index.js", "app.py", "main.py", "main.go"} for af in affected_files)
    
    # Analyze import graph incoming connections if import_map is available
    incoming_counts = 0
    if import_map:
        for target in affected_files:
            for source, imports in import_map.items():
                if target in imports:
                    incoming_counts += 1

    if is_entry_point:
        score = 80.0
        evidence.append("Modifies primary application entry point / bootstrap layer.")
    elif is_core or incoming_counts >= 10:
        score = 85.0
        evidence.append(f"Modifies central architecture hub with {incoming_counts} incoming module dependencies.")
    elif is_leaf:
        score = 15.0
        evidence.append("Target files are leaf nodes with zero downstream module dependencies.")
    elif incoming_counts > 3:
        score = 60.0
        evidence.append(f"Target has moderate dependencies ({incoming_counts} importing modules).")
    else:
        score = 35.0
        evidence.append("Target files have low structural coupling (isolated component).")

    weighted = round(score * weight, 2)
    explanation = f"Structural impact is {'minimal (leaf node)' if score < 40 else 'moderate' if score < 70 else 'high risk (central core)'}."

    return DifficultySignal(
        name="Structural Centrality",
        score=score,
        weight=weight,
        weighted_score=weighted,
        evidence=evidence,
        explanation=explanation
    )
