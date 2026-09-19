# FirstPR — Technical Learnings & Insights

Key engineering lessons discovered while architecting and building FirstPR for the **WeMakeDevs × AWS Bharat Builds Tour** hackathon.

---

## 1. Safely Executing Untrusted Repositories on AWS Fargate

**Challenge**: Running user-submitted open-source repositories means executing untrusted code with potentially malicious `postinstall` scripts or destructive commands.

**Lesson Learned**:
- Giving the ECS Task a `TaskRoleArn` is dangerous because containerized malicious code could query `169.254.170.2` (the AWS ECS task metadata endpoint) to steal temporary IAM credentials.
- **Solution**: We configure `ExecutionRoleArn` (for ECS agent to pull Docker images from ECR and log to CloudWatch), but pass **NO TaskRoleArn**. The container has zero permissions to invoke AWS APIs or metadata services.
- Combined with a read-only root filesystem, ephemeral `/tmp` storage, CPU/memory caps, and a hard 45-second execution timeout, this delivers containment without risk to hackathon infrastructure.

---

## 2. Step Functions Parallel Branch Semantics

**Challenge**: Ingestion, AST mapping, issue retrieval, and sandbox verification have different failure modes. A sandbox test failure is a **valid product finding**, not an infrastructure failure.

**Lesson Learned**:
- Early iterations threw exceptions when `npm test` failed with exit code 1, which caused the entire Step Functions execution to abort.
- **Solution**: We differentiated operational exceptions (network timeouts, rate limits) from domain evaluation results (test failures, build errors). The sandbox runner captures non-zero exit codes as structured `StepStatus.FAILED` or `VerificationStatus.PARTIALLY_VERIFIED`, allowing the pipeline to proceed and render an honest report to the user.

---

## 3. The "Good First Issue" Label Lie

**Challenge**: Why are so many beginner open-source issues abandoned?

**Lesson Learned**:
- Maintainers often slap `good first issue` on bugs that appear conceptually simple from a high level, but require touching core architectural files or navigating complex asynchronous lifecycles (e.g. `fastapi/routing.py` or Windows ConHost IOCTLs in `chalk`).
- Pure LLM prompts tend to agree with whatever label is present because the prompt is biased by the label text.
- **Solution**: By computing **7 deterministic repository signals** (Blast Radius, Structural Centrality, Local Complexity, Test Proximity, Specification Quality, Social State, Domain Prerequisites) *before* invoking the LLM, FirstPR accurately exposes mislabelled issues with unshakeable evidence.

---

## 4. Grounding Validation & Hallucination Defense

**Challenge**: LLMs frequently invent plausible-sounding file paths (e.g., `src/utils/color-helpers.js` when the actual file is `source/index.js`).

**Lesson Learned**:
- Showing even one non-existent file path destroys contributor trust.
- **Solution**: We implemented a strict **Grounding Path Verifier** filter. Every single path proposed for the contribution walkthrough is cross-referenced against the repository's concrete Git tree. Any hallucinated path is rejected or mapped to the nearest verified matching file in the tree.
