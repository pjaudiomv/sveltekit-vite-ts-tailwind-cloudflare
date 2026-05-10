# sveltekit-vite-ts-tailwind-cloudflare

A minimalist SvelteKit starter template for **Cloudflare Pages**, using `@sveltejs/adapter-cloudflare`. Production infra (Pages project, custom domain, D1/KV bindings, env vars, Access policies) is managed by Terraform in [`pjaudiomv/cloudflare-pages`](https://github.com/pjaudiomv/cloudflare-pages); pushes to `main` auto-deploy via the Pages GitHub integration set up there.

**Stack:** SvelteKit 2 · Svelte 5 · Vite 8 · TypeScript · Tailwind CSS v4 · shadcn-svelte · Drizzle ORM (D1-ready)

## Quick start

```bash
npm install
npm run dev          # http://localhost:5173 — Vite + miniflare-emulated bindings
npm run preview      # build + wrangler pages dev (real workerd runtime)
```

## What's included

- ✅ SvelteKit + `@sveltejs/adapter-cloudflare` (Pages output)
- ✅ Workers runtime parity locally via `wrangler pages dev` (`npm run preview`)
- ✅ Tailwind v4 via `@tailwindcss/vite`
- ✅ shadcn-svelte preconfigured (`components.json`, `cn()` helper, `Button` seeded)
- ✅ `@lucide/svelte` icons
- ✅ Drizzle ORM + drizzle-kit, D1 dialect, schema stub
- ✅ ESLint flat config + Prettier + svelte-check
- ✅ GitHub Actions: lint + check on PRs (deploys are Terraform-driven, not GH Actions)
- ✅ Renovate for grouped weekly dep updates
- ✅ Hello-world API at `/api/hello` (`src/routes/api/hello/+server.ts`)

## Deploy

Pushes to `main` auto-deploy through the Cloudflare Pages → GitHub integration that the [`cloudflare-pages`](https://github.com/pjaudiomv/cloudflare-pages) Terraform repo provisions. PRs get preview deployments automatically.

To configure or change production bindings (D1, KV, env vars, custom domain, Access), edit this app's block in `terraform/terraform.tfvars` over there and `terraform apply` — not this `wrangler.jsonc`.

Manual fallback: `npm run deploy` runs `wrangler pages deploy` if you need to push out of band.

## Add a shadcn component

```bash
npx shadcn-svelte@latest add card dialog dropdown-menu
```

## Wire up D1 + Drizzle

1. Add `d1_databases = ["DB"]` to this app's tfvars block in `cloudflare-pages` and `terraform apply`.
2. Define tables in `src/lib/server/db/schema.ts`.
3. `npm run db:generate` then `npm run db:migrate:local` (and `:migrate:remote` for prod).

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
