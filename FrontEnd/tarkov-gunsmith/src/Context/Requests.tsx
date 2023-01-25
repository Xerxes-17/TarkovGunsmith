import { API_URL } from "../Util/util";

import axios from "axios";

export async function requestArmorTestSerires(requestDetails: any) {

    console.log(requestDetails);

    let response = null;

    try {
        response = await axios.get(API_URL + `/CalculateArmorVsBulletSeries_Name/${requestDetails.armorName}/${requestDetails.armorDurability}/${requestDetails.ammoName}`);
        //'https://localhost:5001/CalculateArmorVsBulletSeries_Name/6B3TM/M80'
    } catch (error) {
        throw error;
    }

    window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    //dispatch(response.data);
    return response.data;
}

export async function requestWeaponBuild(requestDetails: any) {
    let response = null;

    try {
        response = await axios.get(API_URL + `/getWeaponOptionsByPlayerLevelAndNameFilter/${requestDetails.level}/${requestDetails.mode}/${requestDetails.muzzleMode}/${requestDetails.searchString}`);
        //'https://localhost:5001/CalculateArmorVsBulletSeries_Name/6B3TM/M80'
    } catch (error) {
        throw error;
    }
    console.log(response.data);
    return response.data;
}