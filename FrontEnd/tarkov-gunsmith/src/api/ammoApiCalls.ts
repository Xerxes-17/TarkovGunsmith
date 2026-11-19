import axios, { AxiosResponse } from "axios";
import { API_URL } from "../utils/util";
import { AmmoTableRow, DevTarkovAmmoItem } from "../types/ammoTypes";
import { getTarkovDevItemsOfType, TarkovDevRawItem } from "./tarkovDevJson";

type AmmoProperties = NonNullable<DevTarkovAmmoItem["properties"]>;

/** Keeps only the fields the rest of the app expects, matching the old GraphQL query. */
function toDevTarkovAmmoItem(item: TarkovDevRawItem, translate: (key: string) => string): DevTarkovAmmoItem {
    const p = (item.properties ?? {}) as Partial<AmmoProperties>;
    return {
        id: item.id,
        name: translate(item.name),
        shortName: translate(item.shortName),
        properties: {
            penetrationPowerDeviation: p.penetrationPowerDeviation ?? 0,
            penetrationPower: p.penetrationPower ?? 0,
            damage: p.damage ?? 0,
            caliber: p.caliber ?? "",
            armorDamage: p.armorDamage ?? 0,
            projectileCount: p.projectileCount ?? 1,
            recoilModifier: p.recoilModifier ?? 0,
            heavyBleedModifier: p.heavyBleedModifier ?? 0,
            lightBleedModifier: p.lightBleedModifier ?? 0,
            accuracyModifier: p.accuracyModifier ?? 0,
            initialSpeed: p.initialSpeed ?? 0,
            fragmentationChance: p.fragmentationChance ?? 0,
            tracer: p.tracer ?? false,
            bulletMassGrams: p.bulletMassGrams ?? 0,
            bulletDiameterMilimeters: p.bulletDiameterMilimeters ?? 0,
            ballisticCoeficient: p.ballisticCoeficient ?? 0,
        },
    };
}

export async function fetchDataFromApi_TarkovDev(): Promise<DevTarkovAmmoItem[] | null> {
    const result = await getTarkovDevItemsOfType("ammo", "ItemPropertiesAmmo");
    if (result === null) return null;
    return result.items.map(item => toDevTarkovAmmoItem(item, result.translate));
}

export function transformTarkovDevItemToAmmoTableRow(item: DevTarkovAmmoItem): AmmoTableRow {
    const properties = item.properties;
    
    const tableRow = {
        id: item.id,
        name: item.name,
        shortName: item.shortName,
        caliber: properties ? properties.caliber : "",
        projectileCount: properties ? properties.projectileCount : 1,
        damage: properties ? properties.damage : -1,
        penetrationPower: properties ? properties.penetrationPower : -1,
        penetrationPowerDeviation: properties? properties.penetrationPowerDeviation : -1,
        armorDamagePerc: properties ? properties.armorDamage : -1,
        baseArmorDamage: properties ? properties.penetrationPower * properties.armorDamage/100: -1,
        lightBleedDelta: properties ? properties.lightBleedModifier : -1,
        heavyBleedDelta: properties ? properties.heavyBleedModifier : -1,
        fragChance: properties ? properties.fragmentationChance : -1,
        initialSpeed: properties ? properties.initialSpeed : -1,
        AmmoRec: properties ? properties.recoilModifier : -1,
        tracer: properties ? properties.tracer : false, 
        price: -1, 
        traderLevel: -1,
        bulletDiameterMilimeters: properties ? properties.bulletDiameterMilimeters : -1,
        bulletMassGrams: properties ? properties.bulletMassGrams : -1,
        ballisticCoeficient: properties ? properties.ballisticCoeficient: -1
    }

    const isMarlinExpress = item.shortName === "ME" || item.shortName === "LOKT";
    if(isMarlinExpress){
        tableRow.caliber = "Caliber784x49";
    }

    return tableRow;
}

export async function getAmmoDataFromApi_TarkovDev(){
    const fetched = await fetchDataFromApi_TarkovDev();

    if(fetched === null){
        console.error("Something went wrong fetching ammo data from json.tarkov.dev")
        return null;
    }
    const transformed = fetched.map(item => transformTarkovDevItemToAmmoTableRow(item));

    const filtered = transformed.filter(row => row.caliber !== undefined && row.caliber !=="");

    return filtered;
}

export async function getAmmoDataFromApi_WishGranter(): Promise<AmmoTableRow[] | null> {
    try {
        const response: AxiosResponse<AmmoTableRow[]> = await axios.get(`${API_URL}/GetAmmoDataSheetData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ammo data:', error);
        return null;
    }
};