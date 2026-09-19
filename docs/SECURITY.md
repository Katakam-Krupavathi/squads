# FirstPR — Security Model & Sandbox Containment

FirstPR operates under a **Zero-Trust Input Model**: every submitted GitHub repository and issue is treated as potentially hostile.

---

## 1. Threat Mitigation Matrix

| Threat Vector | Potential Impact | FirstPR Security Defense |
|---|---|---|
| **Malicious Postinstall / Scripts** | Host takeover or credential theft | Executed exclusively in ephemeral **AWS ECS/Fargate** tasks or subprocesses with hard CPU/memory and 45s timeouts. |
| **AWS Metadata Exfiltration (SSRF)** | Leaking AWS IAM credentials | **No TaskRoleArn attached to Fargate container**. Explicit blocking of `169.254.169.254` and `169.254.170.2` in commands. |
| **Arbitrary Command Injection** | Remote code execution | Commands are derived from **strict allowlists** (`npm`, `yarn`, `pnpm`, `pytest`, `python`, `go`). Shell chaining characters (`;`, `&&`, `\|`, `` ` ``, `$`) are rejected. |
| **Path Traversal Attacks** | Accessing host secrets (`/etc/passwd`, `.env`) | All repository paths are normalized and checked via `is_safe_relative_path()`. Leading slashes and `..` segments are rejected. |
| **LLM Hallucinations** | Confusing contributors with fake files | **Grounding Path Verifier** matches every AI suggestion against the real Git tree before rendering. |

---

## 2. Sandbox Container Isolation Guarantees

1. **Read-Only Root Filesystem**: Modifications are restricted to an in-memory `/tmp` mount that is wiped immediately upon task termination.
2. **Zero Persistent Storage**: No user-submitted artifacts persist across sandbox runs.
3. **Restricted Network Access**: Inbound networking is completely disabled (`SecurityGroup` allows 0 ingress). Outbound access is restricted to package registries (`npmjs.org`, `pypi.org`).
4. **Non-Root Execution**: Container processes run under unprivileged users (`node` or `appuser`).
