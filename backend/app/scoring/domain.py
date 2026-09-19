import re
from typing import List, Dict, Tuple
from ..api.schemas import DifficultySignal
from ..core.config import settings

DOMAIN_SPECIALTIES = {
    "Cryptography / Security": [
        "aes", "rsa", "elliptic curve", "tls handshake", "cipher", "hashing algorithm",
        "cryptographic", "jwt validation", "zero knowledge", "fips"
    ],
    "Compilers / Bytecode": [
        "ast parser", "lexer", "token stream", "grammar", "bytecode", "llvm",
        "transpiler", "jit compiler", "symbol table"
    ],
    "Distributed Systems": [
        "raft", "paxos", "distributed consensus", "vector clock", "split brain",
        "leader election", "sharding protocol", "distributed transaction"
    ],
    "Database Internals": [
        "b-tree", "wal log", "query optimizer", "lsm tree", "transaction isolation",
        "page buffer pool", "acid compliance"
    ],
    "Low-Level / Concurrency": [
        "deadlock", "mutex contention", "atomic pointer", "lock-free", "memory leak",
        "segmentation fault", "simd", "ebpf", "kernel hook"
    ],
    "Multimedia / Codecs": [
        "ffmpeg", "webrtc stream", "h.264", "audio buffer", "dsp filter", "pcm decoding"
    ]
}

def calculate_domain_prerequisites(
    issue_title: str,
    issue_body: str,
    file_paths: List[str]
) -> DifficultySignal:
    """
    Signal 7: Domain Prerequisites.
    Detects specialized computer science domains that require advanced domain expertise.
    """
    weight = settings.SIGNAL_WEIGHTS["domain_prerequisites"]
    evidence = []
    
    text = f"{issue_title}\n{issue_body or ''}\n{' '.join(file_paths)}".lower()
    
    detected_domains = []
    for domain_name, keywords in DOMAIN_SPECIALTIES.items():
        matched_kw = [kw for kw in keywords if kw in text]
        if matched_kw:
            detected_domains.append((domain_name, matched_kw))

    if detected_domains:
        score = min(95.0, 60.0 + len(detected_domains) * 15.0)
        for dom, kws in detected_domains:
            evidence.append(f"Requires specialized knowledge in **{dom}** ({', '.join(kws[:3])}).")
    else:
        score = 15.0
        evidence.append("Standard application logic — no specialized domain prerequisite detected.")

    weighted = round(score * weight, 2)
    explanation = f"Domain prerequisites: {'standard web/app skill' if score < 40 else 'advanced domain specialty required'}."

    return DifficultySignal(
        name="Domain Prerequisites",
        score=score,
        weight=weight,
        weighted_score=weighted,
        evidence=evidence,
        explanation=explanation
    )
