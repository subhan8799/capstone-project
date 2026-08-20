const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';

function getOpenAIKey() {
  return process.env.OPENAI_API_KEY;
}

async function callOpenAI(systemPrompt, userPrompt, { model = 'gpt-4o-mini', temperature = 0.2 } = {}) {
  const key = getOpenAIKey();
  if (!key) throw new Error('OPENAI_API_KEY not configured');

  const body = {
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature,
    max_tokens: 800,
  };

  const fetchFn = globalThis.fetch;
  if (typeof fetchFn !== 'function') throw new Error('fetch not available in runtime');

  const res = await fetchFn(OPENAI_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`OpenAI error ${res.status}: ${errText}`);
  }

  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export async function handler(event) {
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const action = body.action || 'rerank';

    if (!getOpenAIKey()) {
      // dry-run fallback: return candidates unchanged and a mock suggestion
      if (action === 'rerank') {
        return {
          statusCode: 200,
          body: JSON.stringify({ ok: true, reranked: body.candidates || [], suggestions: [] }),
        };
      }
      return { statusCode: 200, body: JSON.stringify({ ok: true, message: 'dry-run' }) };
    }

    if (action === 'rerank') {
      const { query, candidates = [] } = body;
      const system = 'You are a helpful assistant that ranks movie search results by relevance to the user query. Return a JSON array of candidate ids in best-to-worst order and a short explanation.';
      const user = `Query: "${query}"\nCandidates:\n${candidates
        .map((c) => `- id:${c.id} title:${c.title} overview:${(c.overview || '').slice(0, 200)}`)
        .join('\n')}\n\nRespond with a JSON object: { "order": [ids], "explanation":"short" }`;

      const ai = await callOpenAI(system, user);
      // try to parse JSON from AI output
      const jsonText = ai.trim().replace(/^```json\s*/, '').replace(/\s*```$/, '');
      let parsed = null;
      try {
        parsed = JSON.parse(jsonText);
      } catch (e) {
        // fallback: return original order
        parsed = { order: candidates.map((c) => c.id), explanation: ai.slice(0, 500) };
      }

      const idToCandidate = Object.fromEntries(candidates.map((c) => [String(c.id), c]));
      const reranked = (parsed.order || []).map((id) => idToCandidate[String(id)]).filter(Boolean);
      const suggestions = reranked.slice(0, 5).map((c) => ({ id: c.id, title: c.title }));

      return { statusCode: 200, body: JSON.stringify({ ok: true, reranked, suggestions, explanation: parsed.explanation || '' }) };
    }

    // unsupported action
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: 'unsupported action' }) };
  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ ok: false, error: String(err.message) }) };
  }
}

export default handler;
