import axios, { AxiosResponse } from "axios";
import { API_URL } from "../Util/util";
import { AmmoTableRow, ApiResponse, DevTarkovAmmoItem } from "../Types/AmmoTypes";

export async function fetchDataFromApi_TarkovDev(): Promise<DevTarkovAmmoItem[] | null> {
    try {
        const response: AxiosResponse<ApiResponse> = await axios.post("https://api.tarkov.dev/graphql", {
            query: `
            {
                items(types: [ammo]) {
                    id
                    name
                    shortName
                    properties {
                        ... on ItemPropertiesAmmo {
                            penetrationPowerDeviation
                            penetrationPower
                            damage
                            caliber
                            armorDamage
                            projectileCount
                            recoilModifier
                            heavyBleedModifier
                            lightBleedModifier
                            accuracyModifier
                            initialSpeed
                            fragmentationChance
                            tracer
                        }
                    }
                }
            }`
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
        });
        return response.data.data.items;
    } catch (error) {
        console.error("Error in fetching from api.tarkov.dev:", error);
        return null;
    }
}

export function transformTarkovDevItemToAmmoTableRow(item: DevTarkovAmmoItem): AmmoTableRow {
    const properties = item.properties;

    return {
        id: item.id,
        name: item.name,
        shortName: item.shortName,
        caliber: properties ? properties.caliber : "",
        projectileCount: properties ? properties.projectileCount : 1,
        damage: properties ? properties.damage : -1,
        penetrationPower: properties ? properties.penetrationPower : -1,
        penetrationPowerDeviation: properties? properties.penetrationPowerDeviation : -1,
        armorDamagePerc: properties ? properties.armorDamage : -1,
        baseArmorDamage: properties ? properties.penetrationPower * properties.armorDamage/100: -1,
        lightBleedDelta: properties ? properties.lightBleedModifier : -1,
        heavyBleedDelta: properties ? properties.heavyBleedModifier : -1,
        fragChance: properties ? properties.fragmentationChance : -1,
        initialSpeed: properties ? properties.initialSpeed : -1,
        AmmoRec: properties ? properties.recoilModifier : -1,
        tracer: properties ? properties.tracer : false, 
        price: -1, 
        traderLevel: -1,
    };
}

export async function getAmmoDataFromApi_TarkovDev(){
    const fetched = await fetchDataFromApi_TarkovDev();

    if(fetched === null){
        console.error("Something went wrong fetching ammo data from api.tarkov.dev")
        return null;
    }
    const transformed = fetched.map(item => transformTarkovDevItemToAmmoTableRow(item));

    const filtered = transformed.filter(row => row.caliber !== undefined && row.caliber !=="");

    return filtered;
}

export async function getAmmoDataFromApi_WishGranter(): Promise<AmmoTableRow[] | null> {
    try {
        const response: AxiosResponse<AmmoTableRow[]> = await axios.get(`${API_URL}/GetAmmoDataSheetData`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ammo data:', error);
        return null;
    }
};