import React, { createContext, useState, useMemo, useEffect, useCallback, SetStateAction } from 'react';
import { AmmoOption } from '../Types/T_Ammo';
import { ARMOR_CLASSES, ARMOR_TYPES, ArmorOption, MATERIALS } from '../Types/T_Armor';
import { requestArmorTestSerires } from './Requests';
import { BallisticHit, NewArmorTestResult } from './ArmorTestsContext';
import { API_URL } from '../Util/util';
import { useNavigate, useParams } from 'react-router-dom';
import { LINKS } from '../Util/links';



export function filterAmmoOptions(ammoOptions: AmmoOption[], minDam: number, minPen: number, minADP: number, maxTrader: number, calibers: string[]): AmmoOption[] {
    const result = ammoOptions.filter(item =>
        item.damage >= minDam &&
        item.penetrationPower >= minPen &&
        item.armorDamagePerc >= minADP &&
        item.traderLevel <= maxTrader &&
        calibers.includes(item.caliber)
    )
    return result;
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

export function filterArmorOptions(armorType: string[], armorClasses: number[], armorMaterials: string[], unfilteredOptions: ArmorOption[]): ArmorOption[] {
    let materialsFilter: number[] = [];

    armorMaterials.forEach(function (item) {
        materialsFilter.push(convertArmorStringToEnumVal(item)
        )
    });

    const result = unfilteredOptions.filter(item =>
        armorType.includes(item.type) &&
        armorClasses.includes(item.armorClass) &&
        materialsFilter.includes(item.armorMaterial)
    )
    return result;
}

/**
 * Dictates the structure of the context's data. Used by the StateStructure_Default 
 * and the ContextState Memo in ContextProvider.
 */
type TbsStateStructure = {
    exampleValue: string;
    setExampleValue: React.Dispatch<React.SetStateAction<string>>;

    armorId: string;
    setArmorId: React.Dispatch<React.SetStateAction<string>>;
    armorDurabilityMax: number;
    setArmorDurabilityMax: React.Dispatch<React.SetStateAction<number>>;
    armorDurabilityNum: number;
    setArmorDurabilityNum: React.Dispatch<React.SetStateAction<number>>;
    defaultSelection_Armor: ArmorOption | undefined;
    setDefaultSelection_Armor: React.Dispatch<React.SetStateAction<ArmorOption | undefined>>;
    ArmorOptions: ArmorOption[];
    setArmorOptions: React.Dispatch<React.SetStateAction<ArmorOption[]>>;
    filteredArmorOptions: ArmorOption[];
    setFilteredArmorOptions: React.Dispatch<React.SetStateAction<ArmorOption[]>>;
    newArmorTypes: string[];
    setNewArmorTypes: React.Dispatch<React.SetStateAction<string[]>>;
    newArmorClasses: number[];
    setNewArmorClasses: React.Dispatch<React.SetStateAction<number[]>>;
    newMaterials: string[];
    setNewMaterials: React.Dispatch<React.SetStateAction<string[]>>;

    defaultSelection_Ammo: AmmoOption | undefined;
    setDefaultSelection_Ammo: React.Dispatch<React.SetStateAction<AmmoOption | undefined>>;
    AmmoOptions: AmmoOption[];
    setAmmoOptions: React.Dispatch<React.SetStateAction<AmmoOption[]>>;
    ammoId: string;
    setAmmoId: React.Dispatch<React.SetStateAction<string>>;
    minDamage: number;
    setMinDamage: React.Dispatch<React.SetStateAction<number>>;
    smallestDamage: number;
    biggestDamage: number;
    minPenPower: number;
    setMinPenPower: React.Dispatch<React.SetStateAction<number>>;
    smallestPenPower: number;
    biggestPenPower: number;
    minArmorDamPerc: number;
    setArmorDamPerc: React.Dispatch<React.SetStateAction<number>>;
    smallestArmorDamPerc: number;
    biggestArmorDamPerc: number;
    traderLevel: number;
    setTraderLevel: React.Dispatch<React.SetStateAction<number>>;
    smallestTraderLevel: number;
    biggestTraderLevel: number;
    rateOfFire: number;
    setRateOfFire: React.Dispatch<React.SetStateAction<number>>;
    filteredAmmoOptions: AmmoOption[];
    setFilteredAmmoOptions: React.Dispatch<React.SetStateAction<AmmoOption[]>>;
    calibers: string[];
    setCalibers: React.Dispatch<React.SetStateAction<string[]>>;
    fullPower: string[];
    setFullPower: React.Dispatch<React.SetStateAction<string[]>>;
    intermediate: string[];
    setIntermediate: React.Dispatch<React.SetStateAction<string[]>>;
    pistol: string[];
    setPistol: React.Dispatch<React.SetStateAction<string[]>>;
    shotgun: string[];
    setShotgun: React.Dispatch<React.SetStateAction<string[]>>;

    chartData: BallisticHit[];
    setChartData: React.Dispatch<React.SetStateAction<BallisticHit[]>>;
    chartDataCustom: BallisticHit[];
    setChartDataCustom: React.Dispatch<React.SetStateAction<BallisticHit[]>>;
    result: NewArmorTestResult | undefined;
    setResult: React.Dispatch<React.SetStateAction<NewArmorTestResult | undefined>>;
}

/**
 * Provides the default object/values needed for the create context.
 */
const TbsStateStructure_Default: TbsStateStructure = {
    exampleValue: "",
    setExampleValue: () => { },
    armorId: "",
    setArmorId: () => { },
    armorDurabilityMax: 1,
    setArmorDurabilityMax: () => { },
    armorDurabilityNum: 1,
    setArmorDurabilityNum: () => { },
    defaultSelection_Armor: undefined,
    setDefaultSelection_Armor: () => { },
    ArmorOptions: [],
    setArmorOptions: () => { },
    filteredArmorOptions: [],
    setFilteredArmorOptions: () => { },
    newArmorTypes: [],
    setNewArmorTypes: () => { },
    newArmorClasses: [],
    setNewArmorClasses: () => { },
    newMaterials: [],
    setNewMaterials: () => { },
    defaultSelection_Ammo: undefined,
    setDefaultSelection_Ammo: () => { },
    AmmoOptions: [],
    setAmmoOptions: () => { },
    ammoId: "",
    setAmmoId: () => { },
    minDamage: 25,
    setMinDamage: () => { },
    smallestDamage: 25,
    biggestDamage: 192,
    minPenPower: 0,
    setMinPenPower: () => { },
    smallestPenPower: 0,
    biggestPenPower: 79,
    minArmorDamPerc: 0,
    setArmorDamPerc: () => { },
    smallestArmorDamPerc: 0,
    biggestArmorDamPerc: 89,
    traderLevel: 6,
    setTraderLevel: () => { },
    smallestTraderLevel: 1,
    biggestTraderLevel: 6,
    rateOfFire: 650,
    setRateOfFire: () => { },
    filteredAmmoOptions: [],
    setFilteredAmmoOptions: () => { },
    calibers: [
        "Caliber86x70",
        "Caliber127x55",
        "Caliber762x54R",
        "Caliber762x51",
        "Caliber762x39",
        "Caliber545x39",
        "Caliber556x45NATO",
        "Caliber762x35",
        "Caliber366TKM",
        "Caliber9x39",
        "Caliber46x30",
        "Caliber9x21",
        "Caliber57x28",
        "Caliber1143x23ACP",
        "Caliber9x19PARA",
        "Caliber9x18PM",
        "Caliber762x25TT",
        "Caliber9x33R",
        "Caliber12g",
        "Caliber23x75"
    ],
    setCalibers: () => { },
    fullPower: [
        "Caliber86x70",
        "Caliber127x55",
        "Caliber762x54R",
        "Caliber762x51"
    ],
    setFullPower: () => { },
    intermediate: [
        "Caliber762x39",
        "Caliber545x39",
        "Caliber556x45NATO",
        "Caliber762x35",
        "Caliber366TKM",
        "Caliber9x39"
    ],
    setIntermediate: () => { },
    pistol: [
        "Caliber46x30",
        "Caliber9x21",
        "Caliber57x28",
        "Caliber1143x23ACP",
        "Caliber9x19PARA",
        "Caliber9x18PM",
        "Caliber762x25TT",
        "Caliber9x33R"
    ],
    setPistol: () => { },
    shotgun: [
        "Caliber12g",
        "Caliber23x75"
    ],
    setShotgun: () => { },
    chartData: [],
    setChartData: () => { },
    chartDataCustom: [],
    setChartDataCustom: () => { },
    result: undefined,
    setResult: () => { }
};

/**
 * Gotta have this!
 */
export const TbsContext = createContext(TbsStateStructure_Default);

/**
 *  Just the props definition so that TS doesn't bitch at you.
 */
type TbsContextProviderProps = {
    children: any;
};

/**
 * Component that provides the context and manages its state. Put all of your 
 * page's state, functions and callbacks here.
 * @param children - The the child components that will go between the tags of this. 
 */
export const MwbContextProvider = ({ children }: TbsContextProviderProps) => {
    const [exampleValue, setExampleValue] = useState<string>("");


    const navigate = useNavigate();
    const { id_armor } = useParams();
    const { id_ammo } = useParams();

    //!Armor Stuff
    const [defaultSelection_Armor, setDefaultSelection_Armor] = useState<ArmorOption>();

    const [ArmorOptions, setArmorOptions] = useState<ArmorOption[]>([]);

    const [armorId, setArmorId] = useState("");
    const [armorDurabilityMax, setArmorDurabilityMax] = useState(1);
    const [armorDurabilityNum, setArmorDurabilityNum] = useState(1);

    const [filteredArmorOptions, setFilteredArmorOptions] = useState(ArmorOptions);

    const [newArmorTypes, setNewArmorTypes] = useState(ARMOR_TYPES);
    const handleNewArmorTypesTBG = (val: SetStateAction<string[]>) => setNewArmorTypes(val);

    const [newArmorClasses, setNewArmorClasses] = useState(ARMOR_CLASSES);
    const [newMaterials, setNewMaterials] = useState(MATERIALS);

    const armors = async () => {
        const response = await fetch(API_URL + '/GetArmorOptionsList');
        setArmorOptions(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        armors();
    }, [])
    // This useEffect will watch for a change to WeaponOptions or filter options, then update the filteredStockWeaponOptions
    useEffect(() => {
        setFilteredArmorOptions(filterArmorOptions(newArmorTypes, newArmorClasses, newMaterials, ArmorOptions));
    }, [newArmorTypes, ArmorOptions, newArmorClasses, newMaterials])

    const handleNewArmorClassesTBG = (val: SetStateAction<number[]>) => {
        if (val.length > 0) {
            setNewArmorClasses(val);
        }
    }

    const handleNewMaterialsTBG = (val: SetStateAction<string[]>) => {
        if (val.length > 0) {
            setNewMaterials(val);
        }
    }

    useEffect(() => {
        if (id_armor !== undefined && ArmorOptions.length > 0) {
            var temp = ArmorOptions.find((x) => x.value === id_armor)
            if (temp !== undefined) {
                handleArmorSelection(temp);
                setDefaultSelection_Armor(temp);
                // setArmorDurabilityMax(temp.maxDurability);
                // setArmorDurabilityNum(temp.maxDurability);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ArmorOptions, id_armor])

    //! Ammo Stuff
    const [defaultSelection_Ammo, setDefaultSelection_Ammo] = useState<AmmoOption>();

    const [AmmoOptions, setAmmoOptions] = useState<AmmoOption[]>([]);

    const [ammoId, setAmmoId] = useState("");

    const [minDamage, setMinDamage] = useState(25); // Need to make these values be drawn from something rather than magic numbers
    const [smallestDamage] = useState(25);
    const [biggestDamage] = useState(192);

    const [minPenPower, setMinPenPower] = useState(0); // Need to make these values be drawn from something rather than magic numbers
    const [smallestPenPower] = useState(0);
    const [biggestPenPower] = useState(79);

    const [minArmorDamPerc, setArmorDamPerc] = useState(0); // Need to make these values be drawn from something rather than magic numbers
    const [smallestArmorDamPerc] = useState(0);
    const [biggestArmorDamPerc] = useState(89);

    const [traderLevel, setTraderLevel] = useState(6); // Need to make these values be drawn from something rather than magic numbers
    const [smallestTraderLevel] = useState(1);
    const [biggestTraderLevel] = useState(6); // 5 is for FLea market, 6 is for FIR

    const [rateOfFire, setRateOfFire] = useState(650);


    const [filteredAmmoOptions, setFilteredAmmoOptions] = useState(AmmoOptions);

    const [calibers, setCalibers] = useState([
        "Caliber86x70",
        "Caliber127x55",
        "Caliber762x54R",
        "Caliber762x51",

        "Caliber762x39",
        "Caliber545x39",
        "Caliber556x45NATO",
        "Caliber762x35",
        "Caliber366TKM",
        "Caliber9x39",

        "Caliber46x30",
        "Caliber9x21",
        "Caliber57x28",
        "Caliber1143x23ACP",

        "Caliber9x19PARA",
        "Caliber9x18PM",
        "Caliber762x25TT",
        "Caliber9x33R",

        "Caliber12g",
        "Caliber23x75"
    ]);

    const FULL_POWER = ["Caliber86x70", "Caliber127x55", "Caliber762x54R", "Caliber762x51"];
    const FULL_POWER_DISPLAY = ["338 Lapua Mag", "12.7x55mm", "7.62x54mmR", "7.62x51mm"];
    const [fullPower, setFullPower] = useState(FULL_POWER);
    const handleNewFullpower = (val: SetStateAction<string[]>) => {
        setFullPower(val);

        const arr: any = [val, intermediate, pistol, shotgun].flat();
        setCalibers(arr)
    }

    const INTERMEDIATE = ["Caliber762x39", "Caliber545x39", "Caliber556x45NATO", "Caliber762x35", "Caliber366TKM", "Caliber9x39"];
    const INTERMEDIATE_DISPLAY = ["7.62x39", "5.45x39", "5.56x45", ".300 Blackout", ".366 TKM", "9x39"];
    const [intermediate, setIntermediate] = useState(INTERMEDIATE);
    const handleNewIntermediate = (val: SetStateAction<string[]>) => {
        setIntermediate(val);

        const arr: any = [fullPower, val, pistol, shotgun].flat();
        setCalibers(arr)
    }

    const PISTOL = ["Caliber46x30", "Caliber9x21", "Caliber57x28", "Caliber1143x23ACP", "Caliber9x19PARA", "Caliber9x18PM", "Caliber762x25TT", "Caliber9x33R"];
    const PISTOL_DISPLAY = ["4.6x30", "9x21", "5.7x28", ".45 ACP", "9x19", "9x18", "7.62 TT", ".357"];
    const [pistol, setPistol] = useState(PISTOL);
    const handleNewPistol = (val: SetStateAction<string[]>) => {
        setPistol(val);

        const arr: any = [fullPower, intermediate, val, shotgun].flat();
        setCalibers(arr)
    }

    const SHOTGUN = ["Caliber12g", "Caliber23x75"];
    const SHOTGUN_DISPLAY = ["12g", "23mm"];
    const [shotgun, setShotgun] = useState(SHOTGUN);
    const handleNewShotgun = (val: SetStateAction<string[]>) => {
        setShotgun(val);

        const arr: any = [fullPower, intermediate, pistol, val].flat();
        setCalibers(arr)
    }

    // Look at replacing item 2 with item 5 as you may not need item 2 in practice.
    //! Now that you know how to use useEffect, p[robs need to redo this whole area with it in mind.]
    // const AMMO_CALIBERS = [
    //     ["Full Rifle", fullPower, setFullPower, FULL_POWER, FULL_POWER_DISPLAY, handleNewFullpower],
    //     ["Intermediate Rifle", intermediate, setIntermediate, INTERMEDIATE, INTERMEDIATE_DISPLAY, handleNewIntermediate],
    //     ["PDW / Pistol", pistol, setPistol, PISTOL, PISTOL_DISPLAY, handleNewPistol],
    //     ["Shotgun", shotgun, setShotgun, SHOTGUN, SHOTGUN_DISPLAY, handleNewShotgun],
    // ] //     0        1         2          3         4                     5

    function handleMinDamageChange(input: number) {
        setMinDamage(input);
    }
    function handleMinPenPowerChange(input: number) {
        setMinPenPower(input);
    }
    function handleMinArmorDamPercChange(input: number) {
        setArmorDamPerc(input);
    }
    function handleTraderLevelChange(input: number) {
        setTraderLevel(input);
    }

    const ammos = async () => {
        const response = await fetch(API_URL + '/GetAmmoOptionsList');
        setAmmoOptions(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        ammos();
    }, [])
    // This useEffect will watch for a change to WeaponOptions or filter options, then update the filteredStockWeaponOptions
    useEffect(() => {
        setFilteredAmmoOptions(filterAmmoOptions(AmmoOptions, minDamage, minPenPower, minArmorDamPerc, traderLevel, calibers));
    }, [AmmoOptions, minDamage, minPenPower, minArmorDamPerc, traderLevel, calibers])

    useEffect(() => {
        if (id_ammo !== undefined && AmmoOptions.length > 0) {

            var temp = AmmoOptions.find((x) => x.value === id_ammo)
            if (temp !== undefined) {
                handleAmmoSelection(temp);
                setDefaultSelection_Ammo(temp);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [AmmoOptions, id_ammo])

    //! Request Data
    function requestData(_armorId: string, _ammoId: string) {
        // console.log("_armorId - requestData", _armorId)
        // console.log("_ammoId - requestData", _ammoId)
        const requestDetails = {
            armorId: _armorId,
            armorDurability: (armorDurabilityNum / armorDurabilityMax * 100),
            ammoId: _ammoId,
        }
        requestArmorTestSerires(requestDetails).then((response: NewArmorTestResult) => {
            // // console.log(response)
            setResult(response);
            setChartData(response.ballisticTest.hits);

        }).catch(error => {
            alert(`The error was: ${error}`);
            // // console.log(error);
        });
    }

    const [result, setResult] = useState<NewArmorTestResult>();
    const [chartData, setChartData] = useState<BallisticHit[]>([]);
    const [chartDataCustom, setChartDataCustom] = useState<BallisticHit[]>([]);

    //! Handle Selections - Got tired of scrolling  to find the damn things
    function handleArmorSelection(selectedOption: ArmorOption) {
        setArmorId(selectedOption.value);
        setArmorDurabilityMax(selectedOption.maxDurability!);
        setArmorDurabilityNum(selectedOption.maxDurability!);

        // console.log("armorId -hndlArmor", selectedOption.value)
        // console.log("ammoId -hndlArmor", ammoId)

        if (ammoId !== "") {
            requestData(selectedOption.value, ammoId)
            navigate(`${LINKS.ADC}/${selectedOption.value}/${ammoId}`);
        }
    }

    function handleAmmoSelection(selectedOption: AmmoOption) {
        setAmmoId(selectedOption.value);

        // console.log("armorId -hndlAmmo", armorId)
        // console.log("ammoId -hndlAmmo", selectedOption.value)

        if (armorId !== "") {
            requestData(armorId, selectedOption.value)
            navigate(`${LINKS.ADC}/${armorId}/${selectedOption.value}`);
        }
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        requestData(armorId, ammoId);
    }


    const TbsContextState: TbsStateStructure = useMemo(
        () => ({
            exampleValue,
            setExampleValue,
            armorId,
            setArmorId,
            armorDurabilityMax,
            setArmorDurabilityMax,
            armorDurabilityNum,
            setArmorDurabilityNum,
            defaultSelection_Armor,
            setDefaultSelection_Armor,
            ArmorOptions,
            setArmorOptions,
            filteredArmorOptions,
            setFilteredArmorOptions,
            newArmorTypes,
            setNewArmorTypes,
            newArmorClasses,
            setNewArmorClasses,
            newMaterials,
            setNewMaterials,
            defaultSelection_Ammo,
            setDefaultSelection_Ammo,
            AmmoOptions,
            setAmmoOptions,
            ammoId,
            setAmmoId,
            minDamage,
            setMinDamage,
            smallestDamage,
            biggestDamage,
            minPenPower,
            setMinPenPower,
            smallestPenPower,
            biggestPenPower,
            minArmorDamPerc,
            setArmorDamPerc,
            smallestArmorDamPerc,
            biggestArmorDamPerc,
            traderLevel,
            setTraderLevel,
            smallestTraderLevel,
            biggestTraderLevel,
            rateOfFire,
            setRateOfFire,
            filteredAmmoOptions,
            setFilteredAmmoOptions,
            calibers,
            setCalibers,
            fullPower,
            setFullPower,
            intermediate,
            setIntermediate,
            pistol,
            setPistol,
            shotgun,
            setShotgun,
            // AMMO_CALIBERS,
            chartData,
            setChartData,
            chartDataCustom,
            setChartDataCustom,
            result,
            setResult,
            // Add other state variables and setter functions as needed
        }),
        [ AmmoOptions, ArmorOptions, ammoId, armorDurabilityMax, armorDurabilityNum, armorId, biggestArmorDamPerc, biggestDamage, biggestPenPower, biggestTraderLevel, calibers, chartData, chartDataCustom, defaultSelection_Ammo, defaultSelection_Armor, exampleValue, filteredAmmoOptions, filteredArmorOptions, fullPower, intermediate, minArmorDamPerc, minDamage, minPenPower, newArmorClasses, newArmorTypes, newMaterials, pistol, rateOfFire, result, shotgun, smallestArmorDamPerc, smallestDamage, smallestPenPower, smallestTraderLevel, traderLevel]
    );

    return <TbsContext.Provider value={TbsContextState}>{children}</TbsContext.Provider>;
}