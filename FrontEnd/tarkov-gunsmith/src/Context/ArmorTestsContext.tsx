import { createContext, useContext } from "react";

export type TransmissionArmorTestResult = {
    testName: string;
    armorGridImage: string;
    ammoGridImage: string;
    armorDamagePerShot: number;
    shots: [],
    setShots: (s: TransmissionArmorTestShot) => void,
    killShot: number
}

export type TransmissionArmorTestShot = {
    durabilityPerc: number;
    durability: number;
    doneDamage: number;
    penetrationChance: number;
    bluntDamage: number;
    penetratingDamage: number;
    averageDamage: number;
    remainingHitPoints: number;

    probabilityOfKillCumulative: number;
    probabilityOfKillSpecific: number;
}

export type BallisticDetails = {
    id: number;
    ammoId: string;
    distance: number;
    penetration: number;
    damage: number;
    speed: number;
    ratings: any;
}

export type BallisticHit = {
    testId: number;
    hitNum: number;
    durabilityBeforeHit: number;
    durabilityDamageTotalAfterHit: number;
    penetrationChance: number;
    bluntDamage: number;
    penetrationDamage: number;
    averageRemainingHitPoints: number;
    cumulativeChanceOfKill: number;
    specificChanceOfKill: number;
}

export type BallisticTest = {
    id: number;
    armorId: string;
    detailsId: string;
    details: BallisticDetails;
    startingDurabilityPerc: number;
    probableKillShot: number;
    hits: BallisticHit[];
}

export type NewArmorTestResult = {
    testName: string;
    ballisticTest: BallisticTest;
}

// Create an empty instance of NewArmorTestResult
const emptyArmorTestResult: NewArmorTestResult = {
    testName: "",
    ballisticTest: {
        id: 0,
        armorId: "",
        detailsId: "",
        details: {
            id: 0,
            ammoId: "",
            distance: 0,
            penetration: 0,
            damage: 0,
            speed: 0,
            ratings: {}
        },
        startingDurabilityPerc: 0,
        probableKillShot: 0,
        hits: []
    }
};

export enum TargetZone {
    Thorax,
    Head,
}

export type SimulationParameters = {
    armorClass: number,
    armorDamagePerc: number,
    armorMaterial: number,
    bluntThroughput: number,
    damage: number,
    maxDurability: number,
    penetration: number,
    startingDurabilityPerc: number,
    targetZone: TargetZone
}

export type NewCustomTestResult = {
    hits: BallisticHit[],
    probableKillShot: number,
    simulationParameters: SimulationParameters
}

//todo actually use these somewhere?
export const ArmorTestContext = createContext<NewArmorTestResult>(emptyArmorTestResult)

export const useArmorTestContext = () => useContext(ArmorTestContext);