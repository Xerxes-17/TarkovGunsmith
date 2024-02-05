// form-context.ts file
import { createFormContext } from '@mantine/form';
import { ArmorMaterialDestructibilitySelect } from '../../Api/ArmorApiCalls';

interface BallisticSimulatorFormValues {
  penetration: number;
  damage: number;
  armorDamagePercentage: number;

  hitPointsPool: number;

  armorClass: number;
  durability: number;
  maxDurability: number;
  armorMaterial: string;
  bluntDamageThroughput: number;
}

// You can give context variables any name
export const [BallisticSimulatorFormProvider, useBallisticSimulatorFormContext, useBallisticSimulatorForm] =
  createFormContext<BallisticSimulatorFormValues>();