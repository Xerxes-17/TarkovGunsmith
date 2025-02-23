import { BallisticSimInput } from "./ballistic-calculator-form-context";

export interface DropCalculatorInput {
  defaultAmmoInput: BallisticSimInput;
  secondAmmoInput: BallisticSimInput;
  calibrationDistances: number[];
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
}

export interface DopeTableUI_Weapon {
  id: string;
  shortName: string;
  defaultAmmo: DopeTableUI_Ammo;
  velocityModifier: number;
  possibleBarrels: DopeTableUI_Barrel[];
}

export interface DopeTableUI_Barrel {
  id: string;
  shortName: string;
  velocityModifier: number;
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
  MilliradiansOfDrop: number
}

export function ConvertBSDPtoBCTR(input: BallisticSimDataPoint): BallisticCalculatorTableRow {

  if(input.Distance === 0)
    return {...input, MilliradiansOfDrop: 0 }

  const milliradiansFactor: number = input.Distance / 10; 
  const dropInCm: number = input.Drop * 100; // Drop is in M

  const milliradiansOfDrop: number = dropInCm / milliradiansFactor

  const output: BallisticCalculatorTableRow = {...input, MilliradiansOfDrop: milliradiansOfDrop }
  return output
}

export interface BallisticSimOutput {
  AmmoId: string;
  DataPoints: BallisticSimDataPoint[];
}

export interface SimulationToCalibrationDistancePair{
  Distance: number,
  output: BallisticSimOutput
}
