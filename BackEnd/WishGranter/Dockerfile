## Build Stage

# SDK is for building everything, but it is bigger!
FROM mcr.microsoft.com/dotnet/sdk:6.0-focal AS build
# sets the directory for our build
WORKDIR /source
# Copies everything in the C# project folder to the /source/ folder in the container
COPY . .
# Restores all of the NuGet packages for the project
RUN dotnet restore "./WishGranter.csproj"
# Publishes the application and its dependencies to a folder for deployment to a hosting system
RUN dotnet publish "WishGranter.csproj" -c Release -o /publish --no-restore

# Let's try generating the cert in the container and trusting it
#RUN dotnet dev-certs https -ep /publish/wishgranter-api.pfx -p GetOutOfHereSTALKER
#RUN dotnet dev-certs https -c --trust
# Nope, it isn't trusted by Windows, so it has to be externally provvided

## Serve Stage
# ASPnet is a lighter runtime suitable for deployments
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
# Sets the working directory to /app/ in the container
WORKDIR /app
# Copies all of the files in the build stage to the /app/ folder in the container
COPY --from=build /publish .

# Manually copies in the .pfx as the docker-compose mounting doesn't work for now
COPY wishgranter-api.pfx .

# Exposes the two ports, remember that this doesn't mean anything directly to the app however.
EXPOSE 80									
EXPOSE 443

# Sets the contaienr to run as an executable
ENTRYPOINT ["dotnet", "WishGranter.dll"]