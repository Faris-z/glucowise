const express = require('express');
const { chatStream } = require('../services/aiOrchestrator');

const router = express.Router();

// POST /api/chat — streamed response
router.post('/', async (req, res, next) => {
  try {
    const { message, context } = req.body;
    if (!message) return res.status(400).json({ error: 'Missing message' });
    if (typeof message !== 'string' || message.length > 500) {
      return res.status(400).json({ error: 'Message must be a string under 500 characters' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    for await (const chunk of chatStream(message, context || {})) {
      res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
