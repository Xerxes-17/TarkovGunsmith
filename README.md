# TarkovGunsmith

## Running locally

### Prerequisites
- [Node.js](https://nodejs.org/) 22 LTS (Vite needs 20.19+ or 22.12+)
- [.NET 6 SDK](https://dotnet.microsoft.com/download/dotnet/6.0)
- Access to the private GitHub Packages NuGet feed (`https://nuget.pkg.github.com/Xerxes-17/index.json`), which hosts `Xerxes17.EFT.PBE`. Add it as a package source with a GitHub token that has `read:packages`:
  ```
  dotnet nuget add source https://nuget.pkg.github.com/Xerxes-17/index.json --name GitHub --username <github-user> --password <token>
  ```

### Backend (WishGranter)
From `BackEnd/WishGranter`:
```
dotnet restore WishGranter.sln
dotnet run --project WishGranter.csproj
```
It listens on `http://localhost:5000` (check the "Now listening on" line).

### Frontend
From `FrontEnd/tarkov-gunsmith`:
1. Run `npm install`.
2. To use your local backend, create `.env.development.local` (gitignored) containing:
   ```
   VITE_WISHGRANTER_API_URL=http://localhost:5000
   ```
   Without it, the dev server uses the deployed dev API from `.env.development`. On Windows PowerShell 5, create the file with `Set-Content .env.development.local 'VITE_WISHGRANTER_API_URL=http://localhost:5000'`. `echo ... >` writes UTF-16, which Vite can't read.
3. Run `npm start` and open http://localhost:3000. Restart it after changing any `.env*` file.

To check the production build, run `npm run build` then `npm run preview` (http://localhost:4173). This uses the live API from `.env.production`.

This project has a C# backend using the [Ratstash][ratstash] library with item data from [Escape from Tarkov][escape-from-tarkov] and [tarkov-api][tarkov-api].

The front end is functional React with TypeScript.

Come check out [the website][tarkovgunsmith] or [the discord][discord]

[tarkovgunsmith]: http:tarkovgunsmith.com
[discord]: https://discord.gg/F7GZE4H7fq
[tarkov-api]: https://github.com/the-hideout/tarkov-api
[escape-from-tarkov]: https://www.escapefromtarkov.com/
[ratstash]: https://github.com/RatScanner/RatStash
