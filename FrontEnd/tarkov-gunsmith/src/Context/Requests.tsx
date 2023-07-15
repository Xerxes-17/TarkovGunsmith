import { API_URL } from "../Util/util";

import axios from "axios";

export async function requestArmorTestSerires(requestDetails: any) {
    let response = null;
    try {
        response = await axios.get(API_URL + `/CalculateArmorVsBulletSeries/${requestDetails.armorId}/${requestDetails.armorDurability}/${requestDetails.ammoId}`);
    } catch (error) {
        throw error;
    }
    console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}

export async function requestArmorTestSerires_Custom(requestDetails: any) {

    let response = null;

    try {
        // CalculateArmorVsBulletSeries_Custom/{ac}/{material}/{maxDurability}/{startingDurabilityPerc}/{penetration}/{armorDamagePerc}
        response = await axios.get(API_URL + `/CalculateArmorVsBulletSeries_Custom/${requestDetails.armorClass}/${requestDetails.armorMaterial}/${requestDetails.armorDurabilityMax}/${requestDetails.armorDurabilityPerc}/${requestDetails.bluntThroughput}/${requestDetails.penetration}/${requestDetails.armorDamagePerc}/${requestDetails.damage}/${requestDetails.targetZone}`);
    } catch (error) {
        throw error;
    }
    console.log(response.data);
    // window.localStorage.setItem("armorTestDetails_custom", JSON.stringify(response.data));
    return response.data;
}

export async function requestWeaponBuild(requestDetails: any) {
    let response = null;

    try {
        response = await axios.get(API_URL + `/getSingleWeaponBuild/${requestDetails.level}/${requestDetails.priority}/${requestDetails.muzzleMode}/${requestDetails.presetId}/${requestDetails.flea}`);
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

export async function requestArmorVsAmmo(armorId: string) {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetArmorVsArmmo/${armorId}`);
    } catch (error) {
        throw error;
    }
    //console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}

export async function requestAmmoVsArmor(ammoId: string) {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetAmmoVsArmor/${ammoId}`);
    } catch (error) {
        throw error;
    }
    //console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}

export async function requestAmmoAuthorityData() {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetAmmoAuthorityData`);
    } catch (error) {
        throw error;
    }
    //console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}

export async function requestAmmoEffectivenessChart() {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetAmmoEffectivenessChart`);
    } catch (error) {
        throw error;
    }
    //console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}

export async function requestAmmoEffectivenessTimestamp() {
    let response = null;
    try {
        response = await axios.get(API_URL + `/GetTimestampAEC`);
    } catch (error) {
        throw error;
    }
    //console.log(response.data);
    //window.localStorage.setItem("armorTestDetails", JSON.stringify(response.data));
    return response.data;
}