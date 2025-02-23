export interface BallisticRating {
    AC: number,
    FirstHitPenChance: number,
    FirstHitPenetrationDamage: number,
    HeadHTK_avg: number,
    LegHTK_avg: number,
    ThoraxHTK_avg: number
}
export interface BallisticDetails {
    Distance: number,
    Penetration: number,
    Damage: number,
    Speed: number,
    Ratings: BallisticRating[]
}
export enum OfferType {
    None,
    Sell,
    Cash,
    Barter,
    Flea
}

export interface PurchaseOffer {
    PriceRUB: number
    Price: number
    Currency: string
    Vendor: string
    MinVendorLevel: number
    ReqPlayerLevel: number
    OfferType: OfferType
}
export interface AEC_Row {
    Ammo: any
    Details: BallisticDetails[]
    PurchaseOffer: PurchaseOffer
}
export interface AEC {
    GenerationTimeStamp: number;
    Rows: AEC_Row[]
}

export enum TargetZoneDisplayAEC{
    Classic = "Combo",
    Thorax = "Thorax",
    Head = "Head",
    Legs = "Legs"
}