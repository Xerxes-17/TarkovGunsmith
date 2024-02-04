import { ArmorType, MaterialType, ArmorPlateCollider, ArmorCollider, ArmorPlateZones, ArmorZones } from "../Components/ADC/ArmorData"
import { NewArmorTableRow } from "./HelmetTypes"

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

export function joinArmorCollidersAsZones(armorColliders: ArmorCollider[]) {
    const zones = armorColliders.map((enumVal) => {
        return ArmorZones[enumVal]
    })

    return zones.join(", ");
}

export function armorCollidersDisplay(armorColliders: ArmorZones[]) {
    return (
        <>
            {armorColliders.map((enumVal) => {
                return <>{ArmorZones[enumVal]}<br /></>
            })}
        </>
    )
}