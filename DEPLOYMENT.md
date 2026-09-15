# Production Deployment — Eng Moaaz Ismail

## Required services
- PostgreSQL 15+
- Node 20+
- HTTPS domain
- Google Cloud OAuth + YouTube Data API
- A real Egyptian payment gateway with signed webhooks
- Object storage for student uploads (do not store uploads in the application container)

## Environment
Copy `.env.example` to `.env` and replace every placeholder. Never commit `.env`.

Required secrets:
- DATABASE_URL
- AUTH_SECRET
- PAYMENT_WEBHOOK_SECRET
- TOKEN_ENCRYPTION_KEY
- GOOGLE_YOUTUBE_CLIENT_ID
- GOOGLE_YOUTUBE_CLIENT_SECRET
- GOOGLE_YOUTUBE_REDIRECT_URI
- NEXT_PUBLIC_APP_URL

Generate independent high-entropy secrets for AUTH_SECRET, PAYMENT_WEBHOOK_SECRET and TOKEN_ENCRYPTION_KEY.

## Release sequence
```bash
npm ci
npm run db:generate
npm run db:migrate:deploy
npm run lint
npm run build
npm run release:test
npm run release:audit
npm start
```

## First deployment
The repository must contain a committed `package-lock.json`. This environment could not generate it because npm registry access timed out; generate it locally/CI with `npm install --package-lock-only` and commit it before using `npm ci`.

## Payment go-live
The manual Admin confirmation flow is retained as a fallback. For automated payment confirmation, configure the gateway webhook to call `/api/payments/webhook`, use the shared signing secret, send a unique `eventId`, and send the exact order amount. Test retries and duplicate webhook delivery in staging.

## YouTube go-live
Configure the OAuth redirect URI exactly as registered in Google Cloud. Store the refresh token only through the encrypted `TOKEN_ENCRYPTION_KEY` mechanism. Use Unlisted/Private according to the chosen content policy; YouTube Unlisted is not DRM.

## Uploads
The current YouTube upload endpoint uses a temporary filesystem file only as a transfer buffer. Student assignment uploads still require an object-storage adapter before accepting arbitrary student files in production.
