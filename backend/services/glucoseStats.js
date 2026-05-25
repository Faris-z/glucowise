/**
 * Compute all standard CGM metrics from normalized readings array.
 * readings: Array<{timestamp: Date, glucose: number}>
 */
function computeStats(readings) {
  if (!readings.length) throw new Error('No readings');

  const values = readings.map(r => r.glucose);
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sd = Math.sqrt(values.map(v => (v - mean) ** 2).reduce((a, b) => a + b) / values.length);
  const cv = (sd / mean) * 100;
  const median = [...values].sort((a, b) => a - b)[Math.floor(values.length / 2)];

  // TIR buckets (mg/dL)
  const veryLow = values.filter(v => v < 54).length;
  const low = values.filter(v => v >= 54 && v < 70).length;
  const inRange = values.filter(v => v >= 70 && v <= 180).length;
  const high = values.filter(v => v > 180 && v <= 250).length;
  const veryHigh = values.filter(v => v > 250).length;
  const total = values.length;

  const tir = {
    veryLow: pct(veryLow, total),
    low: pct(low, total),
    inRange: pct(inRange, total),
    high: pct(high, total),
    veryHigh: pct(veryHigh, total),
  };

  // GMI: estimated A1c from mean glucose
  const gmi = 3.31 + 0.02392 * mean;

  // Date range
  const timestamps = readings.map(r => r.timestamp.getTime());
  const startDate = new Date(Math.min(...timestamps));
  const endDate = new Date(Math.max(...timestamps));
  const daysCovered = (endDate - startDate) / (1000 * 60 * 60 * 24);

  return {
    count: total,
    mean: round(mean),
    median: round(median),
    sd: round(sd),
    cv: round(cv),
    gmi: round(gmi, 2),
    tir,
    min: Math.min(...values),
    max: Math.max(...values),
    daysCovered: Math.round(daysCovered),
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
  };
}

/**
 * Break readings into time-of-day buckets for pattern detection
 */
function bucketByHour(readings) {
  const buckets = Array.from({ length: 24 }, () => []);
  readings.forEach(r => {
    const hour = r.timestamp.getHours();
    buckets[hour].push(r.glucose);
  });
  return buckets.map((vals, hour) => ({
    hour,
    mean: vals.length ? round(vals.reduce((a, b) => a + b, 0) / vals.length) : null,
    count: vals.length,
  }));
}

/**
 * Weekly TIR trend (requires >= 14 days of data)
 */
function weeklyTrend(readings) {
  const byWeek = {};
  readings.forEach(r => {
    const week = getWeekKey(r.timestamp);
    if (!byWeek[week]) byWeek[week] = [];
    byWeek[week].push(r.glucose);
  });

  return Object.entries(byWeek)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([week, vals]) => ({
      week,
      tir: pct(vals.filter(v => v >= 70 && v <= 180).length, vals.length),
      mean: round(vals.reduce((a, b) => a + b, 0) / vals.length),
    }));
}

function pct(n, total) { return round((n / total) * 100); }
function round(n, d = 1) { return Math.round(n * 10 ** d) / 10 ** d; }
function getWeekKey(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString().split('T')[0];
}

module.exports = { computeStats, bucketByHour, weeklyTrend };
