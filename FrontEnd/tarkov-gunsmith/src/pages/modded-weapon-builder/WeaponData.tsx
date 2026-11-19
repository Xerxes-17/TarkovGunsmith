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
    Valid: boolean,

    PresetPrice: number,
    SellBackValue: number,
    PurchasedModsCost: number,
    FinalCost: number
}

interface BasePreset {
    Name: string;
    Id: string;
    WeaponId: string;
    Ergonomics: number;
    Recoil_Vertical: number;
    Weight: number;
    Weapon?: any;
    PurchaseOffer?: any;
    WeaponMods: any[];
  }

  export type Fitting = {
    Id: number;
    BasePresetId: string;
    BasePreset?: BasePreset;
    Ergonomics: number;
    Recoil_Vertical: number;
    Weight: number;
    TotalRubleCost: number;
    PurchasedModsCost: number;
    PresetModsRefund: number;
    IsValid: boolean;
    ValidityString: string;
    PurchasedModsHashId: string;
    PurchasedMods?: any;
    PurchasedAmmo?: any;
  }

export type SelectedPatron = {
    ArmorDamagePerc: number,
    Damage: number,
    FragChance: number,
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