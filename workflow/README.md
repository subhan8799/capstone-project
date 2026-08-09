# Workflow helper

This folder contains a small low-code helper for the source-grounded study notes workflow.

## Files
- `generate-study-notes-run.js` — generates structured run templates from JSON input.
- `study-notes-inputs.json` — placeholder list of five runs for the assignment.

## Usage

From the repository root:

```bash
npm run workflow:study-notes
```

This command will read `workflow/study-notes-inputs.json` and generate markdown templates in:

- `docs/assignments/study-notes-runs/`

## Purpose

The helper is designed to keep the workflow low-code. It scaffolds the documentation files you need to record actual research inputs, exact prompts, outputs, timing, and review notes.

## Next steps
- Replace placeholders in `workflow/study-notes-inputs.json` with real topics and sources.
- Run the helper to create fresh run templates.
- Fill the generated markdown files with real prompt text, outputs, failure notes, and timings.
