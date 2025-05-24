import axios from "axios";
import { API_URL } from "../../Util/util";

export async function requestAmmoEffectivenessChart() {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetAmmoEffectivenessChart`);
    } catch (error) {
        throw error;
    }
    return response.data;
}