import axios, { AxiosResponse } from "axios";
import { API_URL } from "../Util/util";
import {
    AmmoTableRow,
    DevTarkovAmmoItem,
    DevTarkovJsonItem,
    DevTarkovJsonItemsResponse,
    DevTarkovJsonTranslationsResponse,
} from "../Types/AmmoTypes";

const TARKOV_DEV_ITEMS_URL = "https://json.tarkov.dev/pvp-season/items";
// The items dump holds translation keys ("<id> Name", "<id> ShortName"); display strings live here.
const TARKOV_DEV_ITEMS_EN_URL = "https://json.tarkov.dev/pvp-season/items_en";

/**
 * Parses the response body. Normally the server sends Content-Encoding: gzip and the
 * browser decompresses transparently, but if we get a raw gzip payload (magic bytes 1f 8b)
 * we decompress it ourselves with DecompressionStream.
 */
async function parseMaybeGzippedJson<T>(buffer: ArrayBuffer): Promise<T> {
    const bytes = new Uint8Array(buffer);
    const isGzip = bytes.length > 2 && bytes[0] === 0x1f && bytes[1] === 0x8b;

    if (!isGzip) {
        return JSON.parse(new TextDecoder().decode(bytes)) as T;
    }

    // Accessed via globalThis so this compiles on TS versions whose DOM lib predates DecompressionStream.
    const DecompressionStreamCtor = (globalThis as any).DecompressionStream;
    if (!DecompressionStreamCtor) {
        throw new Error("Received a gzip payload but this browser has no DecompressionStream support");
    }
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStreamCtor("gzip"));
    const text = await new Response(stream).text();
    return JSON.parse(text) as T;
}

function isAmmoItem(item: DevTarkovJsonItem): boolean {
    return (item.types?.includes("ammo") ?? false)
        && item.properties?.propertiesType === "ItemPropertiesAmmo";
}

/** Looks a translation key up in the dictionary; falls back to the raw value if it's missing. */
function translate(value: string, translations: Record<string, string>): string {
    return translations[value] ?? value;
}

/** Keeps only the fields the rest of the app expects, matching the old GraphQL query. */
function toDevTarkovAmmoItem(item: DevTarkovJsonItem, translations: Record<string, string>): DevTarkovAmmoItem {
    const p = item.properties!;
    return {
        id: item.id,
        name: translate(item.name, translations),
        shortName: translate(item.shortName, translations),
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

// The full item dump is several MB and several components ask for ammo on the same page,
// so share one in-flight request per page load. Cleared on failure so a retry can happen.
let ammoFetchPromise: Promise<DevTarkovAmmoItem[] | null> | null = null;

export function fetchDataFromApi_TarkovDev(): Promise<DevTarkovAmmoItem[] | null> {
    if (ammoFetchPromise === null) {
        ammoFetchPromise = fetchAmmoFromItemsDump().then(result => {
            if (result === null) ammoFetchPromise = null;
            return result;
        });
    }
    return ammoFetchPromise;
}

async function fetchTarkovDevJson<T>(url: string): Promise<T> {
    const response: AxiosResponse<ArrayBuffer> = await axios.get(url, { responseType: "arraybuffer" });
    return parseMaybeGzippedJson<T>(response.data);
}

/** Missing translations shouldn't take the whole table down, so this degrades to an empty dictionary. */
async function fetchItemTranslations(): Promise<Record<string, string>> {
    try {
        const json = await fetchTarkovDevJson<DevTarkovJsonTranslationsResponse>(TARKOV_DEV_ITEMS_EN_URL);
        if (!json?.data) {
            console.warn("Unexpected response shape from json.tarkov.dev items_en: missing data");
            return {};
        }
        return json.data;
    } catch (error) {
        console.warn("Error fetching item translations from json.tarkov.dev; names will show as keys:", error);
        return {};
    }
}

async function fetchAmmoFromItemsDump(): Promise<DevTarkovAmmoItem[] | null> {
    try {
        const [json, translations] = await Promise.all([
            fetchTarkovDevJson<DevTarkovJsonItemsResponse>(TARKOV_DEV_ITEMS_URL),
            fetchItemTranslations(),
        ]);

        const items = json?.data?.items;
        if (!items) {
            console.error("Unexpected response shape from json.tarkov.dev: missing data.items");
            return null;
        }

        // items is a map keyed by id; Object.values also copes if it's ever an array.
        return Object.values(items)
            .filter(isAmmoItem)
            .map(item => toDevTarkovAmmoItem(item, translations));
    } catch (error) {
        console.error("Error in fetching from json.tarkov.dev:", error);
        return null;
    }
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
        console.error("Something went wrong fetching ammo data from api.tarkov.dev")
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