# FinTrack

FinTrack is a full-stack personal finance app with:

- React + TypeScript frontend (`frontend/`)
- Node.js + Express + TypeScript backend (`backend/`)
- Local transaction management with dashboard, reports, and AI-powered extraction/insights

## Tech Stack

- Frontend: React, Vite, TypeScript, Tailwind, Redux Toolkit
- Backend: Express, TypeScript, Multer, CSV/PDF parsing
- AI: Gemini (for statement extraction and insights)

## Project Structure

- `frontend/` - UI app
- `backend/` - API server
- root `package.json` - runs frontend and backend together

## Prerequisites

- Node.js 18+ (Node 20+ recommended)
- npm 9+
- Gemini API key

## Environment Setup

Create `backend/.env`:

```env
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
PORT=3000
```

> Do not commit `backend/.env`.

## Install

From the repo root:

```bash
npm install
npm --prefix frontend install
npm --prefix backend install
```

## Run Locally

From root:

```bash
npm run dev
```

This starts:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3000`

## Build

From root:

```bash
npm run build
```

## Production Start (Backend)

```bash
npm --prefix backend run start
```

## Features

- Manual transaction add/edit/delete
- Bank statement upload (`.csv` / `.pdf`) with AI extraction
- Dashboard and reports (including expense pie chart)
- AI insights page with on-demand generation

## Publish/Deploy Notes

- Commit source + lockfiles; do not commit `node_modules/` or `dist/`.
- Install dependencies in deployment environment, then run build/start commands.
- Ensure `GEMINI_API_KEY` is set in deployment environment variables.

## Vercel Deployment

This is a split frontend/backend app. For Vercel:

1. Deploy the **frontend only** by setting Vercel **Root Directory** to `frontend`.
2. Add frontend env var in Vercel:
   - `VITE_API_BASE_URL=https://<your-backend-url>`
3. Deploy backend separately (Render/Railway/Fly/other Node host) and set:
   - `GEMINI_API_KEY`
   - `GEMINI_MODEL` (optional)
   - `PORT`

If you deploy the repo root directly to Vercel, you can get `404: NOT_FOUND` because Vercel may build the wrong app.
