type MovieCandidate = { id: number; title: string; overview?: string };

async function postJSON(path: string, body: any) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

export async function rerankSearch(query: string, candidates: MovieCandidate[]) {
  try {
    const resp = await postJSON('/.netlify/functions/ai-proxy', { action: 'rerank', query, candidates });
    if (resp && resp.ok && Array.isArray(resp.reranked)) return resp.reranked;
    return candidates;
  } catch (e) {
    return candidates; // dry-run fallback
  }
}

export default { rerankSearch };
