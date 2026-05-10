# AGENTS.md

Guidelines for AI agents working in this repository.

## Project Overview

A **SvelteKit + Vite + TypeScript + Tailwind CSS v4 + shadcn-svelte** starter template that deploys to **Cloudflare Pages** via `@sveltejs/adapter-cloudflare`. Drizzle ORM is preinstalled and ready to wire to a D1 database.

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
- **Node**: pinned to v22 via `.nvmrc` (matches Cloudflare's builder)

## Commands

```bash
npm install              # Install dependencies
npm run dev              # Vite dev server (Node-based, fast HMR)
npm run build            # Build for Cloudflare Pages (.svelte-kit/cloudflare/)
npm run preview          # Build + `wrangler pages dev` (workerd parity)
npm run deploy           # Build + `wrangler pages deploy`
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
  app.d.ts               # App.Platform typed with Cloudflare env
static/                  # Static assets served as-is
drizzle/                 # Generated SQL migrations (created on db:generate)
wrangler.jsonc           # Cloudflare config (compat flags, optional bindings)
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
- After editing `wrangler.jsonc` bindings, run `npm run cf-typegen` to refresh types.

## Adding shadcn components

```bash
npx shadcn-svelte@latest add card dialog dropdown-menu
```

Components install into `src/lib/components/ui/` per `components.json`.

## Wiring D1 + Drizzle

1. `wrangler d1 create my-database` — note the `database_id`.
2. Uncomment the `d1_databases` block in `wrangler.jsonc` and paste the id (binding stays `DB`).
3. Define tables in `src/lib/server/db/schema.ts`.
4. `npm run db:generate` to produce SQL migrations in `./drizzle`.
5. `npm run db:migrate:local` (Miniflare D1) and `npm run db:migrate:remote` (deployed D1).
6. In a `+server.ts`, use `createDb(platform.env.DB)` from `@/lib/server/db`.

## CI/CD

- **`.github/workflows/test.yml`**: Runs `npm run lint` + `npm run check` on pushes to non-main branches.
- **Deploys**: not wired by default. Either connect the repo to Cloudflare Pages in the dashboard (recommended — preview URLs per PR), or add a workflow that runs `wrangler pages deploy` on push to `main`.

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

## Lockfile / Node version

The lockfile must be generated with the npm version that matches Cloudflare's builder (currently npm 10 / Node 22). If a CI build fails with `EBADPLATFORM` on `@esbuild/<platform>`, the lockfile was generated by a different npm version and needs regenerating:

```bash
nvm use                                  # picks up .nvmrc (Node 22)
rm -rf node_modules package-lock.json
npm install
```

If you don't have Node 22 locally, fall back to: `npx -y npm@10 install`.
