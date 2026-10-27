using static WishGranter.Statics.BallisticComputah;
using System.Diagnostics;
using WishGranter.API_Methods;

namespace WishGranter.Endpoints
{
    public static class Endpoints
    {
        public static IEndpointRouteBuilder MapBallisticsEndpoints(
        this IEndpointRouteBuilder endpoints,
        ActivitySource activitySource)
        {
            endpoints.MapPost(
                "/GetBallisticCalculation",
                (BallisticComputahInput request) =>
                    GetBallisticCalculation(request, activitySource)
            );

            return endpoints;
        }

        private static IResult GetBallisticCalculation(
            BallisticComputahInput requestData,
            ActivitySource activitySource)
        {
            var result = API_BallisticSimulator.BallisticCalculation(
                activitySource,
                requestData
            );

            return Results.Ok(result);
        }


        public static IEndpointRouteBuilder MapWeaponsEndpoints(
        this IEndpointRouteBuilder endpoints,
        ActivitySource activitySource)
        {
            endpoints.MapGet(
                "/GetWeaponOptionsList",
                () => GetWeaponOptionsList(activitySource)
            );

            return endpoints;
        }

        private static IResult GetWeaponOptionsList(ActivitySource activitySource)
        {
            var result = API_Basics.GetWeaponOptionsList(activitySource);
            return Results.Ok(result);
        }

        public static IEndpointRouteBuilder MapGunsmithEndpoints(
        this IEndpointRouteBuilder endpoints,
        ActivitySource activitySource)
        {
            endpoints.MapPost(
                "/getSingleWeaponBuild",
                (WeaponBuildRequest request) =>
                    GetSingleWeaponBuild(request, activitySource)
            );

            return endpoints;
        }

        private static IResult GetSingleWeaponBuild(
            WeaponBuildRequest request,
            ActivitySource activitySource)
        {
            var result = API_Gunsmith.GetSingleWeaponBuild(
                activitySource,
                request.PresetId,
                request.Priority,
                request.MuzzleMode,
                request.PlayerLevel,
                request.Flea,
                request.ExcludedIds
            );

            return Results.Ok(result);
        }

    }
}
