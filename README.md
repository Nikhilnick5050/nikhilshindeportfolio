# Portfolio + Vercel Serverless Backend

This project is a Create React App frontend with a JavaScript backend for Vercel serverless functions.

## Backend endpoints

- `GET /api/admin?endpoint=projects`
- `GET /api/admin?endpoint=testimonials`
- `GET /api/admin?endpoint=stats`
- `GET /api/chat` (health check)
- `POST /api/chat` (AI chat)

Compatibility rewrites are configured so old PHP paths continue to work:

- `/admin/api.php` -> `/api/admin`
- `/admin/chat.php` -> `/api/chat`

## Data source

Serverless API reads data from:

- `data/portfolio.json`

Update this file to change projects/testimonials returned by `/api/admin`.

## Environment variables

Copy `.env.example` to `.env` and set values:

- `GROQ_API_KEY` (required for `/api/chat`)
- `GROQ_MODEL` (optional)
- `REACT_APP_FORMSPREE_ENDPOINT` (optional)
- `REACT_APP_CHAT_API_URL` (optional; default is `/api/chat`)
- `REACT_APP_API_URL` (optional; default is `/api/admin`)
- `REACT_APP_GOOGLE_CLIENT_ID` (optional)

## Local development

```bash
npm start
```

## Production build

```bash
npm run build
```

## Deploy to Vercel

1. Import this repo into Vercel.
2. Set environment variable `GROQ_API_KEY` in Vercel Project Settings.
3. Deploy.
