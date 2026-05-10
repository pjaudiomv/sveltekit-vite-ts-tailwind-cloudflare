# sveltekit-vite-ts-tailwind-cloudflare

A minimalist SvelteKit starter template for **Cloudflare Workers**, using `@sveltejs/adapter-cloudflare` and Wrangler.

> Note: when `@cloudflare/vite-plugin` adds official SvelteKit support, swap it in to run dev directly on workerd. Today the plugin only supports TanStack Start and React Router v7, so this template uses the proven adapter + `wrangler dev` flow.

**Stack:** SvelteKit 2 · Svelte 5 · Vite 8 · TypeScript · Tailwind CSS v4 · shadcn-svelte · Drizzle ORM (D1-ready)

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 — Vite + miniflare-emulated bindings
npm run preview      # build + wrangler dev (real workerd runtime)
```

## What's included

- ✅ SvelteKit + `@sveltejs/adapter-cloudflare`
- ✅ Workers runtime parity via `wrangler dev` (`npm run preview`)
- ✅ Tailwind v4 via `@tailwindcss/vite`
- ✅ shadcn-svelte preconfigured (`components.json`, `cn()` helper, `Button` seeded)
- ✅ `@lucide/svelte` icons
- ✅ Drizzle ORM + drizzle-kit, D1 dialect, schema stub
- ✅ ESLint flat config + Prettier + svelte-check
- ✅ GitHub Actions: lint on PRs, deploy on `main`
- ✅ Renovate for grouped weekly dep updates
- ✅ Hello-world API at `/api/hello` (`src/routes/api/hello/+server.ts`)

## Deploy

1. `wrangler login`
2. Set repo secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.
3. Push to `main`, or run `npm run deploy` locally.

## Add a shadcn component

```bash
npx shadcn-svelte@latest add card dialog dropdown-menu
```

## Wire up D1 + Drizzle

```bash
wrangler d1 create my-database          # copy database_id into wrangler.jsonc
# edit src/lib/server/db/schema.ts
npm run db:generate
npm run db:migrate:local                # for `npm run dev`
npm run db:migrate:remote               # for production
```

Then in a server route:

```ts
import { json } from '@sveltejs/kit';
import { createDb } from '@/lib/server/db';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
  const db = createDb(platform!.env.DB!);
  // const rows = await db.select().from(users);
  return json({ ok: true });
};
```

## License

MIT
