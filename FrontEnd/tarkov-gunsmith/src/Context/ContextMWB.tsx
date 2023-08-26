import React, { createContext, useState, useMemo, useEffect, useCallback } from 'react';
import { requestWeaponBuild } from './Requests';
import { API_URL } from '../Util/util';
import { OfferType } from '../Components/AEC/AEC_Interfaces';
import { WeaponOption, CurveDataPoint, fitPriority, MuzzleType, RowSelection } from '../Components/MWB/types';
import { Fitting } from '../Components/MWB/WeaponData';



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
    handleSubmit: () => void;
    handlePlayerLevelChange: (input: number) => void;
    updateTraderLevels: (playerLevel: number) => void;
    handleWeaponSelectionChange: (selectedOption: any) => void;
    handleClose: () => void;
    handleShow: () => void;
    excludedMods: any[];
    setExcludedMods: React.Dispatch<React.SetStateAction<any[]>>;
    pagination: any;
    picturesYesNo: boolean;
    setPicturesYesNo: React.Dispatch<React.SetStateAction<boolean>>;
    rowSelectionAttached:RowSelection;
    setRowSelectionAttached :React.Dispatch<React.SetStateAction<RowSelection>>;
    rowSelectionExcluded:RowSelection;
    setRowSelectionExcluded:React.Dispatch<React.SetStateAction<RowSelection>>;
    handleRemoveFromExcludedMods: () => void
    handleAddToExcludedMods: () => void
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
    excludedMods: [],
    setExcludedMods: () => { },
    pagination: {},
    picturesYesNo: false,
    setPicturesYesNo: () => { },
    rowSelectionAttached:{},
    setRowSelectionAttached :() => { },
    rowSelectionExcluded:{},
    setRowSelectionExcluded:() => { },
    handleRemoveFromExcludedMods: () => { },
    handleAddToExcludedMods: () => { },
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
    const [excludedMods, setExcludedMods] = useState<any[]>([]);
    const [picturesYesNo, setPicturesYesNo] = useState(false);

    const [praporLevel, setPraporLevel] = useState(1);
    const [skierLevel, setSkierLevel] = useState(1);
    const [mechanicLevel, setMechanicLevel] = useState(1);
    const [peacekeeperLevel, setPeacekeeperLevel] = useState(1);
    const [jaegerLevel, setJaegerLevel] = useState(1);

    //store pagination state in your own state
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 50, //customize the default page size
    });

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
    const handlePlayerLevelChange = useCallback(
        (val: number) => {
            setPlayerLevel(val);
            if (val < 15 && PurchaseOfferTypes.some((x) => x === OfferType.Flea)) {
                const POTS = PurchaseOfferTypes.filter((x) => x !== OfferType.Flea);
                setPurchaseOfferTypes(POTS);
            }
        },
        [setPlayerLevel, PurchaseOfferTypes, setPurchaseOfferTypes]
    );

    const handleSubmit = useCallback(
        () => {
            //console.log(chosenGun)
            const parsed = fitPriority[FittingPriority];
            //console.log(excludedMods);

            const requestDetails = {
                PlayerLevel: playerLevel,
                Priority: parsed,
                MuzzleMode: MuzzleType[MuzzleModeToggle],
                PresetId: chosenGun,
                Flea: checkedFlea,
                ExcludedIds: excludedMods.map((entry) => entry.WeaponMod.Id)
            };
            // console.log('requestDetails',requestDetails)
            requestWeaponBuild(requestDetails)
                .then((response) => {
                    const parsed = JSON.parse(response)
                    // console.log("parsed", parsed)
                    setResult(parsed);
                })
                .catch((error) => {
                    alert(`The error was: ${error}`);
                });
        },
        [
            playerLevel,
            FittingPriority,
            MuzzleModeToggle,
            chosenGun,
            checkedFlea,
            excludedMods,
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


    useEffect(() => {
        // handleSubmit()
        console.log("excludedMods", excludedMods)
    }, [excludedMods,handleSubmit])


    // useEffect(() => {
    //     setExcludedMods([])
    // }, [result?.BasePreset])


    const [rowSelectionAttached, setRowSelectionAttached] = useState<RowSelection>({});
    const [rowSelectionExcluded, setRowSelectionExcluded] = useState<RowSelection>({});

    // State variables...
    const MwbContextState: MwbStateStructure = useMemo(
        () => ({
            rowSelectionAttached, setRowSelectionAttached,
            rowSelectionExcluded, setRowSelectionExcluded,
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
            excludedMods, setExcludedMods, pagination, picturesYesNo, setPicturesYesNo, 

            handleRemoveFromExcludedMods() {
                console.log(rowSelectionExcluded);
        
                if (excludedMods !== undefined) {
                    console.log(excludedMods);
        
                    const selectedIds = Object.keys(rowSelectionExcluded).filter((id) => rowSelectionExcluded[id]);
        
                    const updatedExcludedMods = excludedMods.filter((entry) => !selectedIds.includes(entry.WeaponMod.Id));
        
                    console.log(updatedExcludedMods);
                    setExcludedMods(updatedExcludedMods);
                    setRowSelectionExcluded({})
                }
            },
            handleAddToExcludedMods() {
                console.log(rowSelectionAttached);
              
                if (result !== undefined) {
                  console.log(result.PurchasedMods.List);
                  const list = result.PurchasedMods.List as any[];
              
                  const selected = list.filter((entry) =>
                    rowSelectionAttached.hasOwnProperty(entry.WeaponMod.Id) && rowSelectionAttached[entry.WeaponMod.Id]
                  );
        
                  console.log(selected);
                  const prev = excludedMods;
                  const newList = [...prev!, ...selected];
              
                  // Concatenate selected entries with the current excludedMods array
                  setExcludedMods(newList);
                  setRowSelectionAttached({})
                }
              }

        }),
        [
            rowSelectionAttached, setRowSelectionAttached,
            rowSelectionExcluded, setRowSelectionExcluded,
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
            handlePlayerLevelChange,
            excludedMods, setExcludedMods, pagination, picturesYesNo, setPicturesYesNo
        ]
    );

    return <MwbContext.Provider value={MwbContextState}>{children}</MwbContext.Provider>;

};