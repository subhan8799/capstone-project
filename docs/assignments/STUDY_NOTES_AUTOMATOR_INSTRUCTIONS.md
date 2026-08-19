# Study-Notes Run Automator — Agent Instructions

Purpose
- Automate the existing study-notes workflow by reading `workflow/study-notes-inputs.json`, fetching source URLs, running a small LLM pipeline (gather → synthesize → draft → review → format), and writing the final Markdown run files into `docs/assignments/study-notes-runs/`.

Usage
- Run locally from the repository root:

```bash
OPENAI_API_KEY=... npm run workflow:run-study-notes
```

High-level workflow
1. Read `workflow/study-notes-inputs.json` for runs.
2. For each run, fetch each `source.url` (HTTP GET). Save raw text in `.workflow-cache/`.
3. Run the LLM pipeline:
   - Gather: extract key facts and quotes from fetched source text.
   - Synthesize: combine evidence into an evidence-grounded summary answering the run research question.
   - Draft: produce a readable study note draft with headings.
   - Review: check draft for accuracy vs sources; suggest corrections.
   - Format: render final markdown following the repository’s run template.
4. Write the markdown to `docs/assignments/study-notes-runs/<run-id>.md` (skip existing files unless `--force`).

Tools and data
- LLM API: OpenAI via `OPENAI_API_KEY` env var (optional; script supports dry-run outputs when key is not present).
- HTTP fetch of external sources (must be allowed where script is run).
- Local filesystem: `workflow/study-notes-inputs.json`, `.workflow-cache/`, `docs/assignments/study-notes-runs/`.

Rules & guardrails
- Never print or log `OPENAI_API_KEY` or secrets.
- Do not overwrite existing md files unless `--force` provided and user explicitly confirms (interactive prompt unless `--yes`).
- If a source fetch fails, include a note in the gather stage and continue with available sources.
- Do not auto-commit or push changes.

Prompts (templates)
- Gather prompt: extract facts/quotes from fetched text and note failed sources.
- Synthesize prompt: build an evidence-grounded summary tied to source indices.
- Draft prompt: create the note structure (Summary, Evidence, Quotes, Further Reading).
- Review prompt: verify factual consistency against gathered source pack.
- Format prompt: render into repository markdown template.

Testing
- Run with `OPENAI_API_KEY` set to perform real runs.
- For offline tests, run without `OPENAI_API_KEY` to get dry-run placeholder outputs saved to `.workflow-cache/` and example markdown files.

Failure handling
- LLM failures: retry once, then embed an inline error note in the output and continue.
- Network failures: mark the source as failed and proceed.
