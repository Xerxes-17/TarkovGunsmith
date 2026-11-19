import axios, { AxiosResponse } from "axios";

/**
 * Shared access to the json.tarkov.dev static item dump, which replaced the
 * api.tarkov.dev GraphQL endpoint.
 *
 * - `<mode>/items` holds every item, with name/shortName/description stored as
 *   translation keys ("<id> Name", "<id> ShortName").
 * - `<mode>/items_<lang>` maps those keys to display strings.
 *
 * Both are fetched once per page load and shared by every caller (ammo, weapons, ...).
 */

const TARKOV_DEV_JSON_BASE = "https://json.tarkov.dev/pvp-season";
const ITEMS_URL = `${TARKOV_DEV_JSON_BASE}/items`;
const ITEMS_EN_URL = `${TARKOV_DEV_JSON_BASE}/items_en`;

/** An item from the dump. Only the common fields are typed; callers narrow `properties` themselves. */
export interface TarkovDevRawItem {
    id: string;
    name: string;
    shortName: string;
    types?: string[];
    properties: ({ propertiesType?: string } & Record<string, unknown>) | null;
}

interface ItemsResponse {
    data: {
        /** A map keyed by item id (an array is tolerated too). */
        items: Record<string, TarkovDevRawItem> | TarkovDevRawItem[];
    };
}

interface TranslationsResponse {
    data: Record<string, string>;
}

export interface TarkovDevItemsData {
    items: TarkovDevRawItem[];
    /** Resolves a translation key to its display string, or returns the input unchanged if unknown. */
    translate: (key: string) => string;
}

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

async function fetchJson<T>(url: string): Promise<T> {
    const response: AxiosResponse<ArrayBuffer> = await axios.get(url, { responseType: "arraybuffer" });
    return parseMaybeGzippedJson<T>(response.data);
}

/** Missing translations shouldn't take whole tables down, so this degrades to an empty dictionary. */
async function fetchTranslations(): Promise<Record<string, string>> {
    try {
        const json = await fetchJson<TranslationsResponse>(ITEMS_EN_URL);
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

async function fetchItemsData(): Promise<TarkovDevItemsData | null> {
    try {
        const [json, translations] = await Promise.all([fetchJson<ItemsResponse>(ITEMS_URL), fetchTranslations()]);

        const items = json?.data?.items;
        if (!items) {
            console.error("Unexpected response shape from json.tarkov.dev items: missing data.items");
            return null;
        }

        return {
            items: Object.values(items),
            translate: (key: string) => translations[key] ?? key,
        };
    } catch (error) {
        console.error("Error in fetching from json.tarkov.dev:", error);
        return null;
    }
}

// One in-flight request per page load. Cleared on failure so a later call can retry.
let itemsDataPromise: Promise<TarkovDevItemsData | null> | null = null;

export function getTarkovDevItemsData(): Promise<TarkovDevItemsData | null> {
    if (itemsDataPromise === null) {
        itemsDataPromise = fetchItemsData().then(result => {
            if (result === null) itemsDataPromise = null;
            return result;
        });
    }
    return itemsDataPromise;
}

/**
 * Items of one kind, e.g. ("ammo", "ItemPropertiesAmmo") or ("gun", "ItemPropertiesWeapon").
 * Matching on propertiesType as well as the type tag keeps out items that share a tag
 * but lack the expected properties.
 */
export async function getTarkovDevItemsOfType(
    type: string,
    propertiesType: string
): Promise<{ items: TarkovDevRawItem[]; translate: (key: string) => string } | null> {
    const data = await getTarkovDevItemsData();
    if (data === null) return null;

    const items = data.items.filter(
        item => (item.types?.includes(type) ?? false) && item.properties?.propertiesType === propertiesType
    );
    return { items, translate: data.translate };
}
