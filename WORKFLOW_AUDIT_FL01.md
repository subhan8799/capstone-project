# Workflow Audit (FL-01)

Date: 2026-07-29
Owner: Subhan (capstone track)

## 1) Weekly Task Audit (10-15 tasks)

| # | Recurring task from my real week | Classification | One-line rationale |
|---|---|---|---|
| 1 | Attend live class sessions and ask questions in real time | Just me | Human presence, judgment, and spontaneous follow-up questions are the core value. |
| 2 | Read assignment briefs and extract constraints/deadlines | Collaborate with AI | I do first-pass reading, then AI checks for missed constraints and summarizes action items. |
| 3 | Plan weekly study blocks on calendar | Just me | Only I can balance energy, personal obligations, and realistic time commitment. |
| 4 | Convert lecture notes into concise revision sheets | Delegate to AI with review | AI is faster at structuring notes; I verify technical correctness and keep exam-relevant details. |
| 5 | Draft README and setup documentation for repo tasks | Delegate to AI with review | AI accelerates first draft quality; I review for accuracy and assignment alignment. |
| 6 | Write initial code scaffolds for small utilities/components | Collaborate with AI | I define requirements and architecture; AI generates a first implementation I refine. |
| 7 | Debug failing scripts/tests in Node projects | Collaborate with AI | AI helps triage hypotheses quickly; I run tests and decide the final fix. |
| 8 | Clean up commit history and write Conventional Commit messages | Fully automate | Pattern-based formatting is consistent and low-risk to automate with a commit-message template. |
| 9 | Prepare weekly progress update for mentor/instructor | Delegate to AI with review | AI can format status updates; I verify facts, tone, and priorities before sending. |
| 10 | Search docs for unfamiliar CLI/tool errors | Delegate to AI with review | AI speeds up discovery and explanation; I validate commands before execution. |
| 11 | Maintain task board (todo/in progress/done) | Fully automate | Repetitive status transitions can be automated from commit/PR events with light oversight. |
| 12 | Reflect on learning gaps and decide next skills to practice | Just me | Personal reflection and motivation signals are subjective and should remain human-led. |

## 2) Toolkit Setup + Academy Enrollment Evidence

Use this checklist and attach screenshots in your submission:

- [ ] Claude account created and accessible
- [ ] ChatGPT account created and accessible
- [ ] Anthropic Academy account created and accessible
- [ ] Enrolled in "AI Fluency: Framework & Foundations"
- [ ] Completed at least Module 1

Evidence to attach:

1. Screenshot showing Claude signed in.
2. Screenshot showing ChatGPT signed in.
3. Screenshot showing Anthropic Academy course enrollment page.
4. Screenshot showing Module 1 marked complete (or progress indicator).

## 3) Claude Project Configuration

Project name:
Capstone AI Copilot

Custom instructions used:

- Who I am: I am a capstone student building practical software projects with Node.js, GitHub, and VS Code.
- Tone preferences: Be concise, direct, and constructive. Prefer checklists and short action steps.
- Current goals: Ship small reliable increments, maintain clean Conventional Commit history, improve documentation quality, and reduce rework through better planning/testing.
- Working style: Ask clarifying questions only when necessary; otherwise propose a draft, explain trade-offs, and suggest the safest next step.
- Quality bar: Prioritize correctness, reproducibility, and maintainability over cleverness.

Required evidence:

- Screenshot of this Claude Project with custom instructions visible.

## 4) Three Reusable Target Tasks (for FL-02 to FL-04)

### Task A: README Quality Audit

Definition: Review and improve README structure before each milestone submission.

Done well means:

- README includes purpose, setup, run steps, and troubleshooting.
- Setup commands run without missing prerequisites.
- At least one AI-suggested improvement is accepted or explicitly rejected with reason.
- Review-to-update cycle completes in <= 20 minutes.

### Task B: Git Commit Hygiene Check

Definition: Validate commit sequence before push.

Done well means:

- 100% of commits follow Conventional Commits syntax.
- Each commit is single-purpose and message matches the diff.
- No accidental generated files or secrets are committed.
- Final pre-push checklist takes <= 10 minutes.

### Task C: Bug Triage and Fix Loop

Definition: Use AI to speed up debugging for one concrete failing behavior.

Done well means:

- Repro steps are written before attempting fixes.
- AI proposes >= 2 plausible root causes.
- Fix is validated by rerun (test/script/manual repro).
- Resolution note records cause, fix, and prevention in <= 8 lines.

## Submission Pack (what to turn in)

1. This audit document (table + target tasks + success definitions).
2. Screenshot of configured Claude Project.
3. Evidence screenshots for account setup + Academy enrollment/module completion.
