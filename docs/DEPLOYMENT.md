# Deployment Guide

## Quickest Path: Vercel (Frontend) + Railway (Backend)

### 1. Backend → Railway
1. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
2. Select `glucowise` repo, set root to `/backend`
3. Add environment variable: `ANTHROPIC_API_KEY=sk-ant-...`
4. Railway auto-detects Node.js and deploys
5. Note your Railway URL: `https://glucowise-backend.up.railway.app`

### 2. Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import from GitHub
2. Set root directory to `/frontend`
3. Add environment variable: `VITE_API_URL=https://your-railway-url.up.railway.app`
4. Update `vite.config.js` proxy or use env var in fetch calls
5. Deploy

### 3. Update CORS
In `backend/app.js`, update:
```js
cors({ origin: 'https://your-vercel-url.vercel.app' })
```

## Local Development
```bash
# Terminal 1 — Backend
cd backend
cp ../.env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm install
npm run dev

# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
# Open http://localhost:5173
```

## Environment Variables Reference
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | — | Your Anthropic API key |
| `PORT` | No | 3001 | Backend port |
| `FRONTEND_URL` | No | localhost:5173 | CORS allowed origin |
| `ENABLE_OPUS` | No | true | Set false to disable Opus (saves cost) |
