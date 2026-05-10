# Contributing

Thanks for taking the time to contribute! This is a small starter template, so the contribution surface is intentionally narrow — bug fixes, dep bumps, and tightening the defaults are the most useful changes.

## Local setup

```bash
nvm use                  # picks up .nvmrc (Node 22)
npm install
npm run dev              # http://localhost:5173
```

## Workflow

1. Branch from `main`: `git checkout -b your-change`
2. Make the change. Keep diffs small and scoped.
3. Run the full check before pushing:
   ```bash
   npm run lint
   npm run check
   npm run build
   ```
4. Open a PR against `main`. CI will run lint + check.

## Conventions

- **Code style**: Prettier is the source of truth. Run `npm run format` if `npm run lint` flags formatting.
- **Svelte 5**: use runes (`$state`, `$derived`, `$effect`, `$props`) and snippets — no legacy stores or `<slot />` in new code.
- **TypeScript**: strict mode. Avoid `any` unless interop genuinely requires it.
- **Tailwind**: prefer utility classes over custom CSS. Reuse the theme tokens declared in `src/app.css` (`bg-primary`, `text-muted-foreground`, …) so shadcn-svelte components stay coherent.
- **Comments**: only when the _why_ is non-obvious. Don't restate what the code does.

## Adding a shadcn-svelte component

```bash
npx shadcn-svelte@latest add card dialog dropdown-menu
```

Components are installed into `src/lib/components/ui/` per `components.json`. Imports use the `@/` alias:

```ts
import { Button } from '@/lib/components/ui/button';
```

## Working with D1 + Drizzle

1. Edit `src/lib/server/db/schema.ts`.
2. `npm run db:generate` (writes SQL to `./drizzle`).
3. `npm run db:migrate:local` for dev, `npm run db:migrate:remote` for prod.
4. Commit both the schema change and the generated migration in the same PR.

## Lockfile / Node version

The lockfile is sensitive to the npm version that produced it. Cloudflare Pages currently builds on Node 22 / npm 10; this repo's `.nvmrc` matches.

If a CI build fails with `EBADPLATFORM` on a platform-specific binary (e.g. `@esbuild/aix-ppc64`), regenerate the lockfile with a matching npm:

```bash
nvm use
rm -rf node_modules package-lock.json
npm install
```

…or, if you can't switch Node locally: `npx -y npm@10 install`.

## Reporting issues

Please include:

- What you ran and what you expected
- The actual output (full error, not just the last line)
- Your Node and npm versions (`node -v`, `npm -v`)
- Your OS / arch

## License

By contributing you agree your contributions will be licensed under the MIT license that covers the project.
