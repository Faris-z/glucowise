const Groq = require('groq-sdk');

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Groq free models — Fast model for analysis, large model for deep dives
const FAST_MODEL = 'llama-3.3-70b-versatile';  // main workhorse
const DEEP_MODEL  = 'llama-3.3-70b-versatile';  // same model, different prompt (Groq free tier)

const ANALYST_SYSTEM = `You are a diabetes data analyst. You receive pre-computed glucose statistics and detected patterns.
Your job: write clear, honest patient-facing insights. Be direct and specific. No fluff.
Use plain language a patient can understand. Flag dangerous patterns clearly.
Format: 2-3 short paragraphs. Start with the most important finding.`;

const ADVISOR_SYSTEM = `You are a senior diabetes care specialist reviewing flagged patterns from a patient's CGM data.
An analyst has already identified concerning patterns. Your job is to:
1. Explain WHY these patterns are medically significant
2. What they might indicate about the patient's management
3. What questions to bring to their doctor
4. What lifestyle or timing changes might help
Be thorough but accessible. This is a real patient reading this.`;

/**
 * Generate AI insights using Groq (free).
 * Uses fast model for standard analysis, deep model for critical patterns.
 */
async function generateInsights(stats, patterns, forceDeep = false) {
  const prompt = buildPrompt(stats, patterns);

  // First pass — fast analysis
  const firstResponse = await client.chat.completions.create({
    model: FAST_MODEL,
    max_tokens: 600,
    messages: [
      { role: 'system', content: ANALYST_SYSTEM },
      { role: 'user', content: prompt },
    ],
  });

  const firstInsight = firstResponse.choices[0].message.content;

  // Check if deep analysis needed
  const { needsOpus: needsDeep } = require('./patternDetector');
  const shouldGoDeep = forceDeep || needsDeep(patterns);

  if (!shouldGoDeep) {
    return { insights: firstInsight, model: FAST_MODEL, usedDeep: false };
  }

  // Deep pass — receives only the summary, not raw data
  const deepResponse = await client.chat.completions.create({
    model: DEEP_MODEL,
    max_tokens: 800,
    messages: [
      { role: 'system', content: ADVISOR_SYSTEM },
      {
        role: 'user',
        content: `Analyst summary:\n${firstInsight}\n\nFlagged patterns:\n${JSON.stringify(patterns, null, 2)}\n\nProvide your detailed assessment.`,
      },
    ],
  });

  return {
    insights: deepResponse.choices[0].message.content,
    firstPassSummary: firstInsight,
    model: DEEP_MODEL,
    usedDeep: true,
  };
}

/**
 * Streamed chat follow-up
 */
async function* chatStream(userMessage, context) {
  const stream = await client.chat.completions.create({
    model: FAST_MODEL,
    max_tokens: 400,
    stream: true,
    messages: [
      {
        role: 'system',
        content: `You are a helpful diabetes data assistant. The patient has already received an analysis of their glucose data.
Context: ${JSON.stringify(context)}
Answer follow-up questions concisely. Always recommend consulting their doctor for medical decisions.`,
      },
      { role: 'user', content: userMessage },
    ],
  });

  for await (const chunk of stream) {
    const text = chunk.choices[0]?.delta?.content || '';
    if (text) yield text;
  }
}

/**
 * Build compact prompt from stats — never sends raw CSV to the model
 */
function buildPrompt(stats, patterns) {
  return `Patient CGM Data Summary (${stats.daysCovered} days, ${stats.count} readings):
- Mean glucose: ${stats.mean} mg/dL | Median: ${stats.median} | SD: ${stats.sd} | CV: ${stats.cv}%
- GMI: ${stats.gmi}%
- Time in Range: Very Low ${stats.tir.veryLow}% | Low ${stats.tir.low}% | In Range ${stats.tir.inRange}% | High ${stats.tir.high}% | Very High ${stats.tir.veryHigh}%
- Range: ${stats.min}–${stats.max} mg/dL
${patterns.length ? `\nDetected patterns:\n${patterns.map(p => `[${p.severity.toUpperCase()}] ${p.title}: ${p.detail}`).join('\n')}` : '\nNo concerning patterns detected.'}

Provide patient-facing insights about this data.`;
}

module.exports = { generateInsights, chatStream };
