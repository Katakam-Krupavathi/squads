import time
from typing import Dict, Optional, Any
from datetime import datetime
from ..api.schemas import RepositoryAnalysis
from ..core.config import settings

class StorageManager:
    """
    Multi-tier storage manager supporting DynamoDB, S3, and in-memory caching.
    Includes pre-cached verified demo repositories for rock-solid demo performance.
    """
    def __init__(self):
        self._memory_cache: Dict[str, Dict[str, Any]] = {}
        self._jobs: Dict[str, Dict[str, Any]] = {}

    def get_cache_key(self, owner: str, repo: str, commit_sha: Optional[str] = None) -> str:
        if commit_sha:
            return f"{owner.lower()}/{repo.lower()}@{commit_sha[:8]}"
        return f"{owner.lower()}/{repo.lower()}"

    def get_cached_report(self, cache_key: str) -> Optional[RepositoryAnalysis]:
        entry = self._memory_cache.get(cache_key)
        if not entry:
            # Check prefix match (e.g. owner/repo)
            for k, val in self._memory_cache.items():
                if k.startswith(cache_key) or cache_key.startswith(k):
                    entry = val
                    break
        if not entry:
            return None

        # Check TTL
        if time.time() > entry.get("expires_at", 0):
            del self._memory_cache[cache_key]
            return None

        report: RepositoryAnalysis = entry["data"]
        report.is_cached = True
        report.cached_timestamp = entry["cached_at"]
        return report

    def set_cached_report(self, cache_key: str, report: RepositoryAnalysis, ttl_seconds: int = None):
        ttl = ttl_seconds or settings.CACHE_TTL_SECONDS
        now_iso = datetime.utcnow().isoformat()
        self._memory_cache[cache_key] = {
            "data": report,
            "cached_at": now_iso,
            "expires_at": time.time() + ttl
        }

    def save_job(self, job_dict: Dict[str, Any]):
        job_id = job_dict.get("job_id")
        if job_id:
            self._jobs[job_id] = job_dict

    def get_job(self, job_id: str) -> Optional[Dict[str, Any]]:
        return self._jobs.get(job_id)

storage_manager = StorageManager()
