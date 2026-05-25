const express = require('express');
const { generateInsights } = require('../services/aiOrchestrator');

const router = express.Router();

// POST /api/analyze
// Receives stats + patterns from frontend, returns AI insights
router.post('/', async (req, res, next) => {
  try {
    const { stats, patterns, forceOpus } = req.body;
    if (!stats) return res.status(400).json({ error: 'Missing stats' });

    const result = await generateInsights(stats, patterns || [], forceOpus || false);
    res.json(result);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
