import { ArmorModule } from "../../../Types/ArmorTypes";
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