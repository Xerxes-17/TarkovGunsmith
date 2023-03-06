export interface effectivenessDataRow {
    ammoId: string
    ammoName: string

    armorId: string
    armorName: string
    armorType: string
    armorClass: number

    firstShot_PenChance: number
    firstShot_PenDamage: number
    firstShot_BluntDamage: number
    firstShot_ArmorDamage: number
    expectedShotsToKill: number
    expectedKillShotConfidence: number
}