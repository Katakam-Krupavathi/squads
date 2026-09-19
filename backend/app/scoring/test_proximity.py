import os
from typing import List, Tuple
from ..api.schemas import DifficultySignal
from ..core.config import settings

def calculate_test_proximity(
    affected_files: List[str],
    all_file_paths: List[str],
    test_framework: str = None
) -> Tuple[DifficultySignal, List[str]]:
    """
    Signal 4: Test Proximity.
    Measures presence and proximity of test suites for target files.
    Strong nearby test coverage reduces risk (gives a low difficulty score).
    """
    weight = settings.SIGNAL_WEIGHTS["test_proximity"]
    evidence = []
    matching_tests = []
    
    all_tests = [
        p for p in all_file_paths
        if any(p.startswith(prefix) for prefix in ["tests/", "test/", "__tests__/"]) or
           p.endswith(("_test.go", ".test.ts", ".test.js", ".spec.ts", ".spec.js", "test_.py", "_test.py"))
    ]
    
    if not all_tests:
        score = 85.0
        evidence.append("No automated test suite detected in repository — contributor has no safety harness.")
        return DifficultySignal(
            name="Test Proximity",
            score=score,
            weight=weight,
            weighted_score=round(score * weight, 2),
            evidence=evidence,
            explanation="High risk due to missing automated test coverage."
        ), []

    # Look for co-located or identically named test files for affected files
    for target in affected_files:
        base_name = os.path.splitext(os.path.basename(target))[0]
        for test_file in all_tests:
            if base_name in test_file:
                matching_tests.append(test_file)

    matching_tests = list(set(matching_tests))
    
    if matching_tests:
        score = 20.0
        evidence.append(f"Dedicated test suite found: {', '.join(f'`{t}`' for t in matching_tests[:3])}.")
        if test_framework:
            evidence.append(f"Standard test harness active ({test_framework}).")
    elif all_tests:
        score = 45.0
        evidence.append(f"Repository has {len(all_tests)} test files, but no direct 1:1 test match for target module.")
    else:
        score = 80.0
        evidence.append("Target functionality lacks test coverage.")

    weighted = round(score * weight, 2)
    explanation = f"Test harness protection is {'excellent (dedicated tests)' if score < 30 else 'moderate (general repo tests)' if score < 60 else 'weak or missing'}."

    return DifficultySignal(
        name="Test Proximity",
        score=score,
        weight=weight,
        weighted_score=weighted,
        evidence=evidence,
        explanation=explanation
    ), matching_tests
