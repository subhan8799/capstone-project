import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const inputPath = process.argv[2] || path.join(__dirname, 'study-notes-inputs.json');
const outputDir = path.join(__dirname, '..', 'docs', 'assignments', 'study-notes-runs');

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  const raw = await fs.readFile(inputPath, 'utf8');
  const data = JSON.parse(raw);
  await fs.mkdir(outputDir, { recursive: true });

  if (!Array.isArray(data.runs)) {
    throw new Error('Input JSON must contain a top-level "runs" array.');
  }

  for (const run of data.runs) {
    if (!run.id || !run.title) {
      console.warn('Skipping invalid run entry (missing id or title):', run);
      continue;
    }

    const fileName = `${slugify(run.id)}.md`;
    const filePath = path.join(outputDir, fileName);
    const content = `# ${run.title}

> Topic: ${run.topic || '[topic not set]'}
> Run ID: ${run.id}

## 1. Input
- Research question: ${run.researchQuestion || '[research question not set]'}
- Sources:
${(run.sources || []).map((source) => `  - ${source.title || '[title]'} (${source.url || '[url]'})`).join('\n')}

## 2. Prompts and configuration
- Gather prompt: see `docs/assignments/STUDY_NOTES_PROMPTS.md`
- Synthesize prompt: see `docs/assignments/STUDY_NOTES_PROMPTS.md`
- Draft prompt: see `docs/assignments/STUDY_NOTES_PROMPTS.md`
- Review prompt: see `docs/assignments/STUDY_NOTES_PROMPTS.md`
- Format prompt: see `docs/assignments/STUDY_NOTES_PROMPTS.md`

## 3. Step outputs
### Step 1 — Gather
- Source pack output: [paste structured output here]
- Notes:

### Step 2 — Synthesize
- Evidence-grounded synthesis: [paste output here]
- Notes:

### Step 3 — Draft
- First draft of study notes: [paste output here]
- Notes:

### Step 4 — Review
- Review report: [paste output here]
- Corrected draft: [paste output here]
- Notes:

### Step 5 — Format
- Final study notes: [paste output here]
- Notes:

## 4. Timing
- Manual completion estimate: [minutes]
- Workflow setup time: [minutes]
- Automated workflow time: [minutes]
- Human review time: [minutes]
- Total workflow time: [minutes]
- Notes on differences:

## 5. Failures and human review
- Failure points encountered:

- Human review actions required:

## 6. Prompt log
- Exact prompt used for gather: [paste prompt]
- Exact prompt used for synthesize: [paste prompt]
- Exact prompt used for draft: [paste prompt]
- Exact prompt used for review: [paste prompt]
- Exact prompt used for format: [paste prompt]
`;
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Generated ${filePath}`);
  }

  console.log(`Generated ${data.runs.length} run template(s) in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});