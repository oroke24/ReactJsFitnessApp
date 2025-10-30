// Web-friendly Gemini call via secure serverless proxy to avoid client-side API keys.
const aiRevampGemini = async (cardType, content, notes = '') => {
  const base = process.env.REACT_APP_AI_PROXY_URL;
  if (!base) {
    throw new Error('Missing REACT_APP_AI_PROXY_URL');
  }
  const url = `${base.replace(/\/$/, '')}/revamp`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: cardType, notes, content})
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    throw new Error(`Proxy error ${res.status}: ${t}`);
  }
  const data = await res.json();
  if (Array.isArray(data?.group_one) || Array.isArray(data?.group_two)) {
    return {
      group_one: Array.isArray(data.group_one) ? data.group_one : [],
      group_two: Array.isArray(data.group_two) ? data.group_two : [],
    };
  }
  const text = String(data?.text ?? '');
  try {
    const s = text.indexOf('{');
    const e = text.lastIndexOf('}');
    const json = s >= 0 ? text.slice(s, e + 1) : text;
    const parsed = JSON.parse(json);
    return {
      group_one: Array.isArray(parsed.group_one) ? parsed.group_one : [],
      group_two: Array.isArray(parsed.group_two) ? parsed.group_two : [],
    };
  } catch (e) {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const mid = Math.ceil(lines.length / 2);
    return { group_one: lines.slice(0, mid), group_two: lines.slice(mid) };
  }
};

export default aiRevampGemini;
