import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import { callLLM } from './llmClient.js';
import readline from 'readline';

const INPUT_PATH = path.join(process.cwd(), 'workflow', 'study-notes-inputs.json');
const OUTPUT_DIR = path.join(process.cwd(), 'docs', 'assignments', 'study-notes-runs');
const CACHE_DIR = path.join(process.cwd(), '.workflow-cache');

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

function slugify(value) {
  return value
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchSource(url) {
  try {
    const res = await axios.get(url, { timeout: 10000, responseType: 'text' });
    return { ok: true, content: res.data };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

async function confirmOverwrite(filePath) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await new Promise((res) => rl.question(`Overwrite ${filePath}? (y/N) `, (a) => res(a)));
  rl.close();
  return ['y', 'Y', 'yes'].includes(answer.trim());
}

async function run() {
  const args = process.argv.slice(2);
  const force = args.includes('--force');
  const yes = args.includes('--yes');

  await ensureDir(OUTPUT_DIR);
  await ensureDir(CACHE_DIR);

  const raw = await fs.readFile(INPUT_PATH, 'utf8');
  const data = JSON.parse(raw);
  if (!Array.isArray(data.runs)) {
    console.error('Input JSON missing runs array');
    process.exit(1);
  }

  for (const run of data.runs) {
    const id = run.id || slugify(run.title || 'run');
    const fileName = `${slugify(id)}.md`;
    const outPath = path.join(OUTPUT_DIR, fileName);

    // skip existing unless forced
    try {
      await fs.access(outPath);
      if (!force) {
        console.log(`Skipping ${fileName} (exists). Use --force to overwrite.`);
        continue;
      }
      if (!yes) {
        const ok = await confirmOverwrite(outPath);
        if (!ok) {
          console.log('Skipping overwrite.');
          continue;
        }
      }
    } catch {
      // file does not exist; proceed
    }

    console.log(`Processing run ${id} — ${run.title}`);
    const sources = run.sources || [];
    const fetched = [];
    for (const src of sources) {
      if (!src.url) {
        fetched.push({ ...src, ok: false, error: 'Missing URL' });
        continue;
      }
      const result = await fetchSource(src.url);
      fetched.push({ ...src, ...result });
    }

    // cache fetched
    const cachePath = path.join(CACHE_DIR, `${slugify(id)}.json`);
    await fs.writeFile(cachePath, JSON.stringify({ run, fetched, timestamp: Date.now() }, null, 2), 'utf8');

    // Prepare gather prompt
    const gatherPrompt = `You are creating a source pack for the study notes. For the run titled: ${run.title}\nResearch question: ${run.researchQuestion}\nSources:\n${fetched
      .map((s, i) => `- [${i + 1}] ${s.title || s.url} (${s.ok ? 'fetched' : 'failed'})`)
      .join('\n')}\n\nExtract the key facts and important quotations from the fetched sources. If a source failed, note that and continue.`;

    const gatherOutput = await callLLM(gatherPrompt, { stage: 'gather' }).catch((e) => `LLM gather failed: ${e.message}`);

    const synthPrompt = `Synthesize the gathered notes into an evidence-grounded summary that answers: ${run.researchQuestion}. Use bullets and link claims to source numbers where possible.\n\nGATHER:\n${gatherOutput}`;
    const synthOutput = await callLLM(synthPrompt, { stage: 'synthesize' }).catch((e) => `LLM synth failed: ${e.message}`);

    const draftPrompt = `Create a readable study note draft for the topic '${run.title}' using the synthesis below. Keep it structured with headings: Summary, Evidence, Key Quotes, Further Reading.\n\nSYNTHESIS:\n${synthOutput}`;
    const draftOutput = await callLLM(draftPrompt, { stage: 'draft' }).catch((e) => `LLM draft failed: ${e.message}`);

    const reviewPrompt = `Review the draft for clarity, factual consistency with the gathered source pack, and suggest any corrections or missing evidence. Output a corrected draft only if changes are required; otherwise respond 'NO_CHANGE'.\n\nDRAFT:\n${draftOutput}\n\nGATHER:\n${gatherOutput}`;
    const reviewOutput = await callLLM(reviewPrompt, { stage: 'review' }).catch((e) => `LLM review failed: ${e.message}`);

    const finalDraft = reviewOutput && reviewOutput !== 'NO_CHANGE' ? reviewOutput : draftOutput;

    const formatPrompt = `Format the final study notes into the repository markdown template. Include frontmatter: title, run id, topic, research question. Then insert sections: Input, Prompts and configuration, Step outputs (Gather, Synthesize, Draft, Review, Format), Timing, Failures, Prompt log. Use the text below as the Final Draft:\n\n${finalDraft}`;
    const formatted = await callLLM(formatPrompt, { stage: 'format' }).catch((e) => `LLM format failed: ${e.message}`);

    const content = `# ${run.title}\n\n> Topic: ${run.topic || '[topic not set]'}\n> Run ID: ${run.id}\n\n${formatted}`;

    await fs.writeFile(outPath, content, 'utf8');
    console.log(`Wrote ${outPath}`);
  }
}

run().catch((err) => {
  console.error('Run failed:', err);
  process.exit(1);
});
