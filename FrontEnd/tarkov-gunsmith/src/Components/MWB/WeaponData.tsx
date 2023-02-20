export type TransmissionWeaponBuildResult = {
    AttachedModsFLat: TransmissionAttachedMod[],
    BaseErgo: number,
    BaseRecoil: number,
    Convergence: number,
    Details: string,
    FinalErgo: number,
    FinalRecoil: number,
    Id: string,
    RateOfFire: number,
    RecoilDispersion: number,
    SelectedPatron: SelectedPatron,
    ShortName: string,
    PriceRUB: number,
    Valid: boolean
}

export type SelectedPatron = {
    ArmorDamagePerc: number,
    Damage: number,
    Id: string,
    Penetration: number,
    ShortName: string
}

export type TransmissionAttachedMod = {
    Ergo: number,
    Id: string,
    RecoilMod: number,
    ShortName: string,
    PriceRUB: number
}

// export interface WeaponOption {
//     ergonomics: number;
//     recoilForceUp: number;
//     recoilAngle: number;
//     recoilDispersion: number;
//     convergence: number;
//     ammoCaliber: string;
//     bFirerate: number;
//     traderLevel: number;
//     requiredPlayerLevel: number;
//     value: string;
//     readonly label: string;
//     readonly imageLink: string;
// }

// export function filterStockWeaponOptions(playerLevel: number) {
//     const result = StockWeaponOptions.filter(item =>
//         item.requiredPlayerLevel <= playerLevel
//     )
//     // Expand on this later.
//     return result;
// }

// export function sortStockWeaponOptions() {
//     StockWeaponOptions.sort((a, b) => {
//         if (a.Label < b.Label){
//             return -1;
//         }
//         else if (a.Label > b.Label){
//             return 1
//         }
//         else{
//             return 0;
//         }
//     })
// }

// export const StockWeaponOptions = fileJsonData;

// sortStockWeaponOptions();