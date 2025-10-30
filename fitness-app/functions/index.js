const admin = require('firebase-admin');
const { onRequest } = require('firebase-functions/v2/https');
const { defineSecret } = require('firebase-functions/params');

// Initialize Admin SDK (required in functions env)
try {
  admin.app();
} catch (e) {
  admin.initializeApp();
}

// Secrets (new API). Also works if provided as plain env var.
const GEMINI_API_KEY = defineSecret('GEMINI_API_KEY');

// Utility: parse JSON safely
function safeJson(req) {
  try {
    return typeof req.body === 'object' ? req.body : JSON.parse(req.body || '{}');
  } catch {
    return {};
  }
}

exports.revamp = onRequest({ region: 'us-central1', memory: '256MiB', timeoutSeconds: 30, secrets: [GEMINI_API_KEY] }, async (req, res) => {
  // CORS (mobile clients typically don't need this, but harmless)
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { type, content, notes } = safeJson(req);
  if (!type || !content) return res.status(400).json({ error: 'Missing type or content' });

  const key = GEMINI_API_KEY.value() || process.env.GEMINI_API_KEY;
  if (!key) return res.status(500).json({ error: 'Missing GEMINI_API_KEY on server' });

  // Match web logic for role instructions and formatting
  let aiRole = '';
  if (String(type).toLowerCase() === 'exercise') {
    aiRole = "You are a professional fitness trainer, building exercise cards. 'group_one' is for muscle group(s) and 'group_two' is for roughly one or two hours of exercises (Be specific and include sets, reps, or time intervals when helpful). ";
  } else {
    aiRole = "You are a professional dietitian/chef, building recipe cards. 'group_one' is for ingredients and 'group_two' is for instructions. ";
  }
  aiRole += "Format response to be a JSON (only raw JSON data, without any markdown like '``` Json... ```'). It should contain a list of strings named 'group_one', and a list of strings named 'group_two'. Begin each string with a hyphen. For 'group_two' use digits for numbers, 18 word limit per string.";

  const userMessage = `Build a card based on this information, feel free to add, modify, or remove as you want: ${content}`;
  const notesSection = notes ? `\n\nUSER_NOTES:\n${notes}` : '';
  const prompt = `${aiRole}\n\n${userMessage}${notesSection}`;

  // Use a stable, generally-available model alias
  // Switch to Gemini 2.0 Flash model
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${encodeURIComponent(key)}`;
  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ],
  };

  try {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!r.ok) {
      const t = await r.text().catch(() => '');
      return res.status(502).json({ error: `Upstream error ${r.status}`, detail: t });
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.map((p) => p?.text || '').join('\n') || '';

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
  } catch (e) {
    console.error('revamp error', e);
    return res.status(500).json({ error: 'Proxy failure' });
  }
});
