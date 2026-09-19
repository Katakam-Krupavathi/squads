# FirstPR — Judge Demo Script & Runbook

**Target**: Complete in **under 3 minutes** for maximum judging impact.

---

## ⏱️ Demo Flow Timeline

### 0:00 - 0:30 | The Core Problem (Pitch & Screen 1)
1. Open the FirstPR live app.
2. State the pitch:
   > *"Open source has a massive onboarding crisis: contributors hit an environment setup wall, get tricked by mislabelled 'good first issues', and don't know where to start in real code. FirstPR solves all three."*
3. Click on the verified demo repository pill: `chalk/chalk` (or `fastapi/fastapi`).

---

### 0:30 - 1:00 | Live Multi-Stage Pipeline (Screen 2)
1. Point out the live pipeline progression:
   - ✓ Repository fetched
   - ✓ Stack detected (JavaScript / npm)
   - ✓ Codebase mapped (18 modules)
   - ✓ Beginner issues loaded
   - ✓ 7 Difficulty signals calculated
   - ✓ Environment verification executed
2. Highlight:
   > *"This isn't just a generic spinner — FirstPR is actively analyzing repository AST, import graphs, and executing real container verification on AWS ECS Fargate."*

---

### 1:00 - 1:45 | The "Good First Issue" Lie Exposed (Screen 3B - Star Moment!)
1. Scroll to the **Ranked Issue Candidates** section.
2. Show Issue #582: **Genuinely Beginner** (Score 18.8/100). Localized to a single file with clear test harness.
3. Show Issue #491: **MISLABELLED (HIGH RISK)** (Score 78.5/100).
   > *"GitHub labels this as a 'good first issue', but FirstPR challenges the maintainer label with hard repository evidence."*
4. Click **"Inspect 7-Signal Evidence"**:
   - **Blast Radius**: 88/100 (Touches core stream pipeline across 6 files).
   - **Structural Centrality**: 90/100 (Modifies root bootstrap engine).
   - **Domain Prerequisites**: 92/100 (Requires Windows Console Internals & IOCTL knowledge).
   - **Social State**: 3 previous contributors attempted and abandoned.

---

### 1:45 - 2:15 | Real Verified Environment (Screen 3C)
1. Scroll to **Verified Sandbox Environment**.
2. Show the real execution steps (`install`, `build`, `test`).
3. Click through the terminal log tabs to show actual `stdout` and `stderr` output:
   > *"Never trust setup commands you haven't executed. FirstPR ran `npm install`, `npm run build`, and `npm test` inside an isolated Fargate microVM container, proving the test suite passes in 4.82s before the contributor writes a single line of code."*

---

### 2:15 - 2:45 | Grounded Contribution Walkthrough (Screen 4)
1. Click **"Contribution Walkthrough"** on the beginner issue.
2. Show the modal:
   - **Issue explained simply** (plain-English bug explanation).
   - **Recommended File Reading Order**: `README.md` -> `source/index.js` -> `test/index.js`.
   - Highlight the **"Validated in Repository Tree"** badge:
     > *"Every displayed path is strictly verified against the actual repository tree — zero hallucinated file paths."*
   - Show repository conventions (branch naming, commit style, PR checklist).

---

### 2:45 - 3:00 | AWS Cloud Architecture & Wrap-Up
1. Click **"AWS Architecture"** in the top navigation bar.
2. Show the seamless integration of Amplify, API Gateway, Lambda, Step Functions, ECS Fargate, Bedrock, DynamoDB, S3, and CloudWatch.
3. Conclude:
   > *"FirstPR turns open-source confusion into verified, confident first contributions. Thank you!"*
