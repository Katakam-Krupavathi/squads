# FirstPR — Verified Open-Source Contributions

> **FirstPR turns any open-source repository into a guided, verified first contribution — it finds an issue you can actually solve, proves the development environment works before you touch it, and walks you through the fix in the real code.**

Built for **WeMakeDevs × AWS — Bharat Builds Tour — Stop 1: First Commit (17–20 September 2026)**.

---

## 🎯 The Core Problem

Open-source contribution has three major onboarding failures:

1. **The Environment Wall**: A beginner clones a repository but fails to get it running due to runtime mismatches, missing dependencies, or broken build steps.
2. **The "Good First Issue" Label Lie**: Issues are often labelled `good first issue` while secretly requiring cross-cutting architectural changes, deep framework knowledge, or modifications to central bottlenecks.
3. **The Orientation Gap**: Even after setting up, newcomers don't know which files to read, where the behavior originates, or where tests live.

---

## 🚀 What FirstPR Does

- **🔍 Evidence-Based Difficulty Scoring**: Independently computes issue difficulty across **7 deterministic signals**. The AI explains the score — it *never invents it*.
- **⚠️ Exposes Mislabelled Issues**: Catches misleading `good first issue` tags and spotlights high-risk architectural traps with hard repository evidence.
- **⚡ Real Isolated Environment Verification**: Actually executes `install`, `build`, and `test` inside an **AWS ECS / Fargate** sandbox, capturing exit codes and terminal logs instead of guessing commands.
- **🗺️ Grounded Contribution Walkthroughs**: Generates step-by-step file reading timelines strictly validated against the real repository tree (**Zero Hallucinated Paths**).

---

## 🔬 How the 7-Signal Difficulty Engine Works

FirstPR uses a transparent, documented weighted formula ($\sum \text{Weights} = 1.0$):

| Signal | Weight | What It Measures |
|---|---|---|
| **1. Blast Radius** | `22%` | Number of files and symbols likely affected; checks localized vs cross-cutting scope. |
| **2. Structural Centrality** | `16%` | Import graph analysis distinguishing core architectural hubs from leaf modules. |
| **3. Local Complexity** | `14%` | AST LOC, branching points, cyclomatic heuristics, and nesting levels. |
| **4. Test Proximity** | `14%` | Closeness and presence of dedicated unit test suites (inverted risk). |
| **5. Specification Quality** | `16%` | Presence of reproduction steps, error logs, stack traces, and acceptance criteria (inverted risk). |
| **6. Social State** | `10%` | Assignee status, active PRs, "I'll work on this" comments, and staleness detection. |
| **7. Domain Prerequisites** | `8%` | Specialist domain knowledge (Cryptography, Compilers, Raft, Kernel, Async Concurrency). |

### Classification Buckets:
- **Genuinely Beginner** ($\le 35/100$)
- **Moderate** ($36 - 65/100$)
- **Mislabelled** ($> 65/100$ with a beginner label on GitHub)

---

## 🏗️ AWS Cloud Architecture

```mermaid
flowchart LR
    A[React 19 SPA<br/>AWS Amplify] --> B[Amazon API Gateway]
    B --> C[AWS Lambda API]
    C --> D[AWS Step Functions]
    D --> E[Amazon ECS + Fargate<br/>Sandbox Runner]
    D --> F[Amazon Bedrock<br/>Claude 3.5 Sonnet]
    D --> G[(Amazon DynamoDB<br/>Reports & Cache)]
    E --> H[(Amazon S3 Logs)]
```

### AWS Services Breakdown:
- **AWS Amplify Hosting**: Hosts the responsive React SPA on CloudFront edge CDN with automated CI/CD.
- **Amazon API Gateway & AWS Lambda**: Serverless ingestion and REST API endpoints.
- **AWS Step Functions**: Orchestrates the multi-stage parallel analysis pipeline.
- **Amazon ECS + AWS Fargate**: Executes isolated container builds with zero AWS credentials exposed.
- **Amazon Bedrock (Claude 3.5 Sonnet)**: Synthesizes evidence-grounded walkthroughs.
- **Amazon DynamoDB**: Stores cached evaluations with automatic TTL.
- **Amazon S3**: Persists container execution stdout/stderr terminal logs.
- **Amazon CloudWatch**: Observability, durations, error alarms, and cost monitoring (~$0.0028/analysis).

---

## 💻 Local Development & Testing

### 1. Backend Setup (FastAPI & Python 3.12+)
```bash
cd backend
python -m pip install -r requirements.txt
python -m pytest tests/ -v
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

### 2. Frontend Setup (React 19 + TypeScript + Vite)
```bash
cd frontend
npm install
npm run build
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

## 📦 Supported Stacks & Repositories

- **JavaScript / TypeScript**: Node.js, npm, pnpm, yarn, bun, React, Next.js, Express, Jest, Vitest, AVA.
- **Python**: pip, poetry, uv, pipenv, FastAPI, Django, Flask, PyTorch, pytest, unittest.
- **Go**: go modules, `go build`, `go test`.

---

## 🔒 Security Model

- **Zero-Trust Sandbox**: Ephemeral Fargate container with read-only root and no AWS IAM TaskRole.
- **Path Traversal Defense**: All paths checked against directory boundary escape attempts.
- **Command Allowlisting**: Strict pattern matching rejecting shell metacharacters and SSRF IPs (`169.254.169.254`).
- **Grounding Validation**: Rejects any AI-suggested file not present in the repository tree.

---

## 👥 Team & Hackathon Submission

Built for **WeMakeDevs × AWS — Bharat Builds Tour — Stop 1: First Commit**
- Target Tracks: **Ship It — First Prize** & **Best UI**
- License: MIT
