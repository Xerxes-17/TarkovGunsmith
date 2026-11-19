import axios, { AxiosResponse } from "axios";
import { API_URL } from "../utils/util";
import { DevTarkovWeaponItem, WeaponsTableRow } from "../types/WeaponTypes";
import { getTarkovDevItemsOfType, TarkovDevRawItem } from "./TarkovDevJson";

/** Weapon properties as they appear in the json.tarkov.dev dump (only the fields we read). */
interface DumpWeaponProperties {
  caliber?: string;
  fireRate?: number;
  ergonomics?: number;
  recoilVertical?: number;
  recoilDispersion?: number;
  recoilAngle?: number;
  deviationCurve?: number;
  deviationMax?: number;
  /** null when the weapon has no default preset stats. */
  defaultErgonomics?: number | null;
  defaultRecoilVertical?: number | null;
  /** In the dump this is a preset item id string (GraphQL returned an { id, name } object). */
  defaultPreset?: string | null;
}

/** Maps a dump item to the shape the old GraphQL query returned, so the transform below is unchanged. */
function toDevTarkovWeaponItem(
  item: TarkovDevRawItem,
  translate: (key: string) => string
): DevTarkovWeaponItem {
  const p = (item.properties ?? {}) as DumpWeaponProperties;
  const ergonomics = p.ergonomics ?? 0;
  const recoilVertical = p.recoilVertical ?? 0;

  return {
    id: item.id,
    name: translate(item.name),
    properties: {
      caliber: p.caliber ?? "",
      fireRate: p.fireRate ?? 0,
      ergonomics,
      recoilVertical,
      recoilDispersion: p.recoilDispersion ?? 0,
      recoilAngle: p.recoilAngle ?? 0,
      deviationCurve: p.deviationCurve ?? 0,
      deviationMax: p.deviationMax ?? 0,
      // Same fallback the transform applies for nulls: use the base stat.
      defaultErgonomics: p.defaultErgonomics ?? ergonomics,
      defaultRecoilVertical: p.defaultRecoilVertical ?? recoilVertical,
      defaultPreset: p.defaultPreset
        ? { id: p.defaultPreset, name: translate(`${p.defaultPreset} Name`) }
        : null,
    },
  };
}

/** Weapons not relevant to the gunsmith tables, excluded by caliber. */
const unwantedWeaponCalibers: string[] = [
  "Caliber725", // RShG-2 72.5mm rocket launcher
];

async function fetchDataFromApi_TarkovDev(): Promise<
  DevTarkovWeaponItem[] | null
> {
  const result = await getTarkovDevItemsOfType("gun", "ItemPropertiesWeapon");
  if (result === null) return null;
  return result.items
    .map((item) => toDevTarkovWeaponItem(item, result.translate))
    .filter((weapon) => !unwantedWeaponCalibers.includes(weapon.properties?.caliber ?? ""));
}

function transformDevTarkovWeaponToWeaponsTableRow(
  weaponItem: DevTarkovWeaponItem
): WeaponsTableRow {
  const properties = weaponItem.properties;

  const tableRow: WeaponsTableRow = {
    id: weaponItem.id,
    name: weaponItem.name,
    imageLink: properties?.defaultPreset?.id
      ? `https://assets.tarkov.dev/${properties.defaultPreset.id}-icon.webp`
      : `https://assets.tarkov.dev/${weaponItem.id}-icon.webp`,

    caliber: properties ? properties.caliber : "",
    rateOfFire: properties ? properties.fireRate : -1,
    baseErgonomics: properties ? properties.ergonomics : -1,
    baseRecoil: properties ? properties.recoilVertical : -1,

    recoilDispersion: properties ? properties.recoilDispersion : -1,
    recoilAngle: properties ? properties.recoilAngle : -1,
    deviationCurve: properties ? properties.deviationCurve : -1,
    deviationMax: properties ? properties.deviationMax : -1,

    defaultErgonomics: properties
      ? properties.defaultErgonomics ?? properties.ergonomics
      : -1,
    defaultRecoil: properties
      ? properties.defaultRecoilVertical ?? properties.recoilVertical
      : -1,

    price: -1, // You need to provide the actual price or adjust this accordingly
    traderLevel: -1, // You need to provide the actual trader level or adjust this accordingly
    fleaPrice: -1, // You need to provide the actual flea price or adjust this accordingly
  };

  if (properties?.defaultErgonomics === null) {
    tableRow.defaultErgonomics = properties.ergonomics;
  }
  if (properties?.defaultRecoilVertical === null) {
    tableRow.defaultRecoil = properties.recoilVertical;
  }

  return tableRow;
}

export async function getDataFromApi_TarkovDev() {
  const fetched = await fetchDataFromApi_TarkovDev();
  if (fetched === null) {
    console.error(
      "Something went wrong fetching weapon data from json.tarkov.dev"
    );
    return null;
  }

  const transformed = fetched.map((item) =>
    transformDevTarkovWeaponToWeaponsTableRow(item)
  );

  return transformed;
}

export async function getDataFromApi_WishGranter(): Promise<
  WeaponsTableRow[] | null
> {
  try {
    const response: AxiosResponse<WeaponsTableRow[]> = await axios.get(
      `${API_URL}/GetWeaponDataSheetData`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching ammo data:", error);
    return null;
  }
}
