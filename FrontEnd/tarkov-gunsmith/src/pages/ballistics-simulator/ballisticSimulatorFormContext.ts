// form-context.ts file
import { createFormContext } from '@mantine/form';
import { TargetZone } from './TargetUiAlternate';

export interface FormArmorLayer{
  id: string;
  isPlate: boolean;
  armorClass: number;
  bluntDamageThroughput: number;
  durability: number;
  maxDurability: number;
  armorMaterial: string; 
}


export interface BallisticSimulatorFormValues {
  penetration: number;
  damage: number;
  armorDamagePercentage: number;
  targetZone: TargetZone;
  hitPointsPool: number;
  maxLayers: number;
  armorLayers: FormArmorLayer[];
}

// You can give context variables any name
export const [BallisticSimulatorFormProvider, useBallisticSimulatorFormContext, useBallisticSimulatorForm] =
  createFormContext<BallisticSimulatorFormValues>();