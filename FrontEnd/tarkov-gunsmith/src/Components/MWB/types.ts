export enum OfferType {
    None,
    Sell,
    Cash,
    Barter,
    Flea
}

export type PurchasedModsEntry = {
    PurchaseOffer: any,
    WeaponMod: any
}

export enum fitPriority {
    MetaRecoil = "MetaRecoil",
    Recoil = "Recoil",
    MetaErgonomics = "MetaErgonomics",
    Ergonomics = "Ergonomics"
}

export enum MuzzleType {
    Loud = "Loud",
    Quiet = "Quiet",
    Any = "Any"
}

export interface RowSelection {
    [key: string]: boolean;
}

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

export interface WeaponOption {
    ergonomics: number;
    recoilForceUp: number;
    recoilAngle: number;
    recoilDispersion: number;
    convergence: number;
    ammoCaliber: string;
    bFirerate: number;
    traderLevel: number;
    requiredPlayerLevel: number;
    value: string;
    readonly label: string;
    readonly imageLink: string;
    offerType: number;
    priceRUB: number;
}

export interface BasePreset {
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

export interface CurveDataPoint {
    level: number,
    recoil: number,
    ergo: number,
    price: number,
    penetration: number,
    damage: number,
    invalid: Boolean
};