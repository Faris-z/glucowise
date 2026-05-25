const express = require('express');
const multer = require('multer');
const { parseCSV } = require('../services/csvParser');
const { computeStats, bucketByHour, weeklyTrend } = require('../services/glucoseStats');
const { detectPatterns } = require('../services/patternDetector');

const router = express.Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_, file, cb) => {
    if (!file.originalname.match(/\.csv$/i)) {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
});

// POST /api/upload
// Returns parsed stats + patterns immediately (no AI call yet)
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const readings = parseCSV(req.file.buffer);
    if (readings.length < 10) {
      return res.status(400).json({ error: 'Not enough readings in file (minimum 10)' });
    }

    const stats = computeStats(readings);
    const hourlyBuckets = bucketByHour(readings);
    const trends = weeklyTrend(readings);
    const patterns = detectPatterns(readings, stats, hourlyBuckets);

    // Return lightweight chart data (downsample to 500 points max for frontend)
    const chartData = downsample(readings, 500).map(r => ({
      t: r.timestamp.toISOString(),
      g: r.glucose,
    }));

    res.json({ stats, patterns, hourlyBuckets, trends, chartData, readingCount: readings.length });
  } catch (err) {
    next(err);
  }
});

function downsample(readings, maxPoints) {
  if (readings.length <= maxPoints) return readings;
  const step = Math.ceil(readings.length / maxPoints);
  return readings.filter((_, i) => i % step === 0);
}

module.exports = router;
