import { ArmorType, MaterialType, ArmorPlateCollider, ArmorCollider, ArmorPlateZones, ArmorZones } from "../Components/ADC/ArmorData"

export interface ArmorModule {
    id: string
    category: string
    armorType: ArmorType
    name: string

    armorClass: number
    bluntThroughput: number
    maxDurability: number
    maxEffectiveDurability: number
    armorMaterial: MaterialType
    weight: number

    ricochetParams: RicochetParams

    usedInNames: string[]
    compatibleWith: string[]

    armorPlateColliders: ArmorPlateCollider[]
    armorColliders: ArmorCollider[]
}

export interface RicochetParams {
    x: number
    y: number
    z: number
}

export interface ArmorModuleTableRow {
    id: string
    category: string
    armorType: ArmorType
    name: string

    armorClass: number
    bluntThroughput: number
    maxDurability: number
    maxEffectiveDurability: number
    armorMaterial: string
    weight: number

    ricochetParams: RicochetParams

    usedInNames: string
    compatibleWith: string

    hitZones: string[]
}

export function plateCollidersToStrings(colliders: ArmorPlateCollider[]){
    return colliders.map((val) => ArmorPlateZones[val])
}
export function armorCollidersToStrings(colliders: ArmorCollider[]){
    return colliders.map((val) => ArmorZones[val])
}

export function createHitZoneValues(zones: ArmorCollider[]){
    return armorCollidersToStrings(zones);
}