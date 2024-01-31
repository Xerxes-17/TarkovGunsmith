export interface WeaponsTableRow {
    id: string;
    name: string;
    imageLink: string;
    caliber: string;
  
    rateOfFire: number;
    baseErgonomics: number;
    baseRecoil: number;
  
    recoilDispersion: number;
    recoilAngle: number;
    deviationCurve: number;
    deviationMax: number;
  
    defaultErgonomics: number;
    defaultRecoil: number;
  
    price: number;
    traderLevel: number;
    fleaPrice: number;
  }
  
 export interface DevTarkovWeaponItem {
    id: string;
    name: string;
  
    properties: {
      caliber: string;
  
      fireRate: number;
      ergonomics: number;
      recoilVertical: number;
  
      recoilDispersion: number;
      recoilAngle: number;
      deviationCurve: number;
      deviationMax: number;
  
      defaultErgonomics: number;
      defaultRecoilVertical: number;
      defaultPreset: {
        id: string;
        name: string;
      };
    } | null;
  }