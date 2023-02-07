import fileJsonData from './MyStockPresets.json';

export type WeaponOption = typeof fileJsonData;

export type TransmissionWeaponBuildResult = {
    attachedModsFLat: TransmissionAttachedMod[],
    baseErgo: number,
    baseRecoil: number,
    convergence: number,
    details: string,
    finalErgo: number,
    finalRecoil: number,
    id: string,
    rateOfFire: number,
    recoilDispersion: number,
    selectedPatron: SelectedPatron,
    shortName: string,
    priceRUB: number
}

export type SelectedPatron = {
    armorDamagePerc: number,
    damage: number,
    id: string,
    penetration: number,
    shortName: string
}

export type TransmissionAttachedMod = {
    ergo: number,
    id: string,
    recoilMod: number,
    shortName: string,
    priceRUB: number
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

export function filterStockWeaponOptions(playerLevel: number) {
    const result = StockWeaponOptions.filter(item =>
        item.requiredPlayerLevel <= playerLevel
    )
    // Expand on this later.
    return result;
}

export function sortStockWeaponOptions() {
    StockWeaponOptions.sort((a, b) => {
        if (a.Label < b.Label){
            return -1;
        }
        else if (a.Label > b.Label){
            return 1
        }
        else{
            return 0;
        }
    })
}

export const StockWeaponOptions = fileJsonData;

sortStockWeaponOptions();