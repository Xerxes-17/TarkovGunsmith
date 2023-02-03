import { API_URL } from "../Util/util";

import axios from "axios";

export async function requestArmorTestSerires(requestDetails: any) {

    console.log(requestDetails);

    let response = null;

    try {
        // getWeaponOptionsByPlayerLevelAndNameFilter/{level}/{mode}/{muzzleMode}/{searchString}
        response = await axios.get(API_URL + `/CalculateArmorVsBulletSeries_Name/${requestDetails.armorName}/${requestDetails.armorDurability}/${requestDetails.ammoName}`);
    } catch (error) {
        throw error;
    }

    window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}

export async function requestArmorTestSerires_Custom(requestDetails: any) {
    console.log(requestDetails);

    let response = null;

    try {
        // CalculateArmorVsBulletSeries_Custom/{ac}/{material}/{maxDurability}/{startingDurabilityPerc}/{penetration}/{armorDamagePerc}
        response = await axios.get(API_URL + `/CalculateArmorVsBulletSeries_Custom/${requestDetails.armorClass}/${requestDetails.armorMaterial}/${requestDetails.armorDurabilityMax}/${requestDetails.armorDurabilityPerc}/${requestDetails.penetration}/${requestDetails.armorDamagePerc}`);
    } catch (error) {
        throw error;
    }

    window.localStorage.setItem("armorTestDetails_custom", JSON.stringify(response.data));
    return response.data;
}

export async function requestWeaponBuild(requestDetails: any) {
    let response = null;

    try {
        response = await axios.get(API_URL + `/getWeaponOptionsByPlayerLevelAndNameFilter/${requestDetails.level}/${requestDetails.mode}/${requestDetails.muzzleMode}/${requestDetails.searchString}`);
    } catch (error) {
        throw error;
    }
    console.log(response.data);
    return response.data;
}