import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import { requestWeaponBuild } from './Requests';
import { API_URL } from '../Util/util';
import { PurchaseOffer } from '../Components/AEC/AEC_Interfaces';
import { PostAddTwoTone } from '@mui/icons-material';

enum OfferType {
    None,
    Sell,
    Cash,
    Barter,
    Flea
}

enum fitPriority {
    MetaRecoil = "MetaRecoil",
    Recoil = "Recoil",
    MetaErgonomics = "MetaErgonomics",
    Ergonomics = "Ergonomics"
}

enum MuzzleType {
    Loud = "Loud",
    Quiet = "Quiet",
    Any = "Any"
}

export type TransmissionWeaponBuildResult = {
    AttachedModsFLat: TransmissionAttachedMod[],
    BaseErgo: number,
    BaseRecoil: number,
    Convergence: number,
    Details: string,
    FinalErgo: number,
    FinalRecoil: number,
    Id: string,
    RateOfFire: number,
    RecoilDispersion: number,
    SelectedPatron: SelectedPatron,
    ShortName: string,
    Valid: boolean,

    PresetPrice: number,
    SellBackValue: number,
    PurchasedModsCost: number,
    FinalCost: number
}

export type SelectedPatron = {
    ArmorDamagePerc: number,
    Damage: number,
    FragChance: number,
    Id: string,
    Penetration: number,
    ShortName: string
}

export type TransmissionAttachedMod = {
    Ergo: number,
    Id: string,
    RecoilMod: number,
    ShortName: string,
    PriceRUB: number
}

interface WeaponOption {
    ergonomics: number;
    recoilForceUp: number;
    recoilAngle: number;
    recoilDispersion: number;
    convergence: number;
    ammoCaliber: string;
    bFirerate: number;
    traderLevel: number;
    requiredPlayerLevel: number;
    value: string;
    readonly label: string;
    readonly imageLink: string;
    offerType: number;
    priceRUB: number;
}

interface BasePreset {
    Name: string;
    Id: string;
    WeaponId: string;
    Ergonomics: number;
    Recoil_Vertical: number;
    Weight: number;
    Weapon?: any;
    PurchaseOffer?: any;
    WeaponMods: any[];
}

export type Fitting = {
    Id: number;
    BasePresetId: string;
    BasePreset?: BasePreset;
    Ergonomics: number;
    Recoil_Vertical: number;
    Weight: number;
    TotalRubleCost: number;
    PurchasedModsCost: number;
    PresetModsRefund: number;
    IsValid: boolean;
    ValidityString: string;
    PurchasedModsHashId: string;
    PurchasedMods?: any;
    PurchasedAmmo?: any;
}

interface CurveDataPoint {
    level: number,
    recoil: number,
    ergo: number,
    price: number,
    penetration: number,
    damage: number,
    invalid: Boolean
};

type MwbStateStructure = {
    searchValue: string;
    setSearchValue: React.Dispatch<React.SetStateAction<string>>;
    playerLevel: number;
    setPlayerLevel: React.Dispatch<React.SetStateAction<number>>;
    weaponOptions: WeaponOption[];
    setWeaponOptions: React.Dispatch<React.SetStateAction<WeaponOption[]>>;
    purchaseOfferTypes: OfferType[];
    setPurchaseOfferTypes: React.Dispatch<React.SetStateAction<OfferType[]>>;
    checkedFlea: boolean;
    setCheckedFlea: React.Dispatch<React.SetStateAction<boolean>>;
    filteredWeaponOptions: WeaponOption[];
    setFilteredWeaponOptions: React.Dispatch<React.SetStateAction<WeaponOption[]>>;
    chosenGun: any;
    setChosenGun: React.Dispatch<React.SetStateAction<any>>;
    result: Fitting | undefined;
    setResult: React.Dispatch<React.SetStateAction<Fitting | undefined>>;
    praporLevel: number;
    setPraporLevel: React.Dispatch<React.SetStateAction<number>>;
    skierLevel: number;
    setSkierLevel: React.Dispatch<React.SetStateAction<number>>;
    mechanicLevel: number;
    setMechanicLevel: React.Dispatch<React.SetStateAction<number>>;
    peacekeeperLevel: number;
    setPeacekeeperLevel: React.Dispatch<React.SetStateAction<number>>;
    jaegerLevel: number;
    setJaegerLevel: React.Dispatch<React.SetStateAction<number>>;
    muzzleModeToggle: string;
    setMuzzleModeToggle: React.Dispatch<React.SetStateAction<'Loud' | 'Quiet' | 'Any'>>;
    fittingPriority: "MetaRecoil" | "Recoil" | "MetaErgonomics" | "Ergonomics";
    setFittingPriority: React.Dispatch<
        React.SetStateAction<"MetaRecoil" | "Recoil" | "MetaErgonomics" | "Ergonomics">
    >;
    fittingCurve: CurveDataPoint[] | undefined;
    setFittingCurve: React.Dispatch<
        React.SetStateAction<CurveDataPoint[] | undefined>
    >;
    waitingForCurve: boolean;
    setWaitingForCurve: React.Dispatch<React.SetStateAction<boolean>>;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    handleMDMChange: (val: any) => void;
    handleFPChange: (val: any) => void;
    handlePOTChange: (val: any) => void;
    filterStockWeaponOptions: (playerLevel: number) => WeaponOption[];
    handleSubmit: (e: any) => void;
    handlePlayerLevelChange: (input: number) => void;
    updateTraderLevels: (playerLevel: number) => void;
    handleWeaponSelectionChange: (selectedOption: any) => void;
    handleClose: () => void;
    handleShow: () => void;
};

const MwbStateStructure_Default: MwbStateStructure = {
    searchValue: "",
    setSearchValue: () => { },
    playerLevel: 15,
    setPlayerLevel: () => { },
    weaponOptions: [],
    setWeaponOptions: () => { },
    purchaseOfferTypes: [],
    setPurchaseOfferTypes: () => { },
    checkedFlea: false,
    setCheckedFlea: () => { },
    filteredWeaponOptions: [],
    setFilteredWeaponOptions: () => { },
    chosenGun: null,
    setChosenGun: () => { },
    result: undefined,
    setResult: () => { },
    praporLevel: 1,
    setPraporLevel: () => { },
    skierLevel: 1,
    setSkierLevel: () => { },
    mechanicLevel: 1,
    setMechanicLevel: () => { },
    peacekeeperLevel: 1,
    setPeacekeeperLevel: () => { },
    jaegerLevel: 1,
    setJaegerLevel: () => { },
    muzzleModeToggle: 'Loud',
    setMuzzleModeToggle: () => { },
    fittingPriority: "Recoil",
    setFittingPriority: () => { },
    fittingCurve: undefined,
    setFittingCurve: () => { },
    waitingForCurve: false,
    setWaitingForCurve: () => { },
    show: false,
    setShow: () => { },
    handleMDMChange: () => { },
    handleFPChange: () => { },
    handlePOTChange: () => { },
    filterStockWeaponOptions: () => [],
    handleSubmit: () => { },
    handlePlayerLevelChange: () => { },
    updateTraderLevels: () => { },
    handleWeaponSelectionChange: () => { },
    handleClose: () => { },
    handleShow: () => { },
};

// Create a new context
export const MwbContext = createContext(MwbStateStructure_Default);

// Component that provides the context and manages its state
type MwbContextProviderProps = {
    children: any;
};

// Component that provides the context and manages its state
export const MwbContextProvider = ({ children }: MwbContextProviderProps) => {
    const [searchValue, setSearchValue] = useState<string>("");
    const [playerLevel, setPlayerLevel] = useState(15);
    const [WeaponOptions, setWeaponOptions] = useState<WeaponOption[]>([]);
    const [PurchaseOfferTypes, setPurchaseOfferTypes] = useState([OfferType.Cash])
    const [checkedFlea, setCheckedFlea] = useState(false);

    const [chosenGun, setChosenGun] = useState<any>(null);
    const [result, setResult] = useState<Fitting>();
    const [MuzzleModeToggle, setMuzzleModeToggle] = useState<'Loud' | 'Quiet' | 'Any'>('Loud');
    const [FittingPriority, setFittingPriority] = useState<"MetaRecoil" | "Recoil" | "MetaErgonomics" | "Ergonomics">("Recoil");
    const [fittingCurve, setFittingCurve] = useState<CurveDataPoint[]>();
    const [waitingForCurve, setWaitingForCurve] = useState(false);
    const [show, setShow] = useState(false);

    const [praporLevel, setPraporLevel] = useState(1);
    const [skierLevel, setSkierLevel] = useState(1);
    const [mechanicLevel, setMechanicLevel] = useState(1);
    const [peacekeeperLevel, setPeacekeeperLevel] = useState(1);
    const [jaegerLevel, setJaegerLevel] = useState(1);

    function updateTraderLevels(playerLevel: number) {
        let prapor = 1;
        let skier = 1;
        let mechanic = 1;
        let peacekeeper = 1;
        let jaeger = 1;

        if (playerLevel >= 14) {
            peacekeeper = 2;
        }
        if (playerLevel >= 15) {
            prapor = 2;
            skier = 2;
            jaeger = 2;
        }
        if (playerLevel >= 20) {
            mechanic = 2;
        }

        // level 3 traders
        if (playerLevel >= 22) {
            jaeger = 3;
        }
        if (playerLevel >= 23) {
            peacekeeper = 3;
        }
        if (playerLevel >= 26) {
            prapor = 3;
        }
        if (playerLevel >= 28) {
            skier = 3;
        }
        if (playerLevel >= 30) {
            mechanic = 3;
        }

        // level 4 traders
        if (playerLevel >= 33) {
            jaeger = 4;
        }
        if (playerLevel >= 36) {
            prapor = 4;
        }
        if (playerLevel >= 37) {
            peacekeeper = 4;
        }
        if (playerLevel >= 38) {
            skier = 4;
        }
        if (playerLevel >= 40) {
            mechanic = 4;
        }

        setPraporLevel(prapor);
        setSkierLevel(skier);
        setMechanicLevel(mechanic);
        setPeacekeeperLevel(peacekeeper);
        setJaegerLevel(jaeger);
    }

    const handleMDMChange = (val: any) => setMuzzleModeToggle(val);
    const handleFPChange = (val: any) => setFittingPriority(val);
    const handlePOTChange = (val: any) => setPurchaseOfferTypes(val);
    const handlePlayerLevelChange = (val: number) => {
        setPlayerLevel(val);
        if(val < 15 && PurchaseOfferTypes.some((x)=> x === OfferType.Flea)){
            const POTS = PurchaseOfferTypes.filter((x)=>x !== OfferType.Flea)
            setPurchaseOfferTypes(POTS)
        }
    }



    const handleSubmit = useCallback(
        (e: any) => {
            e.preventDefault();
            //console.log(chosenGun)
            const parsed = fitPriority[FittingPriority];

            const requestDetails = {
                level: playerLevel,
                priority: parsed,
                muzzleMode: MuzzleType[MuzzleModeToggle],
                presetId: chosenGun,
                flea: checkedFlea,
            };
            //console.log(requestDetails)
            requestWeaponBuild(requestDetails)
                .then((response) => {
                    setResult(response);
                })
                .catch((error) => {
                    alert(`The error was: ${error}`);
                });

            // const curveRequestDetails = {
            //     presetID: chosenGun.value,
            //     mode: FittingPriority,
            //     muzzleMode: MuzzleModeToggle,
            //     purchaseType: chosenGun.offerType
            // }
            // setWaitingForCurve(true);
            // requestWeaponDataCurve(curveRequestDetails).then(response => {
            //     setWaitingForCurve(false);
            //     setFittingCurve(response);
            //     // // console.log(response);
            // }).catch(error => {
            //     alert(`The error was: ${error}`);
            //     setWaitingForCurve(false);
            // });
        },
        [
            playerLevel,
            FittingPriority,
            MuzzleModeToggle,
            chosenGun,
            checkedFlea,
            setResult,
        ]
    );

    const filterStockWeaponOptions = useCallback(
        () => {
            const result = WeaponOptions.filter(
                (item) => item.requiredPlayerLevel <= playerLevel
                    && PurchaseOfferTypes.includes(item.offerType)
            );
            return result;
        },
        [WeaponOptions, playerLevel, PurchaseOfferTypes]
    );

    const [filteredStockWeaponOptions, setFilteredStockWeaponOptions] = useState(filterStockWeaponOptions());

    const handleWeaponSelectionChange = (selectedOption: any) => {
        if (selectedOption !== undefined || selectedOption !== null) {
            setChosenGun(selectedOption)
            setSearchValue(selectedOption.Label)
            // // console.log(`Option selected:`, selectedOption);
        }
        else {
            setChosenGun(undefined)
            setSearchValue("")
        }
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const weapons = async () => {
        const response = await fetch(API_URL + '/GetWeaponOptionsList');
        // // console.log(response)
        setWeaponOptions(await response.json())
    }

    // This useEffect will update the WeaponOptions with the result from the async API call
    useEffect(() => {
        weapons();
    }, [])

    // This useEffect will watch for a change to WeaponOptions or playerLevel, then update the filteredStockWeaponOptions
    // It will also update the chosen gun and search value if they aren't in the new filtered list.
    useEffect(() => {
        const result = WeaponOptions.filter(item => item.requiredPlayerLevel <= playerLevel
            && PurchaseOfferTypes.includes(item.offerType)
        )
        if (!result.some((x) => x.value === chosenGun)) {
            setChosenGun(undefined);
            setSearchValue("");
        }

        setFilteredStockWeaponOptions(result)
    }, [WeaponOptions, playerLevel, PurchaseOfferTypes, chosenGun])

    useEffect(() => {
        updateTraderLevels(playerLevel)
    }, [playerLevel])



    // State variables...
    const MwbContextState: MwbStateStructure = useMemo(
        () => ({
            searchValue,
            setSearchValue,
            playerLevel,
            setPlayerLevel,
            weaponOptions: WeaponOptions,
            setWeaponOptions,
            purchaseOfferTypes: PurchaseOfferTypes,
            setPurchaseOfferTypes,
            checkedFlea,
            setCheckedFlea,
            filteredWeaponOptions: filteredStockWeaponOptions,
            setFilteredWeaponOptions: setFilteredStockWeaponOptions,
            chosenGun,
            setChosenGun,
            result,
            setResult,
            praporLevel,
            setPraporLevel,
            skierLevel,
            setSkierLevel,
            mechanicLevel,
            setMechanicLevel,
            peacekeeperLevel,
            setPeacekeeperLevel,
            jaegerLevel,
            setJaegerLevel,
            muzzleModeToggle: MuzzleModeToggle,
            setMuzzleModeToggle,
            fittingPriority: FittingPriority,
            setFittingPriority,
            fittingCurve,
            setFittingCurve,
            waitingForCurve,
            setWaitingForCurve,
            show,
            setShow,
            handleMDMChange,
            handleFPChange,
            handlePOTChange,
            filterStockWeaponOptions,
            handleSubmit,
            handlePlayerLevelChange,
            updateTraderLevels,
            handleWeaponSelectionChange,
            handleClose,
            handleShow,
        }),
        [
            searchValue,
            playerLevel,
            WeaponOptions,
            PurchaseOfferTypes,
            checkedFlea,
            filteredStockWeaponOptions,
            chosenGun,
            result,
            praporLevel,
            skierLevel,
            mechanicLevel,
            peacekeeperLevel,
            jaegerLevel,
            MuzzleModeToggle,
            FittingPriority,
            fittingCurve,
            waitingForCurve,
            show,
            filterStockWeaponOptions,
            handleSubmit,
        ]
    );

    return <MwbContext.Provider value={MwbContextState}>{children}</MwbContext.Provider>;

};