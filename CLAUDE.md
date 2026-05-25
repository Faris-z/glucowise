# CLAUDE.md — GlucoWise Development Guide

This file tells Claude Code how to work on this project.

## Project Purpose
GlucoWise is a diabetes CGM data analysis platform. Patients upload LibreLink CSV exports and receive AI-powered glucose insights using Claude llama-3.3-70b-versatile (Sonnet) for standard analysis and llama-3.3-70b-versatile (Opus) only for critical patterns.

## Architecture
- `frontend/` — React + Vite SPA
- `backend/` — Express API server
- `backend/services/` — Core logic (never skip tests here)

## Model Usage Rules
- **ALWAYS use `llama-3.3-70b-versatile`** for primary analysis (`aiOrchestrator.js`)
- **ONLY use `llama-3.3-70b-versatile`** when `needsOpus()` returns true (critical risk patterns)
- **NEVER send raw CSV data to Claude** — only computed stats summaries (~300 tokens)
- Sonnet max_tokens: 600 for analysis, 400 for chat
- Opus max_tokens: 800 (only when escalating)

## Key Files to Understand
1. `backend/services/patternDetector.js` — the core differentiation feature
2. `backend/services/aiOrchestrator.js` — Sonnet/Opus routing
3. `backend/services/csvParser.js` — LibreLink column mapping

## When Adding Features
- New pattern detectors go in `patternDetector.js`
- New chart types go in `frontend/src/components/`
- New API routes go in `backend/routes/` + registered in `app.js`

## CSV Format
LibreLink primary columns:
- `Device Timestamp` — ISO datetime
- `Historic Glucose mg/dL` — continuous sensor reading (Record Type 0)
- `Scan Glucose mg/dL` — manual scan (Record Type 1)
- `Record Type` — 0=historic, 1=scan (only these two matter for analysis)

## Running Locally
```bash
# Backend
cd backend && npm install && cp ../.env.example .env
# Fill in GROQ_API_KEY in .env
node app.js

# Frontend (new terminal)
cd frontend && npm install && npm run dev
```

## Testing
- Upload a real LibreLink CSV to test the full pipeline
- Check `patternDetector.js` logic manually with edge cases:
  - Good TIR + high CV → should trigger `deceptive_tir`
  - Both high + low bands → should trigger `high_low_masking`
  - 2–5 AM lows in hourlyBuckets → should trigger `nocturnal_hypo`

## Privacy Rules
- CSV files MUST NOT be stored to disk or database
- Only computed stats are sent to Claude, never raw readings
- No user accounts in v1
