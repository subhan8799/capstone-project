const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function isOpenAIKeyPresent() {
  return Boolean(process.env.OPENAI_API_KEY);
}

async function openaiCall(prompt, { model = 'gpt-4o-mini', temperature = 0.2, timeout = 20000 } = {}) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error('OPENAI_API_KEY not set');

  const body = {
    model,
    messages: [{ role: 'user', content: prompt }],
    temperature,
    max_tokens: 800,
  };

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  const fetchFn = globalThis.fetch;
  if (typeof fetchFn !== 'function') {
    clearTimeout(id);
    throw new Error('fetch is not available in this environment; please install node-fetch or upgrade Node.js');
  }

  const res = await fetchFn(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
    signal: controller.signal,
  }).finally(() => clearTimeout(id));

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`OpenAI API error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  return content;
}

// Simple dry-run generator for offline testing
function dryRun(prompt, stage) {
  return `[[DRY-RUN ${stage} OUTPUT]]\nPrompt: ${prompt.slice(0, 200)}\n...`;
}

export async function callLLM(prompt, opts = {}) {
  if (isOpenAIKeyPresent()) {
    return await openaiCall(prompt, opts);
  }
  return dryRun(prompt, opts.stage || 'general');
}

export default { callLLM };
