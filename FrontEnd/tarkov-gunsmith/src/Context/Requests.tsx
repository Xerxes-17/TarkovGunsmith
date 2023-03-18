import { API_URL } from "../Util/util";

import axios from "axios";

export async function requestArmorTestSerires(requestDetails: any) {


    let response = null;

    try {
        response = await axios.get(API_URL + `/CalculateArmorVsBulletSeries/${requestDetails.armorId}/${requestDetails.armorDurability}/${requestDetails.ammoId}`);
    } catch (error) {
        throw error;
    }
    //console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}

export async function requestArmorTestSerires_Custom(requestDetails: any) {

    let response = null;

    try {
        // CalculateArmorVsBulletSeries_Custom/{ac}/{material}/{maxDurability}/{startingDurabilityPerc}/{penetration}/{armorDamagePerc}
        response = await axios.get(API_URL + `/CalculateArmorVsBulletSeries_Custom/${requestDetails.armorClass}/${requestDetails.armorMaterial}/${requestDetails.armorDurabilityMax}/${requestDetails.armorDurabilityPerc}/${requestDetails.penetration}/${requestDetails.armorDamagePerc}/${requestDetails.damage}`);
    } catch (error) {
        throw error;
    }

    // window.localStorage.setItem("armorTestDetails_custom", JSON.stringify(response.data));
    return response.data;
}

export async function requestWeaponBuild(requestDetails: any) {
    let response = null;

    try {
        response = await axios.get(API_URL + `/getSingleWeaponBuild/${requestDetails.level}/${requestDetails.mode}/${requestDetails.muzzleMode}/${requestDetails.searchString}/${requestDetails.purchaseType}`);
    } catch (error) {
        throw error;
    }
    // console.log(response.data);
    return response.data;
}

export async function requestWeaponDataCurve(requestDetails: any) {
    let response = null;
    ///GetWeaponStatsCurve/{presetID}/{mode}/{muzzleMode}/{purchaseType}
    try {
        response = await axios.get(API_URL + `/GetWeaponStatsCurve/${requestDetails.presetID}/${requestDetails.mode}/${requestDetails.muzzleMode}/${requestDetails.purchaseType}`);
    } catch (error) {
        throw error;
    }
    // console.log(response.data);
    return response.data;
}

export async function requestArmorEffectivenessData(armorId: string) {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetArmorEffectivenessData/${armorId}`);
    } catch (error) {
        throw error;
    }
    //console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}

export async function requestAmmoEffectivenessData(ammoId: string) {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetAmmoEffectivenessData/${ammoId}`);
    } catch (error) {
        throw error;
    }
    //console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}