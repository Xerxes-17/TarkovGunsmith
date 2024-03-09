import { ArmorModule } from "../../../Types/ArmorTypes";
import { NewArmorTableRow } from "../../../Types/HelmetTypes";
import { ArmorPlateCollider, ArmorPlateZones, ArmorCollider, ArmorZones } from "../../ADC/ArmorData";

export function plateCollidersToStrings(colliders: ArmorPlateCollider[]) {
    return colliders.map((val) => `*${ArmorPlateZones[val]}`)
}
export function armorCollidersToStrings(colliders: ArmorCollider[]) {
    return colliders.map((val) => ArmorZones[val])
}

export function createHitZoneValues(row: ArmorModule) {
    const plates = plateCollidersToStrings(row.armorPlateColliders);
    const body = armorCollidersToStrings(row.armorColliders);
    return [...plates, ...body]
}

export function createHitZoneValues_ArmorTableRow(row: NewArmorTableRow) {
    const plates = plateCollidersToStrings(row.armorPlateColliders);
    const body = armorCollidersToStrings(row.armorColliders);
    return [...plates, ...body]
}




function enumToArray(enumObj: any): string[] {
    return Object.keys(enumObj).filter(key => isNaN(Number(enumObj[key])));
}

export function enumArmorPlateZonesToStrings() {
    const stringArray: string[] = enumToArray(ArmorPlateZones);

    return stringArray.map((val) => `*${ArmorPlateZones[parseInt(val)]}`)
}
export function enumArmorZonesToStrings() {
    const stringArray: string[] = enumToArray(ArmorZones);

    return stringArray.map((val) => `${ArmorZones[parseInt(val)]}`)
}

const makeArmorZoneOptions: string[] = enumArmorPlateZonesToStrings().concat(enumArmorZonesToStrings());

export const armorZoneOptions = 
[
    "*SAPI front",
    "*SAPI back",
    "*SAPI left high",
    "*SAPI left low",
    "*SAPI right high",
    "*SAPI right low",
    "*Korund chest",
    "*6B13 back",
    "*Korund left high",
    "*Korund left low",
    "*Korund right high",
    "*Korund right low",

    "Thorax",
    "Stomach",
    "Groin",

    "UpperBack",
    "LowerBack",
    "Buttocks",

    "LeftSide",
    "RightSide",
    "LeftShoulder",
    "RightShoulder",

    "Throat",
    "Neck",
    "HeadTop",
    "Nape",
    "Ears",
    "Eyes",
    "Face",
    "Jaws",
]

export function returnZonesFromTargetZone(targetZone: string){
    switch (targetZone) {
        case 'Head':
            return headArmorZones;
        case 'Thorax':
            return thoraxArmorZones;
        case 'Stomach':
            return stomachArmorZones;
        case 'Arm':
            return armArmorZones;
        default:
            throw new Error('Invalid Target Zone');
    }
}

export const headArmorZones = 
[
    "Throat",
    "Neck",
    "HeadTop",
    "Nape",
    "Ears",
    "Eyes",
    "Face",
    "Jaws",
]

export const thoraxArmorZones = 
[
    "*SAPI front",
    "*SAPI back",
    "*Korund chest",
    "*6B13 back",

    "Thorax",
    "UpperBack",
]
export const stomachArmorZones = 
[
    "*SAPI front",
    "*SAPI back",
    "*SAPI left high",
    "*SAPI left low",
    "*SAPI right high",
    "*SAPI right low",
    "*Korund chest",
    "*6B13 back",
    "*Korund left high",
    "*Korund left low",
    "*Korund right high",
    "*Korund right low",

    "Stomach",
    "Groin",
    "LowerBack",
    "Buttocks",
]

export const armArmorZones = 
[
    "LeftShoulder",
    "RightShoulder",
]

