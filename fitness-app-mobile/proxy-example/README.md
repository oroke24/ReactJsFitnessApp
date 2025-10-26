# AI Proxy Example

Use a tiny serverless endpoint to call OpenAI or Gemini with your server-side API key, so the mobile app never ships secrets.

## Contract
- Endpoint: `POST /api/revamp`
- Body: `{ type: 'recipe' | 'exercise', content: string }`
- Response: `{ group_one: string[], group_two: string[] }`

## Vercel (Node.js) example
Create `api/revamp.ts` with:

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const { type, content } = req.body || {};
  if (!type || !content) return res.status(400).json({ error: 'Missing type/content' });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // set in Vercel Project Settings
  if (!GEMINI_API_KEY) return res.status(500).json({ error: 'Server missing GEMINI_API_KEY' });

  const system = `You are an expert fitness and cooking assistant.
Given a ${type} card content, split it into two clear sections:
- group_one: bullet-style lines suitable for the first section (for recipe: Ingredients; for exercise: Muscle Group notes or equipment)
- group_two: bullet-style lines suitable for the second section (for recipe: Instructions; for exercise: Step-by-step Instructions)
Return ONLY JSON with keys group_one and group_two as arrays of strings.`;

  const prompt = `${system}\n\nCONTENT:\n${content}`;

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
  };

  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) {
    const t = await r.text().catch(() => '');
    return res.status(502).json({ error: `Upstream error ${r.status}`, detail: t });
  }
  const data = await r.json();
  const text = data?.candidates?.[0]?.content?.parts?.map((p: any) => p?.text || '').join('\n') || '';

  try {
    const jsonStart = text.indexOf('{');
    const jsonEnd = text.lastIndexOf('}');
    const sliced = jsonStart >= 0 ? text.slice(jsonStart, jsonEnd + 1) : text;
    const parsed = JSON.parse(sliced);
    const group_one = Array.isArray(parsed.group_one) ? parsed.group_one : [];
    const group_two = Array.isArray(parsed.group_two) ? parsed.group_two : [];
    return res.json({ group_one, group_two });
  } catch {
    const lines = String(text).split('\n').map((l) => l.trim()).filter(Boolean);
    const mid = Math.ceil(lines.length / 2);
    return res.json({ group_one: lines.slice(0, mid), group_two: lines.slice(mid) });
  }
}
```

Deploy, then set in your mobile `.env`:

```
EXPO_PUBLIC_AI_PROXY_URL="https://your-vercel-domain.vercel.app/api"
```

## Cloud Functions / Other
Any platform works as long as it follows the contract above and holds the API key server-side.
