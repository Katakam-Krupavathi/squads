import re
from datetime import datetime, timezone
from typing import List, Dict, Any, Tuple
from ..api.schemas import DifficultySignal
from ..core.config import settings

CLAIM_PHRASES = [
    r"i('d| would)? like to work on this",
    r"can i take this",
    r"working on (a|this) fix",
    r"i am on it",
    r"opened a pr",
    r"assigned to me"
]

def calculate_social_state(
    assignees: List[str],
    comments: List[Dict[str, Any]],
    updated_at: str = None,
    has_linked_pr: bool = False
) -> Tuple[DifficultySignal, str, bool]:
    """
    Signal 6: Social State.
    Detects if the issue is already claimed, active PR in flight, abandoned, or open.
    Returns: (DifficultySignal, social_state_label, is_stale)
    """
    weight = settings.SIGNAL_WEIGHTS["social_state"]
    evidence = []
    
    is_claimed = bool(assignees)
    claimant = assignees[0] if assignees else None
    
    # Check comments for claim keywords
    recent_claim = False
    for comment in comments:
        body = (comment.get("body") or "").lower()
        if any(re.search(phrase, body) for phrase in CLAIM_PHRASES):
            recent_claim = True
            if not claimant:
                claimant = comment.get("user", {}).get("login", "contributor")

    # Check staleness
    is_stale = False
    if updated_at:
        try:
            # Parse ISO date
            dt = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
            now = datetime.now(timezone.utc)
            days_inactive = (now - dt).days
            if days_inactive > 90:
                is_stale = True
        except Exception:
            pass

    if has_linked_pr:
        state_label = "PR In Progress"
        score = 85.0
        evidence.append("Active Pull Request already linked to this issue.")
    elif is_claimed:
        if is_stale:
            state_label = "Stale Claim (Likely Abandoned)"
            score = 35.0
            evidence.append(f"Assigned to @{claimant} but inactive for >90 days — prime candidate to unblock.")
        else:
            state_label = f"Claimed by @{claimant}"
            score = 75.0
            evidence.append(f"Currently assigned to active contributor @{claimant}.")
    elif recent_claim:
        if is_stale:
            state_label = "Stale Claim (Likely Abandoned)"
            score = 35.0
            evidence.append("Previous contributor expressed intent but went inactive.")
        else:
            state_label = "Claim In Discussion"
            score = 65.0
            evidence.append(f"Commenter expressed intent to work on issue: '{claimant}'.")
    elif is_stale:
        state_label = "Stale (Unassigned)"
        score = 30.0
        evidence.append("Open and inactive for >90 days — unassigned and ready.")
    else:
        state_label = "Available"
        score = 15.0
        evidence.append("Active, unassigned, and open for contributions.")

    weighted = round(score * weight, 2)
    explanation = f"Social state: {state_label}."

    return DifficultySignal(
        name="Social State",
        score=score,
        weight=weight,
        weighted_score=weighted,
        evidence=evidence,
        explanation=explanation
    ), state_label, is_stale
