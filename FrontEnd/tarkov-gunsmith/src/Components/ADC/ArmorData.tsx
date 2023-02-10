export const ARMOR_TYPES: string[] = [
    "ArmorVest", "ChestRig", "Helmet"
]

export const ARMOR_CLASSES: number[] = [2, 3, 4, 5, 6]

export const MATERIALS: string[] = [
    "Aramid",
    "UHMWPE",
    "Combined",
    "Titan",
    "Aluminium",
    "Steel", //Renamed from ArmoredSteel
    "Ceramic"
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