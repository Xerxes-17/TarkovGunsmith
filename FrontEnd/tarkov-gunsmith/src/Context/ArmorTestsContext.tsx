import { createContext, useContext} from "react";
import { StringLiteral } from "typescript";

export type TransmissionArmorTestResult = {
    testName: string;
    armorGridImage: string;
    ammoGridImage: string;
    armorDamagePerShot: number;
    shots: [],
    setShots: (s: TransmissionArmorTestShot) => void
}

export type TransmissionArmorTestShot = {
    durabilityPerc: number;
    durability: number;
    doneDamage: number;
    penetrationChance: number;
}

export const ArmorTestContext = createContext<TransmissionArmorTestResult>({
    testName: "",
    shots: [],
    armorGridImage: "",
    ammoGridImage: "",
    armorDamagePerShot: -1,
    setShots: () => {},
})

export const useArmorTestContext = () => useContext(ArmorTestContext);