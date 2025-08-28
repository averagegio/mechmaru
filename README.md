This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Upstash Redis Integration (Vercel)

1) In Vercel → Integrations, add "Upstash Redis" to this project.
2) Ensure these env vars are present (set by the integration):
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
3) Locally, run `vercel env pull .env.local` to sync env vars if you use `next dev`.

### Seeding

- Set a secret token in Vercel Project → Settings → Environment Variables:
  - `SEED_TOKEN` = a long random string
- Trigger seed once (replace <token>):
```bash
curl -X POST "https://<your-deployment>/api/admin/seed?token=<token>"
```

### Endpoints using Postgres

- `GET /api/health` → indicates if Redis is reachable
- `GET /api/services[?q=term]` → list/search services (Redis with static fallback)
- `GET /api/services/[id]` → service by id (Redis with static fallback)
- `GET /api/search?q=term` → search (Redis with static fallback)
- `POST /api/book` → creates a booking (persists to Redis list)
