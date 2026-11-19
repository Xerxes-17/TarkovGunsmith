import { BallisticSimInput } from "./ballistic-calculator-form-context";

export interface DropCalculatorInput {
  defaultAmmoInput: BallisticSimInput;
  secondAmmoInput: BallisticSimInput;
  calibrationDistances: number[];
  lineOfSightOverBore: number;
}

export interface DropCalculatorInputWithMeta extends DropCalculatorInput {
    caliberName: string;
    weaponId: string;
    barrelId: string;
}

export interface DopeTableUI_Options {
  calibers: DopeTableUI_Caliber[];
  calibrationRanges: number[];
  maxMaxDistance: number;
}

export interface DopeTableUI_Caliber {
  caliberName: string;
  allAmmosOfCaliber: DopeTableUI_Ammo[];
  weaponsOfCaliber: DopeTableUI_Weapon[];
}

export interface DopeTableUI_Ammo {
  ammoLabel: string;
  stats: DopeTableUI_AmmoStats;
}

export interface DopeTableUI_AmmoStats {
  id: string;
  name: string;
  initialSpeed: number;
  ballisticCoefficient: number;
  bulletDiameterMillimeters: number;
  bulletMass: number;
  penetration: number;
  damage: number;
  accuracyModifier: number;
}

export interface DopeTableUI_Weapon {
  id: string;
  shortName: string;
  defaultAmmo: DopeTableUI_Ammo;
  velocityModifier: number;
  centerOfImpact: number
  possibleBarrels: DopeTableUI_Barrel[];
}

export interface DopeTableUI_Barrel {
  id: string;
  shortName: string;
  velocityModifier: number;
  centerOfImpact: number
}

export interface BallisticSimDataPoint {
  Distance: number;
  Penetration: number;
  Damage: number;
  Speed: number;
  Drop: number;
  TimeOfFlight: number;
}

export interface BallisticCalculatorTableRow extends BallisticSimDataPoint {
  MilliradiansOfDrop: number,
  MaxDispersion: number
}

export function ConvertBSDPtoBCTR(input: BallisticSimDataPoint, totalWeaponAccuracyCRads: number): BallisticCalculatorTableRow {
  if(input.Distance === 0)
    return {...input, MilliradiansOfDrop: 0, MaxDispersion: 0 }

  const milliradiansFactor: number = input.Distance / 10; 
  const dropInCm: number = input.Drop * 100; // Drop is in M

  const milliradiansOfDrop: number = dropInCm / milliradiansFactor

  const maxDispersionInCm = input.Distance * totalWeaponAccuracyCRads;

  const output: BallisticCalculatorTableRow = {...input, MilliradiansOfDrop: milliradiansOfDrop, MaxDispersion: maxDispersionInCm}
  return output
}

export interface BallisticSimOutput {
  AmmoId: string;
  totalWeaponAccuracyCRads: number;
  DataPoints: BallisticSimDataPoint[];
}



export interface SimulationToCalibrationDistancePair{
  Distance: number,
  output: BallisticSimOutput
}

export interface BDC_Result{
  resultString: string,
  totalWeaponAccuracyCRads: number;
  dataPoints: SimulationToCalibrationDistancePair[];
}

export const TARKOV_100M_MOA_CM = 2.909

export function bsgAmmoFactor(ammoAcc: number){
  if(ammoAcc <= 0){
    return ((100 + Math.abs(ammoAcc)) / 100)
  }
  return (100 / (100 + ammoAcc))
}

export function getTarkovMOA(baseAccuracy: number, ammoAcc:number, additionalAccMod: number){
  return  ( 100 * baseAccuracy * bsgAmmoFactor(ammoAcc) * additionalAccMod ) / TARKOV_100M_MOA_CM
}

export function getModifiedCRadForResults(baseAccuracy: number, ammoAcc:number, additionalAccMod: number){
  return baseAccuracy * bsgAmmoFactor(ammoAcc) * additionalAccMod
}

