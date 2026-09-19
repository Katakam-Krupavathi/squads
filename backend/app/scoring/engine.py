from typing import List, Dict, Any, Optional
from ..api.schemas import (
    IssueCandidate,
    IssueDifficultyScore,
    DifficultyCategory,
    DifficultySignal
)
from ..core.config import settings
from .blast_radius import calculate_blast_radius
from .centrality import calculate_structural_centrality
from .complexity import calculate_local_complexity
from .test_proximity import calculate_test_proximity
from .specification import calculate_specification_quality
from .social_state import calculate_social_state
from .domain import calculate_domain_prerequisites

BEGINNER_LABEL_KEYWORDS = {"good first issue", "good-first-issue", "beginner", "easy", "starter", "up-for-grabs", "help wanted"}

def score_issue_candidate(
    issue_data: Dict[str, Any],
    repo_file_paths: List[str],
    file_contents_map: Dict[str, str] = None,
    comments: List[Dict[str, Any]] = None,
    test_framework: Optional[str] = None
) -> IssueCandidate:
    """
    Evaluates an issue candidate across all 7 signals and classifies difficulty.
    """
    number = issue_data.get("number", 0)
    title = issue_data.get("title", "")
    body = issue_data.get("body", "")
    html_url = issue_data.get("html_url", "")
    labels = [l.get("name") if isinstance(l, dict) else str(l) for l in issue_data.get("labels", [])]
    assignees = [a.get("login") if isinstance(a, dict) else str(a) for a in issue_data.get("assignees", [])]
    updated_at = issue_data.get("updated_at")
    
    # 1. Signal 1: Blast Radius
    sig_blast, affected_files = calculate_blast_radius(title, body, repo_file_paths)
    
    # 2. Signal 2: Structural Centrality
    sig_centrality = calculate_structural_centrality(affected_files, repo_file_paths)
    
    # 3. Signal 3: Local Complexity
    sig_complexity = calculate_local_complexity(affected_files, file_contents_map)
    
    # 4. Signal 4: Test Proximity
    sig_test, matching_tests = calculate_test_proximity(affected_files, repo_file_paths, test_framework)
    
    # 5. Signal 5: Specification Quality
    sig_spec = calculate_specification_quality(title, body)
    
    # 6. Signal 6: Social State
    has_linked_pr = "pull_request" in issue_data or any("pr" in l.lower() for l in labels)
    sig_social, social_state_label, is_stale = calculate_social_state(
        assignees, comments or [], updated_at, has_linked_pr
    )
    
    # 7. Signal 7: Domain Prerequisites
    sig_domain = calculate_domain_prerequisites(title, body, repo_file_paths)
    
    signals: Dict[str, DifficultySignal] = {
        "blast_radius": sig_blast,
        "structural_centrality": sig_centrality,
        "local_complexity": sig_complexity,
        "test_proximity": sig_test,
        "specification_quality": sig_spec,
        "social_state": sig_social,
        "domain_prerequisites": sig_domain
    }
    
    # Calculate transparent weighted total score
    total_score = sum(s.weighted_score for s in signals.values())
    total_score = round(max(0.0, min(100.0, total_score)), 1)
    
    # Check if original GitHub labels claimed beginner
    has_beginner_label = any(any(bk in l.lower() for bk in BEGINNER_LABEL_KEYWORDS) for l in labels)
    
    # Classification Logic (Section 5B & Section 7)
    is_mislabelled = False
    if total_score <= settings.GENUINELY_BEGINNER_MAX_SCORE:
        category = DifficultyCategory.GENUINELY_BEGINNER
    elif total_score <= settings.MODERATE_MAX_SCORE:
        category = DifficultyCategory.MODERATE
    else:
        # Score > 65
        if has_beginner_label:
            category = DifficultyCategory.MISLABELLED
            is_mislabelled = True
        else:
            category = DifficultyCategory.MODERATE
            
    # Compile potential blockers
    potential_blockers = []
    if is_mislabelled:
        potential_blockers.append("Mislabelled: Requires cross-cutting architectural changes or complex domain knowledge despite beginner label.")
    if sig_test.score > 70:
        potential_blockers.append("Lacks automated test safety harness.")
    if sig_spec.score > 70:
        potential_blockers.append("Underspecified issue description without clear reproduction steps.")
    if social_state_label.startswith("Claimed"):
        potential_blockers.append(f"Currently claimed ({social_state_label}).")
    if sig_domain.score > 60:
        potential_blockers.append("Requires advanced domain prerequisites.")
        
    # Compile human-readable summary explanation grounded in evidence
    if is_mislabelled:
        summary_explanation = (
            f"Mislabelled: GitHub labels this as a good first issue, but FirstPR calculated a difficulty score of {total_score}/100. "
            f"Analysis reveals heavy structural risk: {sig_blast.explanation} {sig_centrality.explanation} "
            f"{sig_domain.explanation}"
        )
    elif category == DifficultyCategory.GENUINELY_BEGINNER:
        summary_explanation = (
            f"Verified beginner-friendly ({total_score}/100). {sig_blast.explanation} "
            f"{sig_spec.explanation} Clear path for first-time contributors."
        )
    else:
        summary_explanation = (
            f"Moderate difficulty ({total_score}/100). {sig_blast.explanation} "
            f"{sig_complexity.explanation} Best tackled with prior framework familiarity."
        )
        
    difficulty_score = IssueDifficultyScore(
        total_score=total_score,
        category=category,
        signals=signals,
        confidence=0.92 if len(affected_files) > 0 else 0.85,
        summary_explanation=summary_explanation,
        is_mislabelled=is_mislabelled
    )
    
    return IssueCandidate(
        number=number,
        title=title,
        body=body,
        html_url=html_url,
        labels=labels,
        state=issue_data.get("state", "open"),
        author=issue_data.get("user", {}).get("login") if isinstance(issue_data.get("user"), dict) else None,
        created_at=issue_data.get("created_at"),
        updated_at=updated_at,
        comments_count=issue_data.get("comments", 0),
        assignees=assignees,
        difficulty=difficulty_score,
        likely_affected_files=affected_files,
        potential_blockers=potential_blockers,
        specification_quality_score=round(100.0 - sig_spec.score, 1),
        test_availability="Dedicated Tests Available" if matching_tests else "General Suite" if repo_file_paths else "None",
        social_state=social_state_label,
        has_linked_pr=has_linked_pr,
        is_stale=is_stale
    )
