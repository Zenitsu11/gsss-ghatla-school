# GSSS Ghatla School Website

Professional Next.js school website with a public landing page and protected staff dashboard.

## Run locally

1. Install Node.js 20 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local` (a ready-to-use `.env.local` is included for this submission).
4. Run `npm run dev`, then open `http://localhost:3000`.

## Demo staff credentials

- Email: `admin@gsssghatla.edu.in`
- Password: `Ghatla@2026`

Change all environment values before a public production deployment.

## Deploy

Push this folder to GitHub, import the repository into Vercel, and add `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and a long unique `SESSION_SECRET` in Vercel → Project Settings → Environment Variables. Vercel will build it automatically with `npm run build`.
