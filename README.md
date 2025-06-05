# TarkovGunsmith

## Installation Instructions

1. After downloading, navigate to `FrontEnd\tarkov-gunsmith` and run: `npm install`
2. Once the installation is complete, update `Util\util.tsx` to run locally.
3. Navigate to `BackEnd`, start the backend with `dotnet restore WishGranter.csproj`, then `dotnet build WishGranter.csproj`, and finally `dotnet run --project WishGranter.csproj` 
4. Finally, start the application by running: `npm start`

This project has a C# backend using the [Ratstash][ratstash] library with item data from [Escape from Tarkov][escape-from-tarkov] and [tarkov-api][tarkov-api].

The front end is functional React with TypeScript.

Come check out [the website][tarkovgunsmith] or [the discord][discord]

[tarkovgunsmith]: http:tarkovgunsmith.com
[discord]: https://discord.gg/F7GZE4H7fq
[tarkov-api]: https://github.com/the-hideout/tarkov-api
[escape-from-tarkov]: https://www.escapefromtarkov.com/
[ratstash]: https://github.com/RatScanner/RatStash
