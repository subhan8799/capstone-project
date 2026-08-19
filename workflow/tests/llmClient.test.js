import test from 'node:test';
import assert from 'node:assert/strict';
import { callLLM } from '../llmClient.js';

test('llmClient returns dry-run output when OPENAI_API_KEY is not set', async () => {
  const original = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const out = await callLLM('Test prompt for dry run', { stage: 'test' });
    assert.ok(out.includes('[[DRY-RUN'), 'Expected dry-run marker in output');
  } finally {
    if (original) process.env.OPENAI_API_KEY = original;
  }
});
