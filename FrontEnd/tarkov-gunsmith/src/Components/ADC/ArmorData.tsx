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
    "ArmoredSteel",
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
}

// Gonna need to add a type field to the ArmorOption
export function filterArmorOptions(armorClasses: number[], armorMaterials: number[]): ArmorOption[] {

    const result = armorOptions.filter(item =>
        armorClasses.includes(item.armorClass) &&
        armorMaterials.includes(item.armorMaterial)
    )


    return result;
}

export function sortArmorptions() {
    armorOptions.sort((a, b) => {
        if (a.label < b.label) {
            return -1;
        }
        else if (a.label > b.label) {
            return 1
        }
        else {
            return 0;
        }
    })
}

export const armorOptions: ArmorOption[] = [
    {
        armorClass: 6,
        maxDurability: 80,
        armorMaterial: 2,
        effectiveDurability: 114,
        traderLevel: -1,
        value: "6038b4b292ec1c3103795a0b",
        label: "LBT-6094A Slick Plate Carrier (Tan)",
        imageLink: "https://assets.tarkov.dev/6038b4b292ec1c3103795a0b-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 85,
        armorMaterial: 7,
        effectiveDurability: 188,
        traderLevel: -1,
        value: "5c0e655586f774045612eeb2",
        label: "HighCom Trooper TFO body armor (Multicam)",
        imageLink: "https://assets.tarkov.dev/5c0e655586f774045612eeb2-icon.jpg"
    },
    {
        armorClass: 3,
        maxDurability: 50,
        armorMaterial: 7,
        effectiveDurability: 111,
        traderLevel: -1,
        value: "5c0e5edb86f77461f55ed1f7",
        label: "BNTI \"Zhuk-3\" body armor (Press)",
        imageLink: "https://assets.tarkov.dev/5c0e5edb86f77461f55ed1f7-icon.jpg"
    },
    {
        armorClass: 6,
        maxDurability: 75,
        armorMaterial: 3,
        effectiveDurability: 93,
        traderLevel: -1,
        value: "5c0e625a86f7742d77340f62",
        label: "BNTI \"Zhuk-6a\" body armor",
        imageLink: "https://assets.tarkov.dev/5c0e625a86f7742d77340f62-icon.jpg"
    },
    {
        armorClass: 2,
        maxDurability: 40,
        armorMaterial: 1,
        effectiveDurability: 160,
        traderLevel: -1,
        value: "59e7635f86f7742cbf2c1095",
        label: "BNTI \"Module-3M\" body armor",
        imageLink: "https://assets.tarkov.dev/59e7635f86f7742cbf2c1095-icon.jpg"
    },
    {
        armorClass: 2,
        maxDurability: 50,
        armorMaterial: 1,
        effectiveDurability: 200,
        traderLevel: 1,
        value: "5648a7494bdc2d9d488b4583",
        label: "PACA Soft Armor",
        imageLink: "https://assets.tarkov.dev/5648a7494bdc2d9d488b4583-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 65,
        armorMaterial: 3,
        effectiveDurability: 81,
        traderLevel: -1,
        value: "5ab8e79e86f7742d8b372e78",
        label: "BNTI \"Gzhel-K\" body armor",
        imageLink: "https://assets.tarkov.dev/5ab8e79e86f7742d8b372e78-icon.jpg"
    },
    {
        armorClass: 3,
        maxDurability: 50,
        armorMaterial: 0,
        effectiveDurability: 83,
        traderLevel: 2,
        value: "5ab8e4ed86f7742d8e50c7fa",
        label: "MF-UNTAR body armor",
        imageLink: "https://assets.tarkov.dev/5ab8e4ed86f7742d8e50c7fa-icon.jpg"
    },
    {
        armorClass: 6,
        maxDurability: 85,
        armorMaterial: 4,
        effectiveDurability: 170,
        traderLevel: -1,
        value: "545cdb794bdc2d3a198b456a",
        label: "6B43 6A \"Zabralo-Sh\" body armor",
        imageLink: "https://assets.tarkov.dev/545cdb794bdc2d3a198b456a-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 47,
        armorMaterial: 3,
        effectiveDurability: 58,
        traderLevel: 3,
        value: "5c0e53c886f7747fa54205c7",
        label: "6B13 assault armor (Digital Flora)",
        imageLink: "https://assets.tarkov.dev/5c0e53c886f7747fa54205c7-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 47,
        armorMaterial: 3,
        effectiveDurability: 58,
        traderLevel: 2,
        value: "5c0e51be86f774598e797894",
        label: "6B13 assault armor (Flora)",
        imageLink: "https://assets.tarkov.dev/5c0e51be86f774598e797894-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 60,
        armorMaterial: 7,
        effectiveDurability: 133,
        traderLevel: -1,
        value: "5c0e541586f7747fa54205c9",
        label: "6B13 M modified assault armor (Tan)",
        imageLink: "https://assets.tarkov.dev/5c0e541586f7747fa54205c9-icon.jpg"
    },
    {
        armorClass: 2,
        maxDurability: 80,
        armorMaterial: 6,
        effectiveDurability: 145,
        traderLevel: 1,
        value: "5df8a2ca86f7740bfe6df777",
        label: "6B2 body armor (Flora)",
        imageLink: "https://assets.tarkov.dev/5df8a2ca86f7740bfe6df777-icon.jpg"
    },
    {
        armorClass: 3,
        maxDurability: 60,
        armorMaterial: 2,
        effectiveDurability: 85,
        traderLevel: 2,
        value: "5c0e5bab86f77461f55ed1f3",
        label: "6B23-1 body armor (Digital Flora)",
        imageLink: "https://assets.tarkov.dev/5c0e5bab86f77461f55ed1f3-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 55,
        armorMaterial: 3,
        effectiveDurability: 68,
        traderLevel: 3,
        value: "5c0e57ba86f7747fa141986d",
        label: "6B23-2 body armor (Mountain Flora)",
        imageLink: "https://assets.tarkov.dev/5c0e57ba86f7747fa141986d-icon.jpg"
    },
    {
        armorClass: 6,
        maxDurability: 50,
        armorMaterial: 7,
        effectiveDurability: 111,
        traderLevel: -1,
        value: "5fd4c474dd870108a754b241",
        label: "5.11 Tactical Hexgrid plate carrier",
        imageLink: "https://assets.tarkov.dev/5fd4c474dd870108a754b241-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 35,
        armorMaterial: 4,
        effectiveDurability: 70,
        traderLevel: -1,
        value: "609e8540d5c319764c2bc2e9",
        label: "NFM THOR Concealable Reinforced Vest body armor",
        imageLink: "https://assets.tarkov.dev/609e8540d5c319764c2bc2e9-icon.jpg"
    },
    {
        armorClass: 6,
        maxDurability: 55,
        armorMaterial: 4,
        effectiveDurability: 110,
        traderLevel: -1,
        value: "60a283193cb70855c43a381d",
        label: "NFM THOR Integrated Carrier body armor",
        imageLink: "https://assets.tarkov.dev/60a283193cb70855c43a381d-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 70,
        armorMaterial: 2,
        effectiveDurability: 100,
        traderLevel: -1,
        value: "5e9dacf986f774054d6b89f4",
        label: "FORT \"Defender-2\" body armor",
        imageLink: "https://assets.tarkov.dev/5e9dacf986f774054d6b89f4-icon.jpg"
    },
    {
        armorClass: 3,
        maxDurability: 60,
        armorMaterial: 1,
        effectiveDurability: 240,
        traderLevel: -1,
        value: "62a09d79de7ac81993580530",
        label: "DRD body armor",
        imageLink: "https://assets.tarkov.dev/62a09d79de7ac81993580530-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 95,
        armorMaterial: 6,
        effectiveDurability: 172,
        traderLevel: -1,
        value: "5b44cd8b86f774503d30cba2",
        label: "IOTV Gen4 body armor (full protection)",
        imageLink: "https://assets.tarkov.dev/5b44cd8b86f774503d30cba2-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 75,
        armorMaterial: 6,
        effectiveDurability: 136,
        traderLevel: -1,
        value: "5b44cf1486f77431723e3d05",
        label: "IOTV Gen4 body armor (assault kit)",
        imageLink: "https://assets.tarkov.dev/5b44cf1486f77431723e3d05-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 65,
        armorMaterial: 6,
        effectiveDurability: 118,
        traderLevel: -1,
        value: "5b44d0de86f774503d30cba8",
        label: "IOTV Gen4 body armor (high mobility kit)",
        imageLink: "https://assets.tarkov.dev/5b44d0de86f774503d30cba8-icon.jpg"
    },
    {
        armorClass: 3,
        maxDurability: 70,
        armorMaterial: 4,
        effectiveDurability: 140,
        traderLevel: 2,
        value: "5b44d22286f774172b0c9de8",
        label: "BNTI \"Kirasa-N\" body armor",
        imageLink: "https://assets.tarkov.dev/5b44d22286f774172b0c9de8-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 45,
        armorMaterial: 2,
        effectiveDurability: 64,
        traderLevel: 4,
        value: "5f5f41476bdad616ad46d631",
        label: "NPP KlASS \"Korund-VM\" body armor",
        imageLink: "https://assets.tarkov.dev/5f5f41476bdad616ad46d631-icon.jpg"
    },
    {
        armorClass: 2,
        maxDurability: 50,
        armorMaterial: 1,
        effectiveDurability: 200,
        traderLevel: -1,
        value: "607f20859ee58b18e41ecd90",
        label: "PACA Soft Armor (Rivals Edition)",
        imageLink: "https://assets.tarkov.dev/607f20859ee58b18e41ecd90-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 60,
        armorMaterial: 4,
        effectiveDurability: 120,
        traderLevel: 3,
        value: "5ca2151486f774244a3b8d30",
        label: "FORT \"Redut-M\" body armor",
        imageLink: "https://assets.tarkov.dev/5ca2151486f774244a3b8d30-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 100,
        armorMaterial: 4,
        effectiveDurability: 200,
        traderLevel: -1,
        value: "5ca21c6986f77479963115a7",
        label: "FORT \"Redut-T5\" body armor",
        imageLink: "https://assets.tarkov.dev/5ca21c6986f77479963115a7-icon.jpg"
    },
    {
        armorClass: 6,
        maxDurability: 80,
        armorMaterial: 2,
        effectiveDurability: 114,
        traderLevel: -1,
        value: "5e4abb5086f77406975c9342",
        label: "LBT-6094A Slick Plate Carrier",
        imageLink: "https://assets.tarkov.dev/5e4abb5086f77406975c9342-icon.jpg"
    },
    {
        armorClass: 6,
        maxDurability: 80,
        armorMaterial: 2,
        effectiveDurability: 114,
        traderLevel: -1,
        value: "6038b4ca92ec1c3103795a0d",
        label: "LBT-6094A Slick Plate Carrier (Olive)",
        imageLink: "https://assets.tarkov.dev/6038b4ca92ec1c3103795a0d-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 50,
        armorMaterial: 3,
        effectiveDurability: 62,
        traderLevel: -1,
        value: "5c0e446786f7742013381639",
        label: "6B5-15 Zh-86 \"Uley\" armored rig",
        imageLink: "https://assets.tarkov.dev/5c0e446786f7742013381639-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 40,
        armorMaterial: 7,
        effectiveDurability: 88,
        traderLevel: -1,
        value: "61bc85697113f767765c7fe7",
        label: "Eagle Industries MMAC plate carrier (Ranger Green)",
        imageLink: "https://assets.tarkov.dev/61bc85697113f767765c7fe7-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 60,
        armorMaterial: 7,
        effectiveDurability: 133,
        traderLevel: -1,
        value: "5e4ac41886f77406a511c9a8",
        label: "Ars Arma CPC MOD.2 plate carrier",
        imageLink: "https://assets.tarkov.dev/5e4ac41886f77406a511c9a8-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 45,
        armorMaterial: 0,
        effectiveDurability: 75,
        traderLevel: -1,
        value: "61bcc89aef0f505f0c6cd0fc",
        label: "FirstSpear Strandhogg plate carrier rig (Ranger Green)",
        imageLink: "https://assets.tarkov.dev/61bcc89aef0f505f0c6cd0fc-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 60,
        armorMaterial: 6,
        effectiveDurability: 109,
        traderLevel: -1,
        value: "5ab8dced86f774646209ec87",
        label: "ANA Tactical M2 armored rig",
        imageLink: "https://assets.tarkov.dev/5ab8dced86f774646209ec87-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 80,
        armorMaterial: 4,
        effectiveDurability: 160,
        traderLevel: -1,
        value: "5d5d87f786f77427997cfaef",
        label: "Ars Arma A18 Skanda plate carrier",
        imageLink: "https://assets.tarkov.dev/5d5d87f786f77427997cfaef-icon.jpg"
    },
    {
        armorClass: 3,
        maxDurability: 80,
        armorMaterial: 6,
        effectiveDurability: 145,
        traderLevel: 1,
        value: "5c0e3eb886f7742015526062",
        label: "6B5-16 Zh-86 Uley armored rig",
        imageLink: "https://assets.tarkov.dev/5c0e3eb886f7742015526062-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 45,
        armorMaterial: 6,
        effectiveDurability: 81,
        traderLevel: -1,
        value: "628dc750b910320f4c27a732",
        label: "ECLiPSE RBAV-AF plate carrier (Ranger Green)",
        imageLink: "https://assets.tarkov.dev/628dc750b910320f4c27a732-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 55,
        armorMaterial: 2,
        effectiveDurability: 78,
        traderLevel: -1,
        value: "628d0618d1ba6e4fa07ce5a4",
        label: "NPP KlASS \"Bagariy\" armored rig",
        imageLink: "https://assets.tarkov.dev/628d0618d1ba6e4fa07ce5a4-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 65,
        armorMaterial: 2,
        effectiveDurability: 92,
        traderLevel: -1,
        value: "5c0e722886f7740458316a57",
        label: "ANA Tactical M1 armored rig",
        imageLink: "https://assets.tarkov.dev/5c0e722886f7740458316a57-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 85,
        armorMaterial: 2,
        effectiveDurability: 121,
        traderLevel: 4,
        value: "5c0e746986f7741453628fe5",
        label: "WARTECH TV-110 plate carrier rig",
        imageLink: "https://assets.tarkov.dev/5c0e746986f7741453628fe5-icon.jpg"
    },
    {
        armorClass: 6,
        maxDurability: 60,
        armorMaterial: 6,
        effectiveDurability: 109,
        traderLevel: -1,
        value: "609e860ebd219504d8507525",
        label: "Crye Precision AVS MBAV (Tagilla Edition)",
        imageLink: "https://assets.tarkov.dev/609e860ebd219504d8507525-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 70,
        armorMaterial: 4,
        effectiveDurability: 140,
        traderLevel: -1,
        value: "544a5caa4bdc2d1a388b4568",
        label: "Crye Precision AVS plate carrier",
        imageLink: "https://assets.tarkov.dev/544a5caa4bdc2d1a388b4568-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 40,
        armorMaterial: 6,
        effectiveDurability: 72,
        traderLevel: 2,
        value: "5d5d646386f7742797261fd9",
        label: "6B3TM-01M armored rig",
        imageLink: "https://assets.tarkov.dev/5d5d646386f7742797261fd9-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 85,
        armorMaterial: 7,
        effectiveDurability: 188,
        traderLevel: -1,
        value: "628b9784bcf6e2659e09b8a2",
        label: "S&S Precision PlateFrame plate carrier (Goons Edition)",
        imageLink: "https://assets.tarkov.dev/628b9784bcf6e2659e09b8a2-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 75,
        armorMaterial: 4,
        effectiveDurability: 150,
        traderLevel: -1,
        value: "628b9c7d45122232a872358f",
        label: "Crye Precision CPC plate carrier (Goons Edition)",
        imageLink: "https://assets.tarkov.dev/628b9c7d45122232a872358f-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 50,
        armorMaterial: 7,
        effectiveDurability: 111,
        traderLevel: -1,
        value: "5b44cad286f77402a54ae7e5",
        label: "5.11 Tactical TacTec plate carrier",
        imageLink: "https://assets.tarkov.dev/5b44cad286f77402a54ae7e5-icon.jpg"
    },
    {
        armorClass: 4,
        maxDurability: 60,
        armorMaterial: 0,
        effectiveDurability: 100,
        traderLevel: 3,
        value: "60a3c70cde5f453f634816a3",
        label: "CQC Osprey MK4A plate carrier (Assault, MTP)",
        imageLink: "https://assets.tarkov.dev/60a3c70cde5f453f634816a3-icon.jpg"
    },
    {
        armorClass: 5,
        maxDurability: 55,
        armorMaterial: 4,
        effectiveDurability: 110,
        traderLevel: 4,
        value: "60a3c68c37ea821725773ef5",
        label: "CQC Osprey MK4A plate carrier (Protection, MTP)",
        imageLink: "https://assets.tarkov.dev/60a3c68c37ea821725773ef5-icon.jpg"
    },
    {
        armorClass: 6,
        maxDurability: 40,
        armorMaterial: 3,
        effectiveDurability: 50,
        traderLevel: -1,
        value: "628cd624459354321c4b7fa2",
        label: "Tasmanian Tiger SK plate carrier (Multicam Black)",
        imageLink: "https://assets.tarkov.dev/628cd624459354321c4b7fa2-icon.jpg"
    }
]

sortArmorptions();