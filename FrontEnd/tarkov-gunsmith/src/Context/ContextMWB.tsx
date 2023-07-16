import React, { createContext, useContext, useState, useMemo } from 'react';

enum OfferType {
    None,
    Sell,
    Cash,
    Barter,
    Flea
}

enum fitPriority
{
    MetaRecoil = "MetaRecoil",
    Recoil = "Recoil",
    MetaErgonomics = "MetaErgonomics",
    Ergonomics= "Ergonomics"
}

enum MuzzleType
{
    Loud,
    Quiet,
    Any
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
    offerType: OfferType;
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
    muzzleModeToggle: number;
    setMuzzleModeToggle: React.Dispatch<React.SetStateAction<number>>;
    fittingPriority: "MetaRecoil" | "Recoil" | "MetaErgonomics" | "Ergonomics";
    setFittingPriority: React.Dispatch<React.SetStateAction<"MetaRecoil" | "Recoil" | "MetaErgonomics" | "Ergonomics">>;
    fittingCurve: CurveDataPoint[] | undefined;
    setFittingCurve: React.Dispatch<React.SetStateAction<CurveDataPoint[] | undefined>>;
    waitingForCurve: boolean;
    setWaitingForCurve: React.Dispatch<React.SetStateAction<boolean>>;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
  };

const MwbStateStructure_Default: MwbStateStructure = {
    playerLevel: 15,
    setPlayerLevel: () => {},
    weaponOptions: [],
    setWeaponOptions: () => {},
    purchaseOfferTypes: [OfferType.Cash],
    setPurchaseOfferTypes: () => {},
    checkedFlea: false,
    setCheckedFlea: () => {},
    filteredWeaponOptions: [],
    setFilteredWeaponOptions: () => {},
    chosenGun: null,
    setChosenGun: () => {},
    result: undefined,
    setResult: () => {},
    praporLevel: 1,
    setPraporLevel: () => {},
    skierLevel: 1,
    setSkierLevel: () => {},
    mechanicLevel: 1,
    setMechanicLevel: () => {},
    peacekeeperLevel: 1,
    setPeacekeeperLevel: () => {},
    jaegerLevel: 1,
    setJaegerLevel: () => {},
    muzzleModeToggle: 1,
    setMuzzleModeToggle: () => {},
    fittingPriority: "Recoil",
    setFittingPriority: () => {},
    fittingCurve: undefined,
    setFittingCurve: () => {},
    waitingForCurve: false,
    setWaitingForCurve: () => {},
    show: false,
    setShow: () => {},
  };


// Create a new context
const MwbContext = createContext(MwbStateStructure_Default);

// Component that provides the context and manages its state
type MwbContextProviderProps = {
    children: any;
  };

// Component that provides the context and manages its state
const MwbContextProvider = ({ children } : MwbContextProviderProps) => {
    const [playerLevel, setPlayerLevel] = useState(15); // Need to make these values be drawn from something rather than magic numbers
    const [WeaponOptions, setWeaponOptions] = useState<WeaponOption[]>([]);

    const [PurchaseOfferTypes, setPurchaseOfferTypes] = useState([OfferType.Cash])

    const [checkedFlea, setCheckedFlea] = useState(false);
    const [filteredStockWeaponOptions, setFilteredStockWeaponOptions] = useState(filterStockWeaponOptions(playerLevel));

    const [chosenGun, setChosenGun] = useState<any>(null);

    const [result, setResult] = useState<Fitting>();
    const [praporLevel, setPraporLevel] = useState(1);
    const [skierLevel, setSkierLevel] = useState(1);
    const [mechanicLevel, setMechanicLevel] = useState(1);
    const [peacekeeperLevel, setPeacekeeperLevel] = useState(1);
    const [jaegerLevel, setJaegerLevel] = useState(1);
    const [MuzzleModeToggle, setMuzzleModeToggle] = useState(1);
    const handleMDMChange = (val: any) => setMuzzleModeToggle(val);

    const [FittingPriority, setFittingPriority] = useState<"MetaRecoil" | "Recoil" | "MetaErgonomics" | "Ergonomics">("Recoil");
    const handleFPChange = (val: any) => setFittingPriority(val);

    const [fittingCurve, setFittingCurve] = useState<CurveDataPoint[]>();
    const [waitingForCurve, setWaitingForCurve] = useState(false);
    const [show, setShow] = useState(false);


    const handlePOTChange = (val: any) => setPurchaseOfferTypes(val);
    function filterStockWeaponOptions(playerLevel: number) {
        const result = WeaponOptions.filter(item =>
            item.requiredPlayerLevel <= playerLevel
        )
        // Expand on this later.
        return result;
    }




// State variables...
const MwbContextState: MwbStateStructure = useMemo(
    () => ({
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
    }),
    [
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
    ]
  );
  
  return <MwbContext.Provider value={MwbContextState}>{children}</MwbContext.Provider>;
  
  };