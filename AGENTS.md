# AGENTS.md

Guidelines for AI agents working in this repository.

## Project Overview

This is a **SvelteKit + Vite + TypeScript + Tailwind CSS v4 + shadcn-svelte** starter template that deploys to **Cloudflare Pages** via `@sveltejs/adapter-cloudflare`. Drizzle ORM is preinstalled and ready to wire to a D1 database. Production infra (Pages project, custom domain, D1/KV bindings, env vars, Access policies) is managed by Terraform in [`pjaudiomv/cloudflare-pages`](https://github.com/pjaudiomv/cloudflare-pages); pushes to `main` auto-deploy via the Pages GitHub integration set up there.

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5
- **Build Tool**: Vite 8
- **Runtime**: Cloudflare Pages (workerd, `nodejs_compat`)
- **Adapter**: `@sveltejs/adapter-cloudflare` (output: `.svelte-kit/cloudflare`)
- **Local preview**: `wrangler pages dev` (workerd)
- **Styling**: Tailwind CSS 4, shadcn-svelte, `tw-animate-css`, `@lucide/svelte` icons
- **DB**: Drizzle ORM (D1 / SQLite dialect) — schema empty, deps wired
- **Language**: TypeScript 5 (strict mode)
- **Linting**: ESLint 10 (flat config) + Prettier 3 + svelte-check

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Vite dev server (Node-based, fast HMR)
npm run build            # Build for Cloudflare Pages (.svelte-kit/cloudflare/)
npm run preview          # Build + `wrangler pages dev` (workerd parity)
npm run deploy           # Build + `wrangler pages deploy` (manual fallback; main auto-deploys)
npm run lint             # prettier --check + eslint
npm run check            # svelte-kit sync + svelte-check
npm run check:watch      # svelte-check in watch mode
npm run format           # Auto-format with Prettier
npm run cf-typegen       # Regenerate Cloudflare env types from wrangler.jsonc
npm run db:generate      # Drizzle: generate SQL migration in ./drizzle
npm run db:migrate:local # Apply migrations to local D1
npm run db:migrate:remote# Apply migrations to deployed D1
npm run db:studio        # Open Drizzle Studio
```

Always run `npm run lint && npm run check` before finishing a task. Fix all errors before considering work complete.

## Project Structure

```
src/
  lib/
    components/ui/       # shadcn-svelte components (Button seeded)
    server/db/           # Drizzle schema + db client factory
    utils.ts             # cn() helper for shadcn
  routes/
    +layout.svelte       # Imports app.css
    +page.svelte         # Demo page that calls /api/hello
    api/hello/+server.ts # Hello-world JSON API route
  app.html               # HTML shell
  app.css                # Tailwind v4 + theme tokens (light/dark)
  app.d.ts               # App.Platform typed with Cloudflare env (DB binding)
static/                  # Static assets served as-is
drizzle/                 # Generated SQL migrations (created on db:generate)
wrangler.jsonc           # Local-dev Cloudflare config (prod bindings live in Terraform)
svelte.config.js         # adapter-cloudflare with platformProxy
vite.config.ts           # tailwind() + sveltekit() plugins
drizzle.config.ts        # Drizzle Kit config (sqlite/D1)
components.json          # shadcn-svelte config
```

## Path Aliases

| Alias | Resolves to |
| ----- | ----------- |
| `@/`  | `src/`      |

Set in `svelte.config.js` (`kit.alias`). shadcn-svelte components import via `@/lib/...`.

## Code Conventions

- **Svelte 5 runes**: Use `$state`, `$derived`, `$effect`, `$props` — not legacy `writable`/`reactive` patterns.
- **Snippets**: Use `Snippet` type and `{@render children()}` instead of `<slot />`.
- **Styling**: Tailwind utility classes. Use the theme tokens defined in `src/app.css` (`bg-primary`, `text-muted-foreground`, etc.) for shadcn parity.
- **TypeScript**: Strict mode is on. Don't use `any` unless absolutely necessary.
- **Formatting**: Prettier — line width 200, single quotes, no trailing commas, 2-space tabs.
- **ESLint**: Flat config in `eslint.config.js`. `@typescript-eslint/no-explicit-any` and `no-undef` are disabled by project convention.
- **Component files**: `.svelte` only.

## Cloudflare specifics

- `npm run dev` uses Vite's Node-based dev server with adapter-cloudflare's `platformProxy`, which emulates Workers bindings via Miniflare. `event.platform.env` works in routes for D1/KV/R2/etc.
- `npm run preview` runs the built output through `wrangler pages dev` on `workerd` — same runtime as production.
- Bindings declared in `wrangler.jsonc` are typed by `App.Platform` in `src/app.d.ts`.
- `nodejs_compat` is enabled by default so packages relying on Node built-ins work where Workers supports them.
- **Production bindings (D1, KV, env vars, custom domains, Access) are owned by Terraform** in the `cloudflare-pages` repo, not this `wrangler.jsonc`. To add a new prod binding, edit `terraform/terraform.tfvars` there and `terraform apply`.
- After editing `wrangler.jsonc` bindings (local dev only), run `npm run cf-typegen` to refresh types.

## Adding shadcn components

```bash
npx shadcn-svelte@latest add card dialog dropdown-menu
```

Components install into `src/lib/components/ui/` per `components.json`.

## Wiring D1 + Drizzle

1. Add `d1_databases = ["DB"]` to this app's tfvars block in the `cloudflare-pages` repo and `terraform apply`. Terraform creates the D1 database (named after the project) and binds it as `DB` to both production and preview deployments.
2. Define tables in `src/lib/server/db/schema.ts`.
3. `npm run db:generate` to produce SQL migrations in `./drizzle`.
4. `npm run db:migrate:local` (sets up local Miniflare D1) and `npm run db:migrate:remote` (applies to prod D1) — script names must match the binding (`DB`).
5. In a `+server.ts`, use `createDb(platform.env.DB)` from `@/lib/server/db`.

## CI/CD

- **`.github/workflows/test.yml`**: Runs `npm run lint` + `npm run check` on pushes to non-main branches.
- **Deploys**: handled by Cloudflare Pages' GitHub integration (configured in Terraform). Pushes to `main` build and deploy automatically; PRs get preview deployments. There is no GH Actions deploy workflow.

Do not modify workflow files unless the task explicitly requires it.

## Reference Documentation

- **SvelteKit**: https://svelte.dev/llms.txt
- **shadcn-svelte**: https://shadcn-svelte.com/llms.txt
- **adapter-cloudflare**: https://svelte.dev/docs/kit/adapter-cloudflare
- **Wrangler**: https://developers.cloudflare.com/workers/wrangler/
- **Drizzle ORM (D1)**: https://orm.drizzle.team/docs/connect-cloudflare-d1

## Dependency Updates

Renovate is configured for automated dependency updates:

- **Major** updates: Mondays after 9am
- **Minor/patch** updates: Mondays after 8am (grouped)

Do not manually bump dependencies unless the task requires it.
