# AGENTS.md

Guidelines for AI agents working in this repository.

## Project Overview

This is a **SvelteKit + Vite + TypeScript + Tailwind CSS v4 + shadcn-svelte** starter template that deploys to **Cloudflare Workers** via `@sveltejs/adapter-cloudflare` and Wrangler. Drizzle ORM is preinstalled and ready to wire to a D1 database.

> Note: `@cloudflare/vite-plugin` does not officially support SvelteKit yet (TanStack Start and React Router v7 only). This template uses the proven `adapter-cloudflare` + `wrangler dev` pipeline; switch in the Vite plugin once SvelteKit is on its supported list.

## Tech Stack

- **Framework**: SvelteKit 2 + Svelte 5
- **Build Tool**: Vite 8
- **Runtime**: Cloudflare Workers (with `nodejs_compat`)
- **Adapter**: `@sveltejs/adapter-cloudflare`
- **Local preview**: `wrangler dev` (workerd)
- **Styling**: Tailwind CSS 4, shadcn-svelte, `tw-animate-css`, `@lucide/svelte` icons
- **DB**: Drizzle ORM (D1 / SQLite dialect) — schema empty, deps wired
- **Language**: TypeScript 5 (strict mode)
- **Linting**: ESLint 10 (flat config) + Prettier 3 + svelte-check

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Vite dev server (Node-based, fast HMR)
npm run build            # Build for Cloudflare (.svelte-kit/cloudflare/)
npm run preview          # Preview built output on workerd via `wrangler dev`
npm run deploy           # Build + wrangler deploy
npm run lint             # prettier --check + eslint + svelte-check
npm run format           # Auto-format with Prettier
npm run check            # svelte-kit sync + svelte-check
npm run cf-typegen       # Regenerate Cloudflare env types from wrangler.jsonc
npm run db:generate      # Drizzle: generate SQL migration in ./drizzle
npm run db:migrate:local # Apply migrations to local D1
npm run db:migrate:remote# Apply migrations to deployed D1
```

Always run `npm run lint` before finishing a task. Fix all lint errors before considering work complete.

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
wrangler.jsonc           # Cloudflare config — D1 binding commented in
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
- `npm run preview` runs the built output through `wrangler dev` on `workerd` — same runtime as production.
- Bindings declared in `wrangler.jsonc` are typed by `App.Platform` in `src/app.d.ts`.
- `nodejs_compat` is enabled by default so packages relying on Node built-ins work where Workers supports them.
- After editing `wrangler.jsonc` bindings, run `npm run cf-typegen` to refresh types.

## Adding shadcn components

```bash
npx shadcn-svelte@latest add card dialog dropdown-menu
```

Components install into `src/lib/components/ui/` per `components.json`.

## Wiring D1 + Drizzle

1. Create the database: `wrangler d1 create my-database`
2. Paste `database_id` into `wrangler.jsonc` (`d1_databases` block — uncomment).
3. Define tables in `src/lib/server/db/schema.ts`.
4. `npm run db:generate` then `npm run db:migrate:local` (and `:remote` for prod).
5. In a `+server.ts`, use `createDb(platform.env.DB)` from `@/lib/server/db`.

## CI/CD

GitHub Actions workflows:

- **`test.yml`**: Runs `npm run lint` + `npm run check` on pushes to non-main branches.
- **`deploy.yml`**: Builds and deploys to Cloudflare Workers via Wrangler on push to `main`. Requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` repo secrets.

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
