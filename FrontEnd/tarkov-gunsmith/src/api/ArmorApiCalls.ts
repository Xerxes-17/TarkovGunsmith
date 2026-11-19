import axios, { AxiosResponse } from "axios";
import { API_URL } from "../utils/util";
import { NewArmorTableRow } from "../types/ArmorTypes";

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
