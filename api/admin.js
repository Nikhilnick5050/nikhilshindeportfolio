const { buildStats, loadPortfolioData } = require('./_lib/portfolio-store');

function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
}

module.exports = async function handler(req, res) {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'GET') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const endpoint = String(req.query?.endpoint || '').trim().toLowerCase();
  const data = await loadPortfolioData();

  if (endpoint === 'projects') {
    sendJson(res, 200, data.projects);
    return;
  }

  if (endpoint === 'testimonials') {
    sendJson(res, 200, data.testimonials);
    return;
  }

  if (endpoint === 'stats') {
    sendJson(res, 200, buildStats(data));
    return;
  }

  sendJson(res, 400, { error: 'Invalid endpoint' });
};
