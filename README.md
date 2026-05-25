# 🩸 GlucoWise — AI-Powered Diabetes Insights Platform

> Built for real patients. Powered by Groq AI. Designed to surface the truth in your glucose data.

---

## 🎯 Vision

GlucoWise lets diabetes patients upload their LibreLink (or any CGM) CSV export and get deep, honest AI analysis — not just averages. It detects when your **Time-in-Range looks fine but your readings are actually dangerous**, finds hidden patterns, and explains everything in plain language.

**Live demo:** https://glucowise-seven.vercel.app

---

## 🏗️ Architecture Overview

```
glucowise/
├── frontend/          # React + Vite (user interface)
├── backend/           # Node.js + Express (API + AI orchestration)
├── docs/              # Documentation
└── .github/workflows/ # CI/CD
```

---

## 🤖 AI Model Design

GlucoWise uses **`llama-3.3-70b-versatile`** via Groq for all AI features.

| Role | System Prompt | Triggered When |
|------|--------------|----------------|
| **Analyst** | Patient-facing, plain language insights | Every upload |
| **Advisor** | Senior specialist, deeper medical context | Critical patterns detected |

### When the Advisor Role Gets Triggered
- Detected a "deceptive TIR" pattern (good average, bad distribution)
- Nocturnal hypoglycemia risk (2 AM–5 AM lows)
- High/low masking (highs and lows cancelling each other out)

### What Gets Sent to the AI
Only pre-computed stats and detected patterns — raw CSV data is never sent.

---

## 📊 CSV Analysis Features

### Input Support
- LibreLink export format (primary)
- Dexcom Clarity CSV
- Any CGM CSV with timestamp + glucose columns (auto-detected)

### What Gets Analyzed

#### 1. Standard Metrics
- Time in Range (TIR): < 54, 54–70, 70–180, 180–250, > 250 mg/dL
- GMI (Glucose Management Indicator)
- Coefficient of Variation (CV%)
- Standard Deviation
- Mean / Median glucose

#### 2. ⚠️ The "Deceptive TIR" Pattern Detection
This is the core feature. A patient can have:
- TIR: 75% (looks great!)
- But: 3 severe highs + 3 severe lows that cancel each other out

GlucoWise detects:
- **Masking patterns**: highs and lows that average to "normal"
- **High/low masking**: significant readings in both danger bands
- **Time-of-day biases**: consistently high at night, low after lunch
- **Nocturnal hypoglycemia**: repeated lows between 2–5 AM

#### 3. Pattern Detection
- Nocturnal hypoglycemia (2 AM–5 AM lows)
- Deceptive TIR (good average hiding dangerous distribution)
- High/low masking
- Sensor gap detection (missed readings)

---

## 🗂️ File Structure

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
│   │   │   └── Dashboard.jsx          # Full analysis view
│   │   └── styles/
│   │       └── theme.css              # Design tokens
│   ├── index.html
│   ├── vite.config.js
│   ├── vercel.json
│   └── package.json
│
├── backend/
│   ├── routes/
│   │   ├── upload.js                  # POST /api/upload — CSV ingestion
│   │   ├── analyze.js                 # POST /api/analyze — trigger AI
│   │   └── chat.js                    # POST /api/chat — follow-up Q&A
│   ├── services/
│   │   ├── csvParser.js               # LibreLink + Dexcom + generic CSV parsing
│   │   ├── glucoseStats.js            # All metric calculations
│   │   ├── patternDetector.js         # Deceptive TIR + anomaly logic
│   │   └── aiOrchestrator.js          # Two-pass Groq routing logic
│   ├── middleware/
│   │   └── errorHandler.js
│   ├── app.js
│   └── package.json
│
├── docs/
│   └── DEPLOYMENT.md
│
└── .github/
    └── workflows/
        └── ci.yml
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
| groq-sdk | Groq AI API calls |
| express-rate-limit | Protect API from abuse |

### AI Layer
| Model | Role | Max tokens |
|-------|------|-----------|
| `llama-3.3-70b-versatile` | First-pass analysis + chat replies | 600 (analysis), 400 (chat) |
| `llama-3.3-70b-versatile` | Deep-dive for critical patterns | 800 |

---

## 🚀 Running Locally

```bash
# Backend
cd backend
npm install
cp ../.env.example .env
# Fill in GROQ_API_KEY in .env (free at console.groq.com)
node app.js

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

---

## 🌐 Deployment

| Service | URL |
|---------|-----|
| Frontend (Vercel) | https://glucowise-seven.vercel.app |
| Backend (Render) | https://glucowise.onrender.com |

### Environment Variables (backend)
```env
GROQ_API_KEY=your-groq-key
PORT=3001
FRONTEND_URL=https://glucowise-seven.vercel.app
```

---

## 📱 LibreLink CSV Format Reference

LibreLink exports columns like:
```
Device,Serial Number,Device Timestamp,Record Type,Historic Glucose mg/dL,Scan Glucose mg/dL,...
```

Key columns:
- `Device Timestamp` — datetime of reading
- `Historic Glucose mg/dL` — continuous readings (every 15 min), Record Type 0
- `Scan Glucose mg/dL` — manual scans, Record Type 1

---

## 🔐 Privacy & Security

- CSV files are **never stored** — processed in memory, discarded after analysis
- No user accounts required (v1)
- Raw CSV data is **never sent to the AI** — only computed stats summary (~300 tokens)
- Rate limiting on all API endpoints
- CSV-only file validation

---

## 🩺 A Note From a Patient

This project is built by someone who uses LibreLink every day and knows that a "good" TIR number can hide dangerous patterns. The goal isn't to replace doctors — it's to give patients the vocabulary and insight to have better conversations with them.

**GlucoWise surfaces what the averages hide.**
