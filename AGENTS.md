# Repository Guidelines

## Project Structure & Module Organization

This repository contains the planning documentation and the React dashboard for WankaEcoLogística Huancayo. `README.md` is the project overview and documentation index. Detailed artifacts live under `docs/`, grouped by project phase:

- `docs/01 Inicio/`: charter, requirements, users, business rules, database design, technology stack, and C4 architecture.
- `docs/02 Planificación/`: agile planning, Jira artifacts, risks, budget, and supporting PNG evidence.
- `frontend/`: Vite/React application based on the MUI dashboard template; application code lives in `frontend/src/`.
- `backend/`: Express API organized as routes, services, and PostgreSQL repositories; migrations and tests live in `backend/migrations/` and `backend/test/`.

Keep new documents in the appropriate numbered phase directory. Follow the existing versioned filename pattern, for example `05 Nuevo artefacto V_1_0_0.md`. Follow `CODE_QUALITY.md` for implementation standards.

## Build, Test, and Development Commands

Run commands from either `frontend/` or `backend/`:

```powershell
npm install       # Install dependencies
npm run dev       # Start the Vite development server
npm run build     # Create and verify the production bundle
npm run lint      # Run static analysis
npm run format:check
```

The backend additionally provides `npm test`, `npm run db:migrate`, and `npm run db:seed`. Before submitting documentation changes, run:

```powershell
git status --short
git diff --check
rg "TODO|TBD" README.md docs
```

These commands confirm the file set, detect whitespace errors, and expose placeholders. Preview Markdown tables and relative links before submitting.

## Coding Style & Naming Conventions

Write documentation in Spanish, matching the repository’s existing terminology and professional tone. Save files as UTF-8 so accents and symbols such as `CO₂` render correctly. Use ATX headings (`#`, `##`), fenced code blocks with language tags, concise paragraphs, and pipe tables with a separator row. Preserve requirement identifiers such as `RF-001`, `RNF-005`, and `OBJ-01`. Use relative links and wrap paths containing spaces in angle brackets.

## Testing Guidelines

Backend tests use Node's test runner in `backend/test/`. Cover successful, invalid, boundary, authorization, and conflict behavior. PostGIS tests require `TEST_DATABASE_URL`; others use injected repositories. Maintain at least 80% line coverage.

## Commit & Pull Request Guidelines

Recent history generally follows Conventional Commits in Spanish, such as `docs(presupuesto): optimizar costos del MVP`. Use `type(scope): resumen` with an imperative, concise subject; prefer `docs` for artifact-only changes. Pull requests should summarize the change, list affected documents and requirement IDs, link the relevant issue or Jira item, and include screenshots when tables, diagrams, or rendered layout change. Keep unrelated updates in separate commits.
