const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const profilePath = path.join(__dirname, '..', 'data', 'profile.json');
const caseStudiesPath = path.join(__dirname, '..', 'data', 'case-studies.json');

function loadJson(filePath) {
  try {
    const raw = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
    return null;
  }
}

// GET /api/health
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Gazi Fahim Hasan Portfolio API',
    uptimeSeconds: Math.floor(process.uptime()),
    version: '1.0.0'
  });
});

// GET /api/profile
router.get('/profile', (req, res) => {
  const profile = loadJson(profilePath);
  if (!profile) {
    return res.status(500).json({ error: 'Failed to load profile data' });
  }
  res.json(profile);
});

// GET /api/case-studies
router.get('/case-studies', (req, res) => {
  const cases = loadJson(caseStudiesPath);
  if (!cases) {
    return res.status(500).json({ error: 'Failed to load case studies' });
  }
  res.json(cases);
});

// GET /api/stats
router.get('/stats', (req, res) => {
  const profile = loadJson(profilePath);
  if (!profile || !profile.stats) {
    return res.status(500).json({ error: 'Stats unavailable' });
  }
  res.json({
    stats: profile.stats,
    status: profile.status
  });
});

module.exports = router;
