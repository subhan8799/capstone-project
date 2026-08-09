# Source-Grounded Study Notes Workflow

## Goal
Build a source-grounded study notes workflow for the assignment. This workflow is intentionally documentation-first and uses a small low-code helper script to generate structured run templates and consistent output files.

## Chosen pipeline
- `source-grounded study notes`

This repo does not already have a research-note workflow, so we are implementing the assignment pipeline from scratch with the smallest set of changes.

## Workflow overview
The workflow has five steps:

1. **Gather** — collect the sources and create a structured source list.
2. **Synthesize** — extract key evidence, findings, and source attribution.
3. **Draft** — use the synthesis to write a first draft of study notes.
4. **Review** — validate the draft against sources and correct unsupported claims.
5. **Format** — produce the final clean, consistent study notes.

## Step definitions

### Step 1 — GATHER
- Input: research topic and 3–5 reliable sources.
- Processing: collect source metadata, weight credibility, and capture essential bibliographic details.
- Output: structured source pack containing source title, URL, type, publication date, and summary.
- Handoff: pass the source pack into the synthesis prompt.
- Human review: confirm sources are reliable, relevant, and not duplicated.

### Step 2 — SYNTHESIZE
- Input: the structured source pack.
- Processing: extract key concepts, evidence, findings, disagreements, and exact source attribution.
- Output: evidence-grounded synthesis notes with source citations.
- Handoff: use the synthesis as the raw material for drafting study notes.
- Human review: verify that every claim in the synthesis is tied to at least one source.

### Step 3 — DRAFT
- Input: evidence-grounded synthesis notes.
- Processing: convert the synthesis into structured study notes with headings, bullet points, and citations.
- Output: first draft of study notes.
- Handoff: send the draft into the review stage.
- Human review: check clarity, structure, and whether the draft remains grounded in the source synthesis.

### Step 4 — REVIEW
- Input: first draft plus original source pack.
- Processing: check the draft for unsupported claims, incorrect facts, missing context, and citation problems.
- Output: review report and corrected draft.
- Handoff: pass the corrected draft to formatting.
- Human review: validate corrections and ensure no new unsupported statements were introduced.

### Step 5 — FORMAT
- Input: corrected draft.
- Processing: standardize style, clean formatting, and create a polished final notes document.
- Output: final study notes in a clean, consistent format.
- Handoff: final deliverable and any evidence of workflow runs.
- Human review: final pass for formatting, citation accuracy, and completeness.

## Workflow artifacts in this repo
- `docs/assignments/STUDY_NOTES_PROMPTS.md` — exact prompts and prompt structure for every step.
- `workflow/generate-study-notes-run.js` — low-code helper script that scaffolds run files.
- `workflow/study-notes-inputs.json` — placeholder run inputs for five topics.
- `docs/assignments/study-notes-runs/` — generated run templates after executing the helper script.

## How this satisfies the assignment
- Chosen pipeline: `source-grounded study notes`
- Workflow design: 5 distinct steps with clear handoffs and review points
- Low-code tooling: Node script generates structured markdown templates from JSON
- Documentation: new workflow docs and prompt templates
- Test structure: skeleton files allow the user to record 5 runs, prompts, outputs, failures, and timing

## Known gaps that require manual input
- The actual 5 research inputs must come from the student.
- Real runs, outputs, and timing data must be filled in manually.
- Source validation and final review are human tasks.

## Where to run this workflow
1. Install dependencies if needed: `npm install`
2. Generate run templates: `npm run workflow:study-notes`
3. Open the generated files in `docs/assignments/study-notes-runs/`
4. Fill each run template with actual sources, outputs, and timing information.

## Human-review checklist
- Verify each source is credible and relevant.
- Confirm every claim is linked to a specific source.
- Check dates and author names for accuracy.
- Flag ambiguous or unsupported statements.
- Validate that final notes are concise and consistently formatted.
- Record any failure points or prompt issues encountered.

## Delivery checklist
- [ ] workflow/step diagram or description
- [ ] exact prompts/configuration for every stage
- [ ] run documentation for 5 inputs
- [ ] time comparison table
- [ ] failure points and human review notes
- [ ] instructions for a brand-new input
