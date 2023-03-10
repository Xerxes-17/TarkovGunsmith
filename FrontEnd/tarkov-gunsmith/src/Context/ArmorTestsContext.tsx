import { createContext, useContext} from "react";

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

export const ArmorTestContext = createContext<TransmissionArmorTestResult>({
    testName: "",
    shots: [],
    armorGridImage: "",
    ammoGridImage: "",
    armorDamagePerShot: -1,
    setShots: () => {},
    killShot: -1
})

export const useArmorTestContext = () => useContext(ArmorTestContext);