BUILD LOG — FL-06 Agent Implementation
=====================================

Summary
-------
- Goal: implement a minimal FL-06 agent that runs end-to-end using the existing study-notes workflow and produces final markdown outputs automatically.

What I inspected
-----------------
- Looked for an FL-06 spec in the repository; none was found. Proceeded using the FL-04 materials and the existing `workflow/run-study-notes.js` as the narrow core.

Key implementation steps
------------------------
1. Added `workflow/llmClient.js` — LLM wrapper with dry-run fallback. Initially used `node-fetch`; tests failed in the environment, so I changed it to use the global `fetch` when available.
2. Implemented `workflow/run-study-notes.js` — CLI that reads `workflow/study-notes-inputs.json`, fetches sources, runs pipeline stages via `callLLM()`, caches intermediate outputs to `.workflow-cache/`, and writes final markdown files to `docs/assignments/study-notes-runs/`.
3. Added tests: `workflow/tests/llmClient.test.js` and `workflow/tests/runStudyNotes.integration.test.js`. Tests run in dry-run mode (no `OPENAI_API_KEY`) to avoid external API calls.
4. Created `agents/fl-06-agent.js` — minimal agent wrapper that runs the automator non-interactively (`--force --yes`) and writes `agents/fl-06-run.log`.
5. Added `docs/assignments/STUDY_NOTES_AUTOMATOR_INSTRUCTIONS.md` documenting usage and guardrails.

What broke and fixes
--------------------
- Error: missing `node-fetch` during tests. Fix: removed direct `node-fetch` dependency and used global `fetch` with AbortController instead; this keeps the code dependency-free in Node 18+ environments. If running on older Node versions, install `node-fetch` or provide a global `fetch` polyfill.
- Initial attempt to add files had a failed apply_patch due to missing explanation; the patch was re-applied correctly.

Deviations from FL-06 spec
--------------------------
- No explicit FL-06 spec file found in the repo; for minimal, narrow scope I used the existing study-notes workflow as the agent's core capability.
- The agent is a thin wrapper around the existing workflow rather than a full MCP-driven autonomous agent. This keeps scope small and ensures one complete end-to-end run.

Security
--------
- API keys are read from environment variables only (`OPENAI_API_KEY`). The agent does not log secrets.

How to run locally (dry-run)
----------------------------
1. From repo root run:

```bash
npm run workflow:run-study-notes --silent
```

2. Or run the agent wrapper:

```bash
npm run agent:fl-06
```

To run with OpenAI (real run):

```bash
OPENAI_API_KEY=your_key npm run agent:fl-06
```

Notes
-----
- Output files and caches are created under `docs/assignments/study-notes-runs/` and `.workflow-cache/` respectively.
- `agents/fl-06-run.log` contains the automator stdout/stderr for each agent run.

Next steps (optional)
---------------------
- Add MCP integration where an agent runtime can call `mcp/` endpoints dynamically.
- Add more robust fetch retry logic and LLM retry/quotas handling.
- Expand tests to cover timeouts and partial LLM failures.

-- Implementation completed by the assistant on behalf of the user.
