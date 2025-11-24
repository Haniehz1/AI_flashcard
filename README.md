# AI Flashcards (Next.js)

Generate smart flashcards from any text using OpenAI (gpt-4o-mini). Built with Next.js 14 App Router and Tailwind CSS, ready for Vercel deployment.

## Setup

1) Install dependencies
```bash
npm install
```
2) Add your OpenAI key
```bash
cp .env.example .env.local
# edit .env.local and set OPENAI_API_KEY
```

## Run locally
```bash
npm run dev
# app runs at http://localhost:3000
```

## API
- Endpoint: `POST /api/generate`
- Body: `{ "text": string }`
- Validation: requires >= 50 characters, truncates to 8000 characters
- Timeout: 15s; returns `{ cards: [{ front, back }] }` or `{ error }`

## Deploy
- Push to GitHub, connect the repo to Vercel, and set `OPENAI_API_KEY` in Vercel environment variables. Build command: `npm run build`.
