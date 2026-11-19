# TarkovGunsmith

Escape from Tarkov ballistics/gunsmith tools. React + TS frontend, .NET 6 backend (WishGranter).
Live: tarkovgunsmith.com · API: api.tarkovgunsmith.com (dev: api.dev.tarkovgunsmith.com)

## Layout
- `FrontEnd/tarkov-gunsmith`: React + TS, built with Vite (`vite.config.ts`, `index.html` at the package root, static files in `public/`)
  - `src/app/`: app shell, nav, SEO
  - `src/pages/<feature>/`: one folder per page
  - `src/components|api|types|utils`: shared code
  - Naming: PascalCase components, `useX` hooks, camelCase modules, kebab-case folders
- `BackEnd/WishGranter`: .NET 6 minimal API. Routes are mapped in `Program.cs`, handlers live in `API_Methods/`
- `BackEnd/UnitTests_WishGranter`: backend tests
- `.github/workflows/oldAndToBeDeleted/`: retired workflows. Don't build on them

## Commands
- Frontend (in `FrontEnd/tarkov-gunsmith`): `npm install`, `npm start` (Vite dev server on :3000), `npm run build` (`tsc --noEmit` then `vite build` → `build/`), `npm run build:development`, `npm run preview`. There are no frontend tests yet
- Backend (in `BackEnd/WishGranter`): `dotnet restore|build|run` against `WishGranter.sln`.
  Restore needs the private GitHub NuGet feed (`nuget.pkg.github.com/Xerxes-17`), so it fails without a token.

## Data sources
- Item data (ammo, weapons) comes from the static json.tarkov.dev dump (`src/api/tarkovDevJson.ts`),
  not the old tarkov.dev GraphQL API.
  - `name`/`shortName` are translation keys (`"<id> Name"`) that resolve via `items_en`, so always call `translate()`.
  - The dump may arrive as raw gzip, which the helper already handles.
- Simulations, calculators and data sheets come from WishGranter. The API URL is read from the
  committed `.env.development` / `.env.production` as `VITE_WISHGRANTER_API_URL` (read via `import.meta.env`). The `WISHGRANTER_API_URL` env var set in the
  workflows is not read by the app.

## CI / deploy
- `FE-pipeline-dev` / `BE-pipeline-dev` run on pushes to `dev-*`, `feat-*` and `fix-*`, and on PRs into `main`.
  Other branch names get no CI.
- Frontend prod: `npm run build`, then `build/` is uploaded to S3 and CloudFront is invalidated. Elastic Beanstalk is backend only.
- Workflows pin Node 22 (frontend; Vite needs 20.19+ or 22.12+) and .NET 6 (backend).

## Gotchas
- The Modded Weapon Builder (`src/pages/modded-weapon-builder`) is due for a rework. Don't refactor it in unrelated tasks.
  Known broken: the "See in Ammo vs Armor" link in `AmmoInfoCard.tsx` points to a route that no longer exists.
- Public assets are referenced as `'/x.png'`. Don't prefix `import.meta.env.BASE_URL` (it's `"/"`, giving a protocol-relative `//x.png`).
- To point the dev server at a local backend, use a gitignored `.env.development.local` (see README). Don't edit the committed `.env.development`.
