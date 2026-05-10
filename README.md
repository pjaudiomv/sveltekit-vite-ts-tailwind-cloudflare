# sveltekit-vite-ts-tailwind-cloudflare

A minimalist SvelteKit starter template for **Cloudflare Pages**, with everything you'd want from a fresh project pre-wired and nothing you wouldn't.

**Stack:** SvelteKit 2 · Svelte 5 · Vite 8 · TypeScript · Tailwind CSS v4 · shadcn-svelte · Drizzle ORM (D1-ready) · `@sveltejs/adapter-cloudflare`

## Use as a template

Click **Use this template** on GitHub, or:

```bash
npx degit pjaudiomv/sveltekit-vite-ts-tailwind-cloudflare my-app
cd my-app
npm install
npm run dev
```

## Quick start

```bash
npm install
npm run dev          # Vite dev server, http://localhost:5173
npm run preview      # build + wrangler pages dev (real workerd runtime)
npm run deploy       # build + wrangler pages deploy
```

## What's included

- ✅ SvelteKit 2 + Svelte 5 (runes + snippets)
- ✅ `@sveltejs/adapter-cloudflare` → Pages output at `.svelte-kit/cloudflare`
- ✅ Workers runtime parity locally via `wrangler pages dev`
- ✅ Tailwind CSS v4 via `@tailwindcss/vite`
- ✅ shadcn-svelte preconfigured (`components.json`, `cn()` helper, `Button` seeded)
- ✅ `@lucide/svelte` icons
- ✅ Drizzle ORM + drizzle-kit, D1 (SQLite) dialect, schema stub
- ✅ ESLint flat config + Prettier + svelte-check
- ✅ GitHub Actions: lint + check on PRs
- ✅ Renovate for grouped weekly dependency updates
- ✅ Hello-world API at `/api/hello` (`src/routes/api/hello/+server.ts`)
- ✅ `.nvmrc` pinned to Node 22 to match Cloudflare's builder

## Deploy to Cloudflare Pages

Two options:

**A) Connect the repo in the Cloudflare dashboard** (zero-config; preview URLs per PR)

- Build command: `npm run build`
- Build output directory: `.svelte-kit/cloudflare`
- Set compatibility flag `nodejs_compat`
- Push to `main` to deploy

**B) Manual / CI deploy with Wrangler**

```bash
wrangler login
npm run deploy        # vite build && wrangler pages deploy
```

For GitHub Actions, you'd add `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets and a workflow that runs `wrangler pages deploy` on push to `main`. (None included by default — pick whichever flow suits your team.)

## Add a shadcn-svelte component

```bash
npx shadcn-svelte@latest add card dialog dropdown-menu
```

Components install into `src/lib/components/ui/` per `components.json`.

## Wire up D1 + Drizzle

```bash
wrangler d1 create my-database          # copy database_id into wrangler.jsonc
# uncomment the d1_databases block in wrangler.jsonc
```

Then:

```bash
# edit src/lib/server/db/schema.ts to add tables
npm run db:generate                     # produces SQL in ./drizzle
npm run db:migrate:local                # apply to local Miniflare D1
npm run db:migrate:remote               # apply to deployed D1
```

In a server route:

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

## Project layout

```
src/
  lib/
    components/ui/       # shadcn-svelte components
    server/db/           # Drizzle schema + db client
    utils.ts             # cn() helper
  routes/
    +layout.svelte       # imports app.css
    +page.svelte         # demo page
    api/hello/+server.ts # JSON API route
  app.html
  app.css                # Tailwind + theme tokens (light/dark)
  app.d.ts               # App.Platform typed with Cloudflare env
static/                  # served as-is
wrangler.jsonc           # Cloudflare config
svelte.config.js
vite.config.ts
drizzle.config.ts
components.json
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## License

MIT
