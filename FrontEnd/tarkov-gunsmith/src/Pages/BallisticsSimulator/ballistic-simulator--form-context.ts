// form-context.ts file
import { createFormContext } from '@mantine/form';
import { ArmorMaterialDestructibilitySelect } from '../../Api/ArmorApiCalls';

export interface FormArmorLayer{
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

  hitPointsPool: number;

  armorLayers: FormArmorLayer[];
}

// You can give context variables any name
export const [BallisticSimulatorFormProvider, useBallisticSimulatorFormContext, useBallisticSimulatorForm] =
  createFormContext<BallisticSimulatorFormValues>();