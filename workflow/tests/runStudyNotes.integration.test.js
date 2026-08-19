import test from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'fs/promises';
import path from 'path';

const execFileAsync = promisify(execFile);

test('run-study-notes CLI creates markdown outputs in dry-run mode', async () => {
  const cwd = path.resolve('.', '');
  const node = process.execPath;
  // Ensure no API key to force dry-run
  const env = { ...process.env };
  delete env.OPENAI_API_KEY;

  // Run CLI with --force and --yes to avoid interactive prompts
  const { stdout, stderr } = await execFileAsync(node, ['workflow/run-study-notes.js', '--force', '--yes'], { cwd, env, timeout: 20000 });
  // Check that at least one run file was created
  const outDir = path.join(cwd, 'docs', 'assignments', 'study-notes-runs');
  const files = await fs.readdir(outDir);
  assert.ok(files.length > 0, 'Expected generated markdown files in output directory');

  // Basic sanity check: file contains run title
  const first = await fs.readFile(path.join(outDir, files[0]), 'utf8');
  assert.ok(first.includes('#'), 'Expected markdown heading in output file');
});
