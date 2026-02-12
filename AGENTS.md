# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages and API route handlers (`app/api/*`).
- `components/`: UI modules for dashboard cards, desktop grid, and mobile stack.
- `lib/`: business logic and integrations (agent summarization, Brave, OpenSky, ingestion pipeline, PDF generation).
- `prisma/`: schema and DB model definitions (`prisma/schema.prisma`).
- `plan/PLAN.md`: product/implementation direction and scope notes.
- Config roots: `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `vercel.json`.

## Build, Test, and Development Commands
- `npm run dev`: run local development server (`http://localhost:3000`).
- `npm run build`: build production bundle.
- `npm run start`: serve built app.
- `npm run lint`: run ESLint via Next.js config.
- `npm run prisma:generate`: generate Prisma client after schema changes.
- `npm run prisma:migrate`: create/apply local dev migrations.
- `npm run db:push`: push schema directly to DB (useful for quick local setup).

## Coding Style & Naming Conventions
- Language: TypeScript (`.ts`/`.tsx`), 2-space indentation, semicolons, double quotes (match existing code).
- Components: PascalCase exports and kebab-case filenames (e.g., `map-card.tsx`).
- Library modules: kebab-case files grouped by domain under `lib/`.
- Prefer small, focused route handlers and move reusable logic into `lib/`.
- Run `npm run lint` before pushing changes.

## Testing Guidelines
- There is currently no formal test suite in this repo.
- Minimum quality gate: `npm run lint` plus manual smoke checks for touched routes/pages.
- For data-flow changes, validate: `/api/ingest`, `/api/cron/ingest`, and `/api/dashboard`.
- If you add tests, co-locate as `*.test.ts`/`*.test.tsx` near the feature and keep scope targeted.

## Commit & Pull Request Guidelines
- Follow the existing imperative style from history, e.g.:
  - `Fix stale snapshots by clearing NOTAM and aircraft tables each ingest`
  - `Fail closed on ingest auth misconfig and fix zero-altitude display`
- Keep commits focused; avoid mixing refactors with behavior changes.
- PRs should include: summary, risk/impact, env/config changes, and verification steps.
- Include screenshots/GIFs for UI changes (desktop + mobile views when relevant).

## Security & Configuration Tips
- Never commit real secrets; use `.env.example` as template.
- `CRON_SECRET` and `INGEST_SECRET` must be set in every deployed environment.
- Treat external source data as untrusted; preserve source URLs and fail closed on auth/config errors.

## Agent-Specific Instructions
- `web-design-guidelines`: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices". (file: `/Users/jeffreyshorthill/.codex/skills/web-design-guidelines/SKILL.md`)
- `react-grid-gsap-ui-enhancer`: Enhance React dashboard UIs that use react-grid-layout with GSAP animations, including responsive breakpoint behavior, drag/resize interaction polish, and motion performance/accessibility guardrails. Use when asked for React Grid + animation upgrades, GSAP integration, smoother drag/drop transitions, motion refactors, or UI micro-interaction improvements. (file: `/Users/jeffreyshorthill/.codex/skills/react-grid-gsap-ui-enhancer/SKILL.md`)
