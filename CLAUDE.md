# TarkovGunsmith

Escape from Tarkov ballistics/gunsmith tools. React + TS frontend, .NET 6 backend (WishGranter).
Live: tarkovgunsmith.com · API: api.tarkovgunsmith.com (dev: api.dev.tarkovgunsmith.com)

## Layout
- `FrontEnd/tarkov-gunsmith`: React + TS (Create React App today; Vite migration planned)
  - `src/app/`: app shell, nav, SEO
  - `src/pages/<feature>/`: one folder per page
  - `src/components|api|types|utils`: shared code
  - Naming: PascalCase components, `useX` hooks, camelCase modules, kebab-case folders
- `BackEnd/WishGranter`: .NET 6 minimal API. Routes are mapped in `Program.cs`, handlers live in `API_Methods/`
- `BackEnd/UnitTests_WishGranter`: backend tests
- `.github/workflows/oldAndToBeDeleted/`: retired workflows. Don't build on them

## Commands
- Frontend (in `FrontEnd/tarkov-gunsmith`): `npm install`, `npm start` (dev server), `npm run build`, `npm test`
- Backend (in `BackEnd/WishGranter`): `dotnet restore|build|run` against `WishGranter.sln`.
  Restore needs the private GitHub NuGet feed (`nuget.pkg.github.com/Xerxes-17`), so it fails without a token.

## Data sources
- Item data (ammo, weapons) comes from the static json.tarkov.dev dump (`src/api/tarkovDevJson.ts`),
  not the old tarkov.dev GraphQL API.
  - `name`/`shortName` are translation keys (`"<id> Name"`) that resolve via `items_en`, so always call `translate()`.
  - The dump may arrive as raw gzip, which the helper already handles.
- Simulations, calculators and data sheets come from WishGranter. The API URL is read from the
  committed `.env.development` / `.env.production`. The `WISHGRANTER_API_URL` env var set in the
  workflows is not read by the app.

## CI / deploy
- `FE-pipeline-dev` / `BE-pipeline-dev` run on pushes to `dev-*`, `feat-*` and `fix-*`, and on PRs into `main`.
  Other branch names get no CI.
- Frontend prod: `npm run build`, then `build/` is uploaded to S3 and CloudFront is invalidated. Elastic Beanstalk is backend only.
- Workflows pin Node 16 (frontend) and .NET 6 (backend).

## Gotchas
- The Modded Weapon Builder (`src/pages/modded-weapon-builder`) is due for a rework. Don't refactor it in unrelated tasks.
  Known broken: the "See in Ammo vs Armor" link in `AmmoInfoCard.tsx` points to a route that no longer exists.
- The README's "update `Util\util.tsx` to run locally" step is outdated. Set the API URL in `.env.development` instead.
