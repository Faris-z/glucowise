require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const uploadRoute = require('./routes/upload');
const analyzeRoute = require('./routes/analyze');
const chatRoute = require('./routes/chat');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '50kb' }));

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/upload', limiter, uploadRoute);
app.use('/api/analyze', limiter, analyzeRoute);
app.use('/api/chat', limiter, chatRoute);
app.get('/health', (_, res) => res.json({ status: 'ok' }));
app.use(errorHandler);

app.listen(PORT, () => console.log(`GlucoWise backend running on :${PORT}`));
