import { ArmorMaterialDestructibilitySelect } from "../Api/ArmorApiCalls"
import { ArmorType, MaterialType, ArmorPlateCollider, ArmorCollider, ArmorZones } from "../Components/ADC/ArmorData"

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

export const mockMaterials: ArmorMaterialDestructibilitySelect[] = [
    {
        value: "UHMWPE",
        label: "UHMWPE",
        destructibility: 0.3375,
        explosionDestructibility: 0.3
    },
    {
        value: "Aramid",
        label: "Aramid",
        destructibility: 0.1875,
        explosionDestructibility: 0.15
    },
    {
        value: "Combined",
        label: "Combined",
        destructibility: 0.375,
        explosionDestructibility: 0.2
    },
    {
        value: "Titan",
        label: "Titan",
        destructibility: 0.4125,
        explosionDestructibility: 0.375
    },
    {
        value: "Aluminum",
        label: "Aluminum",
        destructibility: 0.45,
        explosionDestructibility: 0.45
    },
    {
        value: "Steel",
        label: "Steel",
        destructibility: 0.525,
        explosionDestructibility: 0.45
    },
    {
        value: "Ceramic",
        label: "Ceramic",
        destructibility: 0.6,
        explosionDestructibility: 0.525
    },
    {
        value: "Glass",
        label: "Glass",
        destructibility: 0.6,
        explosionDestructibility: 0.6
    }
]