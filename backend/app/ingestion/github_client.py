import httpx
import base64
from typing import Dict, List, Optional, Any, Tuple
from ..core.config import settings
from ..api.schemas import RepositorySummary, RepositoryStack

class GitHubClient:
    def __init__(self, token: Optional[str] = None):
        self.token = token or settings.GITHUB_TOKEN
        self.headers = {
            "Accept": "application/vnd.github.v3+json",
            "User-Agent": "FirstPR-Analyzer/1.0"
        }
        if self.token:
            self.headers["Authorization"] = f"token {self.token}"

    async def get_repository_metadata(self, owner: str, repo: str) -> Dict[str, Any]:
        """Fetches public repository details."""
        url = f"{settings.GITHUB_API_BASE}/repos/{owner}/{repo}"
        async with httpx.AsyncClient(timeout=settings.GITHUB_REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 404:
                raise ValueError(f"Repository {owner}/{repo} not found or is private.")
            if response.status_code == 403:
                raise PermissionError("GitHub API rate limit exceeded. Please configure GITHUB_TOKEN or try again later.")
            response.raise_for_status()
            return response.json()

    async def get_latest_commit_sha(self, owner: str, repo: str, branch: str = "main") -> str:
        """Fetches latest commit SHA of default branch."""
        url = f"{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/commits/{branch}"
        async with httpx.AsyncClient(timeout=settings.GITHUB_REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 200:
                data = response.json()
                return data.get("sha", "")
            return ""

    async def get_git_tree(self, owner: str, repo: str, tree_sha: str) -> List[Dict[str, Any]]:
        """Fetches recursive tree structure of the repository."""
        url = f"{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/git/trees/{tree_sha}?recursive=1"
        async with httpx.AsyncClient(timeout=settings.GITHUB_REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 200:
                data = response.json()
                return data.get("tree", [])
            return []

    async def get_file_content(self, owner: str, repo: str, path: str, ref: str = "main") -> Optional[str]:
        """Fetches raw content of a specific file."""
        url = f"{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/contents/{path}?ref={ref}"
        async with httpx.AsyncClient(timeout=settings.GITHUB_REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code == 200:
                data = response.json()
                content_b64 = data.get("content", "")
                if content_b64:
                    try:
                        return base64.b64decode(content_b64).decode("utf-8", errors="replace")
                    except Exception:
                        return None
            return None

    async def get_candidate_issues(self, owner: str, repo: str, max_issues: int = 15) -> List[Dict[str, Any]]:
        """
        Fetches open issues likely to be beginner-friendly or labeled for onboarding.
        """
        # Search issues with beginner labels or open state
        url = f"{settings.GITHUB_API_BASE}/repos/{owner}/{repo}/issues?state=open&sort=updated&direction=desc&per_page=30"
        async with httpx.AsyncClient(timeout=settings.GITHUB_REQUEST_TIMEOUT_SECONDS) as client:
            response = await client.get(url, headers=self.headers)
            if response.status_code != 200:
                return []
            
            raw_issues = response.json()
            candidates: List[Dict[str, Any]] = []
            
            # Filter out Pull Requests (GitHub issues API returns PRs too with 'pull_request' key)
            for item in raw_issues:
                if "pull_request" in item:
                    continue
                candidates.append(item)
                if len(candidates) >= max_issues:
                    break
                    
            return candidates

    async def get_issue_comments(self, comments_url: str) -> List[Dict[str, Any]]:
        """Fetches comments for an issue to analyze social state and claims."""
        if not comments_url:
            return []
        async with httpx.AsyncClient(timeout=settings.GITHUB_REQUEST_TIMEOUT_SECONDS) as client:
            try:
                response = await client.get(comments_url, headers=self.headers)
                if response.status_code == 200:
                    return response.json()
            except Exception:
                pass
        return []
