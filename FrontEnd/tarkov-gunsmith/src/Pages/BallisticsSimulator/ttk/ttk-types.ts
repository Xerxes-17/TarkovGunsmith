import { TtkAmmoResult, TtkMatrixResult, TtkWeaponEntry } from "../api-requests";
import { mapAmmoCaliberFullNameToLabel } from "../../../Types/AmmoTypes";

export const DEFAULT_TTK_CONFIDENCE = 90;
export const DEFAULT_SEMI_AUTO_RPM_CAP = 300;
export const DEFAULT_TTK_DISTANCE = 15;

/** Sentinel for a pair that never reaches the requested confidence within the simulated hits. */
export const TTK_UNREACHABLE = Number.POSITIVE_INFINITY;

export interface TtkRow {
    id: string;

    weaponId: string;
    weaponName: string;
    weaponShortName: string;
    caliber: string;
    caliberLabel: string;

    ammoId: string;
    ammoName: string;
    ammoShortName: string;

    fireMode: string;
    effectiveRpm: number;

    /** Projectile impacts needed, so shotgun pellets count individually. */
    htk: number | null;
    /** Trigger pulls needed, which is htk divided by pellets per shell. */
    triggerPulls: number | null;
    projectileCount: number;

    ttkSeconds: number;

    firstShotPenChance: number;
    damage: number;
    penetration: number;
    armorDamagePerc: number;
}

/**
 * Hits needed for the cumulative chance of kill to exceed the given confidence.
 * Matches the AEC's strict greater-than comparison. Returns null if the curve never gets there.
 */
export function findHitsToKill(ammo: TtkAmmoResult, confidence: number): number | null {
    const firstConfidentHit = ammo.hitSummaries.find(
        (hit) => hit.cumulativeChanceOfKill > confidence
    );

    return firstConfidentHit ? firstConfidentHit.hitNum : null;
}

/** Modes where the weapon cycles itself, so its cyclic rate is what the shooter actually gets. */
const SUSTAINED_FIRE_MODES = ["Fullauto", "Burst"];

export function isFullAutoCapable(weapon: TtkWeaponEntry): boolean {
    return weapon.fireModes.some((mode) => SUSTAINED_FIRE_MODES.includes(mode));
}

/**
 * Semi auto only weapons are limited by how fast a person can click, which is below the
 * SingleFireRate the game data lists.
 *
 * bFirerate must never be used for a semi auto only weapon: most of them carry a placeholder of 30
 * or 40 rather than a real cyclic rate, which would produce absurd times.
 */
export function getEffectiveRpm(weapon: TtkWeaponEntry, semiAutoRpmCap: number): number {
    if (isFullAutoCapable(weapon)) {
        return weapon.bFirerate;
    }

    return Math.min(weapon.singleFireRate, semiAutoRpmCap);
}

export function describeFireMode(weapon: TtkWeaponEntry): string {
    if (!isFullAutoCapable(weapon)) {
        return "Semi auto";
    }

    return weapon.fireModes.includes("Fullauto") ? "Full auto" : "Burst";
}

/**
 * N shots have N-1 gaps between them and the first shot lands at t=0, so a one-shot kill takes no
 * time at all and a two-shot kill takes exactly one firing interval.
 */
export function calculateTtkSeconds(triggerPulls: number, effectiveRpm: number): number {
    return ((triggerPulls - 1) * 60) / effectiveRpm;
}

/**
 * Joins every weapon against every ammo of its caliber and ranks the pairs by time to kill.
 * The simulation itself never involves weapons, so this is a plain join rather than a re-simulation.
 */
export function buildTtkRows(
    matrix: TtkMatrixResult,
    confidence: number,
    semiAutoRpmCap: number
): TtkRow[] {
    const ammoByCaliber = new Map<string, TtkAmmoResult[]>();

    matrix.ammo.forEach((ammo) => {
        const existing = ammoByCaliber.get(ammo.caliber);
        if (existing) {
            existing.push(ammo);
        } else {
            ammoByCaliber.set(ammo.caliber, [ammo]);
        }
    });

    const rows: TtkRow[] = [];

    matrix.weapons.forEach((weapon) => {
        const compatibleAmmo = ammoByCaliber.get(weapon.caliber);
        if (!compatibleAmmo) {
            return;
        }

        const effectiveRpm = getEffectiveRpm(weapon, semiAutoRpmCap);
        const fireMode = describeFireMode(weapon);
        const caliberLabel = mapAmmoCaliberFullNameToLabel(weapon.caliber);

        compatibleAmmo.forEach((ammo) => {
            const htk = findHitsToKill(ammo, confidence);
            const triggerPulls = htk === null ? null : Math.ceil(htk / ammo.projectileCount);

            rows.push({
                id: `${weapon.weaponId}_${ammo.ammoId}`,

                weaponId: weapon.weaponId,
                weaponName: weapon.weaponName,
                weaponShortName: weapon.shortName,
                caliber: weapon.caliber,
                caliberLabel,

                ammoId: ammo.ammoId,
                ammoName: ammo.ammoName,
                ammoShortName: ammo.ammoShortName,

                fireMode,
                effectiveRpm,

                htk,
                triggerPulls,
                projectileCount: ammo.projectileCount,

                ttkSeconds:
                    triggerPulls === null
                        ? TTK_UNREACHABLE
                        : calculateTtkSeconds(triggerPulls, effectiveRpm),

                firstShotPenChance: ammo.firstShotPenChance,
                damage: ammo.damage,
                penetration: ammo.penetration,
                armorDamagePerc: ammo.armorDamagePerc,
            });
        });
    });

    return rows.sort((a, b) => a.ttkSeconds - b.ttkSeconds);
}

/** Collapses the rows down to each weapon's single best ammo choice. */
export function keepBestAmmoPerWeapon(rows: TtkRow[]): TtkRow[] {
    const bestByWeapon = new Map<string, TtkRow>();

    rows.forEach((row) => {
        const existing = bestByWeapon.get(row.weaponId);
        if (!existing || row.ttkSeconds < existing.ttkSeconds) {
            bestByWeapon.set(row.weaponId, row);
        }
    });

    return Array.from(bestByWeapon.values()).sort((a, b) => a.ttkSeconds - b.ttkSeconds);
}

export function formatTtk(ttkSeconds: number): string {
    if (!Number.isFinite(ttkSeconds)) {
        return "-";
    }

    return `${ttkSeconds.toFixed(3)} s`;
}
