const { loadPortfolioData } = require('./_lib/portfolio-store');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama3-8b-8192';

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }

  const rawBody = Buffer.concat(chunks).toString('utf8').trim();
  if (!rawBody) {
    return {};
  }

  try {
    return JSON.parse(rawBody);
  } catch {
    throw new Error('Invalid JSON body');
  }
}

function buildSystemPrompt(data) {
  const topProjects = data.projects.slice(0, 3).map((project) => ({
    title: project.title,
    category: project.category,
    technologies: project.technologies,
    description: project.description,
  }));

  const topTestimonials = data.testimonials.slice(0, 3).map((item) => ({
    name: item.name,
    company: item.company,
    testimonial: item.testimonial,
  }));

  const profile = data.profile || {};
  const profileName = profile.name || 'Nikhil';
  const profileEmail = profile.email || '';

  return `You are ${profileName}'s AI Assistant.
Answer in a natural, conversational style and use third person when describing ${profileName}.
Keep responses short: 5-6 sentences max.
Mention at most 2-3 examples when listing projects or skills.
If the user asks for project collaboration or direct contact, share this email: ${profileEmail || 'not available'}.

Profile:
${JSON.stringify(
  {
    name: profile.name,
    title: profile.title,
    bio: profile.bio,
    location: profile.location,
  },
  null,
  2
)}

Projects:
${JSON.stringify(topProjects, null, 2)}

Testimonials:
${JSON.stringify(topTestimonials, null, 2)}`;
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method === 'GET') {
    sendJson(res, 200, { status: 'active', message: 'Chat API is working' });
    return;
  }

  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    sendJson(res, 400, { error: error instanceof Error ? error.message : 'Invalid request body' });
    return;
  }

  const userMessage = String(body.message || '').trim();
  if (!userMessage) {
    sendJson(res, 400, { error: 'Message is required' });
    return;
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    sendJson(res, 500, { error: 'Missing GROQ_API_KEY in environment configuration.' });
    return;
  }

  try {
    const data = await loadPortfolioData();
    const systemPrompt = buildSystemPrompt(data);

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || DEFAULT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 250,
      }),
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMessage =
        payload?.error?.message || payload?.error || `Upstream API error (${response.status})`;
      sendJson(res, response.status, { error: errorMessage });
      return;
    }

    sendJson(res, 200, payload || { error: 'Invalid upstream response' });
  } catch (error) {
    sendJson(res, 500, {
      error: error instanceof Error ? error.message : 'Unexpected server error',
    });
  }
};
