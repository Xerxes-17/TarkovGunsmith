import axios from "axios";
import { API_URL } from "../../Util/util";
import { MaterialType } from "../../Components/ADC/ArmorData";


export interface ArmorLayer{
    armorClass: number;
    bluntDamageThroughput: number;
    durability: number;
    maxDurability: number;
    armorMaterial: MaterialType;
}

export interface BallisticSimParameters {
    penetration: number;
    damage: number;
    armorDamagePerc: number;
    hitPoints: number;
    armorLayers: ArmorLayer[];
}

export interface BallisticSimResponse {
    PenetrationChance: number;
    PenetrationDamage: number;
    MitigatedDamage: number;
    BluntDamage: number;
    AverageDamage: number;
    PenetrationArmorDamage: number;
    BlockArmorDamage: number;
    AverageArmorDamage: number;
    PostHitArmorDurability: number;
    ReductionFactor: number;
    PostArmorPenetration: number;
}

export async function requestSingleShotBallisticSim(requestDetails: BallisticSimParameters) {
    let response = null;

    try {
        response = await axios.post(API_URL + `/GetSingleShotBallisticSimulation`, requestDetails);
    } catch (error) {
        throw error;
    }
    // // console.log(response.data);
    return response.data;
}