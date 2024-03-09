import axios from "axios";
import { API_URL } from "../../Util/util";
import { MaterialType } from "../../Components/ADC/ArmorData";
import { TargetZone } from "./TargetUiAlternate";


export interface ArmorLayer{
    isPlate: boolean;
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

export interface BallisticSimParametersV2 {
    penetration: number;
    damage: number;
    armorDamagePerc: number;
    initialHitPoints: number;
    targetZone: TargetZone;
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

export interface LayerHitResultDetails{
    prBlock: number,
    damageBlock: number,
    damageMitigated: number,
    averageRemainingDurability: number
}

export interface BallisticSimHitSummary{
    hitNum: number,
    specificChanceOfKill: number,
    cumulativeChanceOfKill: number,
    averageRemainingHP: number,
    prPenetration: number,
    damagePenetration: number,
    layerHitResultDetails: LayerHitResultDetails[]
}

export interface BallisticSimResultV2 {
    Inputs: BallisticSimParametersV2,
    hitSummaries: BallisticSimHitSummary[]
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

export async function requestMultiShotBallisticSim(requestDetails: BallisticSimParametersV2) {
    let response = null;

    try {
        response = await axios.post(API_URL + `/GetMultiShotBallisticSimulation`, requestDetails);
    } catch (error) {
        throw error;
    }
    // // console.log(response.data);
    return response.data;
}