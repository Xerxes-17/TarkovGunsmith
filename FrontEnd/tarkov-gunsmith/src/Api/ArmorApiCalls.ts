import axios, { AxiosResponse } from "axios";
import { API_URL } from "../Util/util";
import { ApiResponse } from "../Types/AmmoTypes";
import { NewArmorTableRow } from "../Types/ArmorTypes";

export async function getHelmetsDataFromApi_WishGranter(): Promise<
  NewArmorTableRow[] | null
> {
  try {
    const response: AxiosResponse<NewArmorTableRow[]> = await axios.get(
      `${API_URL}/GetHelmetsDataSheetData`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching helmets data:", error);
    return null;
  }
}

export async function getArmorStatsDataFromApi_WishGranter(): Promise<
  NewArmorTableRow[] | null
> {
  try {
    const response: AxiosResponse<NewArmorTableRow[]> = await axios.get(
      `${API_URL}/GetGetNewArmorStatSheetData`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching helmets data:", error);
    return null;
  }
}

export interface ArmorMaterialStats {
  name: string;
  destructibility: number;
  explosionDestructibility: number;
  minRepairDegradation: number;
  maxRepairDegradation: number;
  minRepairKitDegradation: number;
  maxRepairKitDegradation: number;
}

export interface ApiResponseArmorMaterialStats {
  data: {
    items: ArmorMaterialStats[];
  };
}

export interface ArmorMaterialDestructibility {
  name: string;
  destructibility: number;
  explosionDestructibility: number;
}
export interface ArmorMaterialDestructibilitySelect {
    /** Name of the Material */
    label: string;
    /** Also the name of the Material, because we are choosing the Material, not the destructibility. */
    value: string;
    destructibility: number;
    explosionDestructibility: number;
  }

async function fetchArmorMaterialsFromApi_TarkovDev(): Promise<
  ArmorMaterialStats[] | null
> {
  try {
    const response: AxiosResponse<ApiResponseArmorMaterialStats> =
      await axios.post(
        "https://api.tarkov.dev/graphql",
        {
          query: `
        query materials {
            armorMaterials {
              name
              destructibility
              explosionDestructibility
              minRepairDegradation
              maxRepairDegradation
              minRepairKitDegradation
              maxRepairKitDegradation
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
