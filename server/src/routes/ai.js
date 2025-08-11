import { Router } from 'express';
import { aiSuggestSchema } from '../validators/aiSchemas.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

router.post('/suggest', async (req, res, next) => {
  try {
    const key = process.env.OPENAI_API_KEY || '';
    if (!key) return res.status(503).json({ error: 'AI not configured' });

    const parsed = aiSuggestSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
    }

    const { title, description } = parsed.data;
    const model = process.env.OPENAI_MODEL || 'gpt-4o-mini'; 
    const controller = new AbortController();
    const to = setTimeout(() => controller.abort(), 10_000);

    const prompt =
      'Improve a task title and summary for a task manager. ' +
      'Return ONLY JSON with keys "title" and "description". Keep it concise.';

    const userPayload = { title: title ?? null, description: description ?? null };

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key,
      ...(process.env.OPENAI_PROJECT_ID ? { 'OpenAI-Project': process.env.OPENAI_PROJECT_ID } : {})
    };

    // Responses API request
    const resp = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      signal: controller.signal,
      headers,
      body: JSON.stringify({
        model,
        temperature: 0.3,
        response_format: { type: 'json_object' }, 
        input: [
          { role: 'system', content: prompt },
          { role: 'user', content: 'Input: ' + JSON.stringify(userPayload) }
        ]
      })
    }).finally(() => clearTimeout(to));

    if (!resp.ok) {
      const text = await resp.text().catch(() => '');
      return res.status(502).json({ error: 'AI service error', details: text });
    }

    const data = await resp.json();
    
    const content = data?.output_text ??
      (data?.output?.[0]?.content?.[0]?.text ?? '');

    let suggestion = { title: title ?? '', description: description ?? '' };
    try {
      const j = JSON.parse(content || '{}');
      if (j.title) suggestion.title = j.title;
      if ('description' in j) suggestion.description = j.description ?? suggestion.description;
    } catch {
      // keep original if parsing fails
    }

    return res.json({ suggestion, model, via: 'responses' });
  } catch (err) {
    return next(err);
  }
});

export default router;
