import axios, { AxiosResponse } from "axios";
import { API_URL } from "../Util/util";
import { NewArmorTableRow } from "../Types/HelmetTypes";


export async function getHelmetsDataFromApi_WishGranter(): Promise<NewArmorTableRow[] | null> {
    try {
        const response: AxiosResponse<NewArmorTableRow[]> = await axios.get(`${API_URL}/GetHelmetsDataSheetData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching helmets data:', error);
        return null;
    }
};

export async function getArmorStatsDataFromApi_WishGranter(): Promise<NewArmorTableRow[] | null> {
    try {
        const response: AxiosResponse<NewArmorTableRow[]> = await axios.get(`${API_URL}/GetGetNewArmorStatSheetData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching helmets data:', error);
        return null;
    }
};