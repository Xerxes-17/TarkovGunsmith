import axios, { AxiosResponse } from "axios";
import { API_URL } from "../Util/util";
import { DevTarkovWeaponItem, WeaponsTableRow } from "../Types/WeaponTypes";

interface ApiResponse {
  data: {
    items: DevTarkovWeaponItem[];
  };
}

async function fetchDataFromApi_TarkovDev(): Promise<
  DevTarkovWeaponItem[] | null
> {
  try {
    const response: AxiosResponse<ApiResponse> = await axios.post(
      "https://api.tarkov.dev/graphql",
      {
        query: `
                {
                    items(types: [gun]) {
                        id
                        name
                        properties {
                            ... on ItemPropertiesWeapon {
                                caliber
        
                                fireRate
                                ergonomics
                                recoilVertical
                                
                                recoilDispersion
                                convergence
                                recoilAngle
                                cameraRecoil
                                
                                cameraSnap
                                centerOfImpact
                                deviationCurve
                                deviationMax
                                
                                defaultErgonomics
                                defaultRecoilVertical
                                defaultPreset{
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            `,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );
    return response.data.data.items;
  } catch (error) {
    console.error("Error in fetching from api.tarkov.dev:", error);
    return null;
  }
}

function transformDevTarkovWeaponToWeaponsTableRow(
  weaponItem: DevTarkovWeaponItem
): WeaponsTableRow {
  const properties = weaponItem.properties;

  const tableRow: WeaponsTableRow = {
    id: weaponItem.id,
    name: weaponItem.name,
    imageLink: properties?.defaultPreset?.id
      ? `https://assets.tarkov.dev/${properties?.defaultPreset.id}-icon.webp`
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
      "Something went wrong fetching ammo data from api.tarkov.dev"
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
