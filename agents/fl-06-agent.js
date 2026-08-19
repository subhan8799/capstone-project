import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs/promises';
import path from 'path';

const execFileAsync = promisify(execFile);

async function runAgent() {
  const cwd = process.cwd();
  const node = process.execPath;
  const script = path.join('workflow', 'run-study-notes.js');

  const env = { ...process.env };
  // Keep secrets in env; agent won't log them

  try {
    console.log('Starting FL-06 agent (minimal core)...');
    const { stdout, stderr } = await execFileAsync(node, [script, '--force', '--yes'], { cwd, env, timeout: 120000 });
    await fs.writeFile(path.join('agents', 'fl-06-run.log'), `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}\n`, 'utf8');

    const outDir = path.join(cwd, 'docs', 'assignments', 'study-notes-runs');
    const files = await fs.readdir(outDir);
    console.log(`Agent finished. Found ${files.length} output files in ${outDir}`);

    return { ok: true, files };
  } catch (err) {
    const msg = String(err.stack || err);
    await fs.writeFile(path.join('agents', 'fl-06-run.log'), `AGENT ERROR:\n${msg}\n`, 'utf8');
    console.error('Agent run failed:', err.message);
    return { ok: false, error: msg };
  }
}

// When executed directly (node agents/fl-06-agent.js), run the agent.
if (process.argv[1] && path.normalize(process.argv[1]).endsWith(path.normalize(path.join('agents', 'fl-06-agent.js')))) {
  runAgent().then((r) => {
    if (!r.ok) process.exit(1);
  });
}

export default { runAgent };
