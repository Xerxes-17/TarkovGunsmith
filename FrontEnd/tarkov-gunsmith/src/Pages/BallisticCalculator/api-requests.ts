import axios from "axios";
import { API_URL } from "../../Util/util";
import { DropCalculatorInput } from "./types";




export async function requestDopeTableOptions() {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetDopeTableOptions`);
    } catch (error) {
        throw error;
    }
    return response.data;
}


export async function requestBallisticCalculation(requestDetails: DropCalculatorInput) {
    let response = null;
    try {
        response = await axios.post(API_URL + `/GetBallisticCalculation`, requestDetails);
    } catch (error) {
        throw error;
    }
    return response.data;
}