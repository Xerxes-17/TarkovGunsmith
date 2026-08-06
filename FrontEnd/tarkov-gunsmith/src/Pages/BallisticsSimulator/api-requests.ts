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

export interface TtkMatrixParameters {
    initialHitPoints: number;
    targetZone: TargetZone;
    armorLayers: ArmorLayer[];
    distance: number;
    maxHits: number;
}

export interface SimpleHitSummary {
    hitNum: number;
    specificChanceOfKill: number;
    cumulativeChanceOfKill: number;
}

export interface TtkAmmoResult {
    ammoId: string;
    ammoName: string;
    ammoShortName: string;
    caliber: string;

    /** Penetration and damage after range falloff has been applied. */
    penetration: number;
    damage: number;

    originalPenetration: number;
    originalDamage: number;

    armorDamagePerc: number;
    projectileCount: number;

    /** Chance the first shot penetrates every armor layer, as a 0-1 fraction. */
    firstShotPenChance: number;

    hitSummaries: SimpleHitSummary[];
}

export interface TtkWeaponEntry {
    weaponId: string;
    weaponName: string;
    shortName: string;
    caliber: string;

    bFirerate: number;
    singleFireRate: number;
    /** RatStash FireMode names, eg. "Single", "Fullauto", "Burst". */
    fireModes: string[];
}

/**
 * Ammo and weapons come back as separate lists rather than the joined cross product, because the
 * simulation only depends on the ammo and the armor. The client joins them on caliber.
 */
export interface TtkMatrixResult {
    inputs: TtkMatrixParameters;
    ammo: TtkAmmoResult[];
    weapons: TtkWeaponEntry[];
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

export async function requestTtkMatrix(requestDetails: TtkMatrixParameters): Promise<TtkMatrixResult> {
    let response = null;

    try {
        response = await axios.post(API_URL + `/GetTtkMatrix`, requestDetails);
    } catch (error) {
        throw error;
    }
    return response.data;
}