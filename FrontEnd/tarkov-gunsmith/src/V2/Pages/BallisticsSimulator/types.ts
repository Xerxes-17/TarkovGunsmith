import { v4 as uuidv4 } from 'uuid';

export const PRINT_ID = "printMe";

export type TargetZone = 'Head' | 'Thorax' | 'Stomach' | 'Arm';

export type ArmorLayer = {
  id: string,
  isPlate: boolean,
  armorClass: number,
  durability: number,
  maxDurability: number,
  armorMaterial: string, //TODO make a union string type
  bluntDamageThroughput: number,
}

export type BallisticSimulation = {
  penetration: number,
  damage: number,
  armorDamagePercentage: number,
  targetZone: TargetZone,
  hitPointsPool: number,
  maxLayers: number,
  armorLayers: ArmorLayer[]
}

export type BallisticSimulatorTab = {
    id: string
    title: string
    simulation?: BallisticSimulation //TODO remove the optional after development is done
}

export const createBallisticSimulatorTab = (
    title: string,
    simulation: any
  ): BallisticSimulatorTab => {
    return {
      id: uuidv4(),
      title,
      simulation,
    };
  };