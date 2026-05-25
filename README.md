# 🩸 GlucoWise — AI-Powered Diabetes Insights Platform

> Built for real patients. Powered by Claude AI. Designed to surface the truth in your glucose data.

---

## 🎯 Vision

GlucoWise lets diabetes patients upload their LibreLink (or any CGM) CSV export and get deep, honest AI analysis — not just averages. It detects when your **Time-in-Range looks fine but your readings are actually dangerous**, finds hidden patterns, and explains everything in plain language.

---

## 🏗️ Architecture Overview

```
glucowise/
├── frontend/          # React + Vite (user interface)
├── backend/           # Node.js + Express (API + file handling)
├── ai-agent/          # Claude-powered analysis engine
├── docs/              # Full documentation
└── .github/workflows/ # CI/CD
```

---

## 🤖 AI Model Design

### Two-Model Architecture (Token-Efficient)

| Role | Model | Why |
|------|-------|-----|
| **Analyst** | `claude-sonnet-4-5` | Fast, cheap analysis of CSV data, pattern detection, insight generation |
| **Advisor** | `claude-opus-4-5` | Deep reasoning for edge cases, dangerous patterns, nuanced medical context |

### When Opus Gets Called
- Detected a "deceptive TIR" pattern (good average, bad distribution)
- Post-meal spikes exceeding 250 mg/dL repeatedly
- Nocturnal hypoglycemia risk
- Week-over-week deterioration trend
- User explicitly asks "explain this in detail"

### Token Efficiency Strategy
1. **Sonnet does the first pass** — parses CSV, computes stats, flags anomalies
2. **Sonnet formats a compact summary** (~300 tokens) of the flagged data
3. **Opus receives only the summary** — not the raw CSV — saving 90%+ of tokens
4. Responses are streamed back to the user

---

## 📊 CSV Analysis Features

### Input Support
- LibreLink export format (primary)
- Dexcom Clarity CSV
- Any CGM CSV with timestamp + glucose columns (auto-detected)

### What Gets Analyzed

#### 1. Standard Metrics
- Time in Range (TIR): < 70, 70–180, > 180 mg/dL
- GMI (Glucose Management Indicator)
- Coefficient of Variation (CV%)
- Standard Deviation
- Mean / Median glucose

#### 2. ⚠️ The "Deceptive TIR" Pattern Detection
This is the killer feature. A patient can have:
- TIR: 75% (looks great!)
- But: 3 severe highs + 3 severe lows that cancel each other out

GlucoWise detects:
- **Masking patterns**: highs and lows that average to "normal"
- **Distribution skew**: where most of the bad readings actually cluster
- **Time-of-day biases**: consistently high at night, low after lunch
- **Meal response volatility**: even if post-meal return to range is fast

#### 3. Pattern Detection
- Nocturnal hypoglycemia (2 AM–5 AM lows)
- Dawn phenomenon (rising fasting glucose)
- Post-meal spike signatures
- Exercise-induced patterns (time-of-day clustering)
- Sensor gap detection (missed readings = missed events)

#### 4. Trend Analysis
- Week-over-week TIR change
- Worsening/improving trajectory
- Seasonal/monthly drift

---

## 🗂️ Full File Structure

```
glucowise/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── UploadZone.jsx         # Drag-drop CSV uploader
│   │   │   ├── GlucoseChart.jsx       # Interactive time-series chart
│   │   │   ├── TIRDonut.jsx           # Time-in-range donut chart
│   │   │   ├── InsightCard.jsx        # AI insight display card
│   │   │   ├── PatternAlert.jsx       # Danger pattern alert banner
│   │   │   ├── StatGrid.jsx           # Key metrics grid
│   │   │   └── ChatBox.jsx            # Follow-up Q&A with AI
│   │   ├── pages/
│   │   │   ├── Home.jsx               # Landing + upload
│   │   │   ├── Dashboard.jsx          # Full analysis view
│   │   │   └── Report.jsx             # Printable PDF report
│   │   ├── hooks/
│   │   │   ├── useAnalysis.js         # API call + streaming hook
│   │   │   └── useCSVParser.js        # Client-side CSV preview
│   │   ├── utils/
│   │   │   └── glucoseFormulas.js     # GMI, CV%, TIR calculations
│   │   └── styles/
│   │       └── theme.css              # Design tokens
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── upload.js                  # POST /api/upload — CSV ingestion
│   │   ├── analyze.js                 # POST /api/analyze — trigger AI
│   │   ├── chat.js                    # POST /api/chat — follow-up Q&A
│   │   └── report.js                  # GET /api/report/:id — PDF export
│   ├── services/
│   │   ├── csvParser.js               # LibreLink + generic CSV parsing
│   │   ├── glucoseStats.js            # All metric calculations
│   │   ├── patternDetector.js         # Deceptive TIR + anomaly logic
│   │   └── aiOrchestrator.js          # Sonnet/Opus routing logic
│   ├── middleware/
│   │   ├── rateLimiter.js             # Protect API from abuse
│   │   ├── fileValidator.js           # CSV format validation
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── promptBuilder.js           # Build compact prompts for Claude
│   ├── app.js
│   └── package.json
│
├── ai-agent/
│   ├── sonnet-analyst.js              # First-pass analysis prompts
│   ├── opus-advisor.js                # Deep-dive reasoning prompts
│   ├── prompts/
│   │   ├── system-sonnet.md           # Sonnet system prompt
│   │   ├── system-opus.md             # Opus system prompt
│   │   └── patterns.md                # Pattern detection definitions
│   └── tokenBudget.js                 # Token counting + routing logic
│
├── docs/
│   ├── PLAN.md                        # This file
│   ├── CSV_FORMATS.md                 # Supported CSV column specs
│   ├── API.md                         # Backend API docs
│   └── DEPLOYMENT.md                  # How to deploy
│
└── .github/
    └── workflows/
        └── deploy.yml                 # CI/CD pipeline
```

---

## 🔧 Tech Stack

### Frontend
| Tool | Purpose |
|------|---------|
| React 18 + Vite | Fast SPA |
| Recharts | Glucose time-series + TIR charts |
| TailwindCSS | Utility styling |
| Papa Parse | Client-side CSV preview |
| React Query | API state management |

### Backend
| Tool | Purpose |
|------|---------|
| Node.js + Express | API server |
| Multer | CSV file upload handling |
| csv-parse | Server-side CSV parsing |
| Anthropic SDK | Claude API calls |
| Redis (optional) | Cache analysis results |

### AI Layer
| Model | Role | Avg tokens/request |
|-------|------|-------------------|
| claude-sonnet-4-5 | CSV analysis, metric computation summary, chat replies | ~800 |
| claude-opus-4-5 | Deceptive pattern deep-dives, dangerous trend alerts | ~400 (receives only summary) |

---

## 🚀 Claude Code Implementation Instructions

### Step 1 — Initialize Repo
```bash
# Run this first
npm create vite@latest frontend -- --template react
cd backend && npm init -y
npm install express multer csv-parse @anthropic-ai/sdk cors dotenv
```

### Step 2 — Build Backend First (in this order)
1. `csvParser.js` — handle LibreLink column names
2. `glucoseStats.js` — TIR, GMI, CV%, SD
3. `patternDetector.js` — deceptive TIR logic
4. `promptBuilder.js` — compact ~300 token summaries
5. `aiOrchestrator.js` — route to Sonnet vs Opus
6. Routes: upload → analyze → chat

### Step 3 — Build Frontend
1. `UploadZone` — drag and drop CSV
2. `StatGrid` — key numbers
3. `TIRDonut` — visual TIR breakdown
4. `GlucoseChart` — full timeline
5. `PatternAlert` — dangerous pattern banner
6. `InsightCard` — AI text output
7. `ChatBox` — follow-up questions

### Step 4 — Wire AI Agent
1. Write system prompts (see `ai-agent/prompts/`)
2. Implement token budget logic
3. Test with real LibreLink CSV exports

---

## 💡 Prompt Strategy (Token-Efficient)

### Sonnet System Prompt (condensed)
```
You are a diabetes data analyst. Given glucose statistics, identify:
1. TIR breakdown with honest assessment
2. Dangerous patterns hidden by averages
3. Top 3 actionable insights
Be direct. Medical context only. No fluff.
Output JSON: { tirAssessment, hiddenPatterns[], insights[], riskLevel, needsDeepDive }
```

### Opus Only Receives
```
Patient summary (Sonnet output):
- TIR: 74% but bimodal distribution
- Pattern: nocturnal lows + post-lunch highs masking each other
- Flagged: deceptive_tir, high_cv (42%)
Provide detailed medical reasoning and recommendations.
```

This saves ~3,000 tokens per deep-dive call.

---

## 📱 LibreLink CSV Format Reference

LibreLink exports columns like:
```
Device,Serial Number,Device Timestamp,Record Type,Historic Glucose mg/dL,Scan Glucose mg/dL,Non-numeric Rapid-Acting Insulin,Rapid-Acting Insulin (units),Non-numeric Food,Carbohydrates (grams),Carbohydrates (servings),Non-numeric Long-Acting Insulin,Long-Acting Insulin (value),Notes,Strip Glucose mg/dL,Ketone mmol/L,Meal Insulin (units),Correction Insulin (units),User Change Insulin (units)
```

Key columns:
- `Device Timestamp` → datetime
- `Historic Glucose mg/dL` → continuous readings (every 15 min)
- `Scan Glucose mg/dL` → manual scans
- `Record Type` → 0=historic, 1=scan, 6=event

---

## 🌐 Deployment Plan

### Option A: Simple (Recommended to start)
- **Frontend**: Vercel (free tier)
- **Backend**: Railway or Render (free tier)
- **No database needed** — stateless, CSV processed in memory

### Option B: Production
- **Frontend**: Vercel
- **Backend**: AWS ECS or Fly.io
- **Storage**: S3 (optional, for saving past reports)
- **Cache**: Redis (for repeat analyses)

### Environment Variables
```env
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
MAX_FILE_SIZE_MB=10
ENABLE_OPUS=true
OPUS_THRESHOLD_RISK=high
```

---

## 🔐 Privacy & Security

- CSV files are **never stored** — processed in memory, discarded after analysis
- No user accounts required (v1)
- All processing server-side (CSV never sent to Claude raw — only stats summary)
- Rate limiting: 10 analyses/hour per IP
- File size limit: 10MB
- CSV-only validation (no executable uploads)

---

## 🗺️ Development Phases

### Phase 1 — MVP (2 weeks with Claude Code)
- [ ] CSV upload + LibreLink parsing
- [ ] Core stats (TIR, GMI, CV%)
- [ ] Basic Sonnet analysis
- [ ] Simple dashboard UI

### Phase 2 — Intelligence (1 week)
- [ ] Deceptive TIR pattern detection
- [ ] Opus routing for high-risk patterns
- [ ] Pattern alert UI
- [ ] Follow-up chat

### Phase 3 — Polish (1 week)
- [ ] Printable PDF report
- [ ] Multiple CSV file comparison
- [ ] Mobile responsive
- [ ] Deploy to production

---

## 🩺 A Note From a Patient

This project is built by someone who uses LibreLink every day and knows that a "good" TIR number can hide dangerous patterns. The goal isn't to replace doctors — it's to give patients the vocabulary and insight to have better conversations with them.

**GlucoWise surfaces what the averages hide.**
