/**
 * Pattern Detector — finds dangerous patterns that good averages can hide.
 *
 * This is the heart of GlucoWise.
 */

/**
 * Run all pattern detectors. Returns array of flagged patterns.
 */
function detectPatterns(readings, stats, hourlyBuckets) {
  const patterns = [];

  const p = (id, severity, title, detail) => patterns.push({ id, severity, title, detail });

  // 1. DECEPTIVE TIR — good TIR but high CV or bimodal distribution
  if (stats.tir.inRange >= 70 && stats.cv > 36) {
    p('deceptive_tir', 'high',
      'Deceptive Time-in-Range',
      `Your TIR looks good (${stats.tir.inRange}%) but your glucose variability is very high (CV=${stats.cv}%). ` +
      `This often means highs and lows are cancelling each other out in the average.`
    );
  }

  // 2. HIGH + LOW MASKING — both >180 and <70 are significant
  if (stats.tir.high + stats.tir.veryHigh > 15 && stats.tir.low + stats.tir.veryLow > 5) {
    p('high_low_masking', 'high',
      'Highs and Lows Are Masking Each Other',
      `You have significant time both above range (${stats.tir.high + stats.tir.veryHigh}%) ` +
      `and below range (${stats.tir.low + stats.tir.veryLow}%). These cancel out in averages but represent real risk.`
    );
  }

  // 3. NOCTURNAL HYPOGLYCEMIA — consistently low between 2-5 AM
  const nocturnalBuckets = hourlyBuckets.filter(b => b.hour >= 2 && b.hour <= 5);
  const nocturnalLow = nocturnalBuckets.filter(b => b.mean && b.mean < 80);
  if (nocturnalLow.length >= 2) {
    p('nocturnal_hypo', 'critical',
      'Nocturnal Hypoglycemia Pattern',
      `Your glucose consistently drops low between 2–5 AM ` +
      `(avg: ${nocturnalLow.map(b => `${b.hour}:00=${b.mean}`).join(', ')} mg/dL). ` +
      `This is a safety risk that may go unnoticed while asleep.`
    );
  }

  // 4. DAWN PHENOMENON — rising glucose 4–8 AM without food
  const dawnBuckets = hourlyBuckets.filter(b => b.hour >= 4 && b.hour <= 8 && b.mean);
  if (dawnBuckets.length >= 3) {
    const rising = dawnBuckets.every((b, i) =>
      i === 0 || b.mean > dawnBuckets[i - 1].mean
    );
    if (rising && dawnBuckets[dawnBuckets.length - 1].mean > 140) {
      p('dawn_phenomenon', 'medium',
        'Dawn Phenomenon Detected',
        `Your glucose rises consistently from ${dawnBuckets[0].mean} to ` +
        `${dawnBuckets[dawnBuckets.length - 1].mean} mg/dL between 4–8 AM, ` +
        `suggesting dawn phenomenon (natural cortisol/growth hormone rise).`
      );
    }
  }

  // 5. HIGH VARIABILITY — CV > 36% is clinically significant
  if (stats.cv > 36 && !patterns.find(p => p.id === 'deceptive_tir')) {
    p('high_variability', 'medium',
      'High Glucose Variability',
      `CV of ${stats.cv}% exceeds the safe threshold of 36%. ` +
      `High variability is an independent risk factor regardless of your mean glucose.`
    );
  }

  // 6. FREQUENT SEVERE LOWS
  const severeLows = readings.filter(r => r.glucose < 54).length;
  const severeLowPct = (severeLows / readings.length) * 100;
  if (severeLowPct > 1) {
    p('severe_lows', 'critical',
      'Frequent Severe Hypoglycemia',
      `${severeLows} readings below 54 mg/dL (${severeLowPct.toFixed(1)}% of all readings). ` +
      `Severe hypoglycemia requires immediate medical attention.`
    );
  }

  // 7. GMI vs ACTUAL A1C DISCREPANCY WARNING
  if (stats.gmi < 7 && stats.cv > 36) {
    p('gmi_misleading', 'medium',
      'GMI May Be Misleading',
      `Your estimated GMI of ${stats.gmi}% looks good, but with high variability (CV=${stats.cv}%), ` +
      `your actual A1c experience may be worse than the number suggests.`
    );
  }

  return patterns;
}

/**
 * Determine if patterns warrant escalation to Opus
 */
function needsOpus(patterns) {
  return patterns.some(p => p.severity === 'critical') ||
    patterns.filter(p => p.severity === 'high').length >= 2;
}

module.exports = { detectPatterns, needsOpus };
