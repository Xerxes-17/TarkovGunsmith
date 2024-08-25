import { createFormContext, yupResolver } from "@mantine/form";
import {
  DopeTableUI_Ammo,
  DopeTableUI_Barrel,
  DopeTableUI_Caliber,
  DopeTableUI_Options,
  DopeTableUI_Weapon,
} from "./types";

import * as yup from "yup";

export const balCalValidationSchema = yup.object({
  dopeTableSelections: yup.object({
    caliberName: yup
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .required("Caliber is required"),
    weaponId: yup
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .required("Weapon is required"),
    barrelId: yup
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .required("Barrel is required"),
    calculationAmmoId: yup
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .required("Calculation Ammo is required"),
  }),
});

export const balCalYupValidator = yupResolver(balCalValidationSchema);

export interface BallisticSimInput {
  AmmoId: string;
  BulletMass: number;
  BulletDiameterMillimeters: number;
  BallisticCoeficient: number;
  InitialSpeed: number;
  MaxDistance: number;
  Damage: number;
  Penetration: number;
}

export interface BallisticCalculatorFormValues {
  dopeTableOptions: DopeTableUI_Options;
  dopeTableSelections: {
    caliberName: string;
    caliberObj?: DopeTableUI_Caliber;

    weaponId: string;
    weaponObj?: DopeTableUI_Weapon;

    barrelId: string;
    barrelObj?: DopeTableUI_Barrel;

    defaultAmmo?: DopeTableUI_Ammo;

    calculationAmmoId: string;
    calculationAmmoObj?: DopeTableUI_Ammo;

    calibration: string;
  };
  maxDistance: number;
  additionalVelocityModifier: number;
  finalVelocityModifier: number;
}

export const [
  BallisticCalculatorFormProvider,
  useBallisticCalculatorFormContext,
  useBallisticCalculatorForm,
] = createFormContext<BallisticCalculatorFormValues>();
