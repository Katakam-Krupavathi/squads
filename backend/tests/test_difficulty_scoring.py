import pytest
from app.core.config import settings
from app.scoring.engine import score_issue_candidate
from app.api.schemas import DifficultyCategory

def test_signal_weights_sum_to_one():
    total_weight = sum(settings.SIGNAL_WEIGHTS.values())
    assert abs(total_weight - 1.0) < 0.001, f"Signal weights must sum to 1.0, got {total_weight}"

def test_score_genuinely_beginner_issue():
    issue_data = {
        "number": 101,
        "title": "Fix typo in documentation link for getting started",
        "body": "In `docs/intro.md` line 12, fix typo in URL from `htps:` to `https:`.\n\n### Steps to Reproduce\nClick getting started link.",
        "html_url": "https://github.com/example/repo/issues/101",
        "labels": [{"name": "good first issue"}, {"name": "documentation"}],
        "assignees": []
    }
    repo_files = ["docs/intro.md", "src/index.js", "test/index.test.js", "package.json"]
    candidate = score_issue_candidate(issue_data, repo_files, test_framework="Vitest")
    
    assert candidate.difficulty.total_score <= 35.0
    assert candidate.difficulty.category == DifficultyCategory.GENUINELY_BEGINNER
    assert candidate.difficulty.is_mislabelled is False
    assert len(candidate.likely_affected_files) >= 1

def test_score_mislabelled_issue_exposed():
    # Issue labelled "good first issue" on GitHub, but touches core architecture, consensus, and kernel sockets
    issue_data = {
        "number": 999,
        "title": "Refactor distributed Raft consensus leader election and deadlock in kernel socket buffers",
        "body": "We need to rewrite the entire cluster state machine across `src/core/raft.go` and `src/core/consensus.go` to prevent deadlocks during network partitions.\nGood first issue for beginners!",
        "html_url": "https://github.com/example/repo/issues/999",
        "labels": [{"name": "good first issue"}],
        "assignees": []
    }
    repo_files = ["src/core/raft.go", "src/core/consensus.go", "src/socket.go", "main.go"]
    candidate = score_issue_candidate(issue_data, repo_files)
    
    assert candidate.difficulty.total_score > 65.0
    assert candidate.difficulty.category == DifficultyCategory.MISLABELLED
    assert candidate.difficulty.is_mislabelled is True
    assert "Mislabelled" in candidate.difficulty.summary_explanation
