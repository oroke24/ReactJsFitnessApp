// Mobile-friendly Gemini call using fetch to avoid SDK polyfills.
// Returns { group_one: string[], group_two: string[] }
export default async function aiRevamp(type, content) {
  const proxy = process.env.EXPO_PUBLIC_AI_PROXY_URL;
  if (!proxy) throw new Error('Missing EXPO_PUBLIC_AI_PROXY_URL');

  const system = `You are an expert fitness and cooking assistant.
Given a ${type} card content, split it into two clear sections:
- group_one: bullet-style lines suitable for the first section (for recipe: Ingredients; for exercise: Muscle Group notes or equipment)
- group_two: bullet-style lines suitable for the second section (for recipe: Instructions; for exercise: Step-by-step Instructions)
Return ONLY JSON with keys group_one and group_two as arrays of strings.`;

  const prompt = `${system}\n\nCONTENT:\n${content}`;

  const url = `${proxy.replace(/\/$/, '')}/revamp`;
  // Send raw content; server builds full prompt
  const body = { type, content };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gemini request failed (${res.status}): ${errText}`);
  }
  const data = await res.json();
  // Preferred: proxy returns already-parsed groups
  if (Array.isArray(data?.group_one) || Array.isArray(data?.group_two)) {
    const group_one = Array.isArray(data.group_one) ? data.group_one : [];
    const group_two = Array.isArray(data.group_two) ? data.group_two : [];
    return { group_one, group_two };
  }
  // Fallback: proxy returns text; try to parse JSON within
  const text = String(data?.text ?? '');

  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const sliced = jsonStart >= 0 ? text.slice(jsonStart, jsonEnd + 1) : text;
    const parsed = JSON.parse(sliced);
    const group_one = Array.isArray(parsed.group_one) ? parsed.group_one : [];
    const group_two = Array.isArray(parsed.group_two) ? parsed.group_two : [];
    return { group_one, group_two };
  } catch (e) {
    const lines = String(text).split('\n').map((l) => l.trim()).filter(Boolean);
    const mid = Math.ceil(lines.length / 2);
    return { group_one: lines.slice(0, mid), group_two: lines.slice(mid) };
  }
}
