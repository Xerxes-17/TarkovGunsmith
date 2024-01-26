export const ARMOR_TYPES: string[] = [
    "ArmorVest", "ChestRig", "Helmet", "ArmoredEquipment"
]

export const ARMOR_CLASSES: number[] = [1, 2, 3, 4, 5, 6]

export const MATERIALS: string[] = [
    "Aramid",
    "UHMWPE",
    "Combined",
    "Titan",
    "Aluminium",
    "Steel", //Renamed from ArmoredSteel
    "Ceramic",
    "Glass"
]

export enum MaterialType {
    "Aluminium",
    "Aramid",
    "ArmoredSteel",
    "Ceramic",
    "Combined",
    "Glass",
    "Titan",
    "UHMWPE"
}

export enum ArmorType
{
	None,
	Light,
	Heavy,
}

export enum ArmorCollider
{
    BackHead,
    Ears,
    Eyes,
    HeadCommon,
    Jaw,
    LeftCalf,
    LeftForearm,
    LeftSideChestDown,
    LeftSideChestUp,
    LeftThigh,
    LeftUpperArm,
    NeckBack,
    NeckFront,
    ParietalHead,
    Pelvis,
    PelvisBack,
    RibcageLow,
    RibcageUp,
    RightCalf,
    RightForearm,
    RightSideChestDown,
    RightSideChestUp,
    RightThigh,
    RightUpperArm,
    SpineDown,
    SpineTop
}

export enum ArmorPlateCollider
{
	// NATO
    Plate_Granit_SAPI_chest,
    Plate_Granit_SAPI_back,
    Plate_Granit_SSAPI_side_left_high,
    Plate_Granit_SSAPI_side_left_low,
    Plate_Granit_SSAPI_side_right_high,
    Plate_Granit_SSAPI_side_right_low,
	// RU
    Plate_Korund_chest,
	Plate_6B13_back,
    Plate_Korund_side_left_high,
    Plate_Korund_side_left_low,
    Plate_Korund_side_right_high,
    Plate_Korund_side_right_low
} 

export interface ArmorOption {
    armorClass: number;
    maxDurability: number;
    armorMaterial: number;
    effectiveDurability: number;
    traderLevel: number;
    value: string;
    readonly label: string;
    readonly imageLink: string;
    type: string;
}


function convertArmorStringToEnumVal(armorString: string): number {
    if (armorString === "Aluminium")
        return 0;
    else if (armorString === "Aramid")
        return 1;
    else if (armorString === "Steel") //Renamed from ArmoredSteel
        return 2;
    else if (armorString === "Ceramic")
        return 3;
    else if (armorString === "Combined")
        return 4;
    else if (armorString === "Glass")
        return 5;
    else if (armorString === "Titan")
        return 6;
    else if (armorString === "UHMWPE")
        return 7;
    else
        return -1;
}

export function convertEnumValToArmorString(enumVal: number): string {
    if (enumVal === 0)
        return "Aluminium";
    else if (enumVal === 1)
        return "Aramid";
    else if (enumVal === 2) //Renamed from ArmoredSteel
        return "Steel";
    else if (enumVal === 3)
        return "Ceramic";
    else if (enumVal === 4)
        return "Combined";
    else if (enumVal === 5)
        return "Glass";
    else if (enumVal === 6)
        return "Titan";
    else if (enumVal === 7)
        return "UHMWPE";
    else
        return "ERROR";
}

// // Gonna need to add a type field to the ArmorOption
export function filterArmorOptions(armorType:string[], armorClasses: number[], armorMaterials: string[], unfilteredOptions: ArmorOption[]): ArmorOption[] {
    let materialsFilter: number[] = [];

    armorMaterials.forEach(function(item){
        materialsFilter.push(convertArmorStringToEnumVal(item)
    )});

    const result = unfilteredOptions.filter(item =>
        armorType.includes(item.type) &&
        armorClasses.includes(item.armorClass) &&
        materialsFilter.includes(item.armorMaterial)
    )
    return result;
}

// export function sortArmorOptions() {
//     armorOptions.sort((a, b) => {
//         if (a.label < b.label) {
//             return -1;
//         }
//         else if (a.label > b.label) {
//             return 1
//         }
//         else {
//             return 0;
//         }
//     })
// }

// sortArmorOptions();