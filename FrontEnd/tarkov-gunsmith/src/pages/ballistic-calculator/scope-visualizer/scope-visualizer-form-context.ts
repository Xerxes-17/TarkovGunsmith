import { createFormContext, yupResolver } from "@mantine/form";

import * as yup from "yup";

export type ReticleType = "MOA lines" | "Simple Crosshair"

export interface ScopeVisualizerFormValues {
    selectedDistance: string;
    distance: number;
    dropCm: number;
    dispersionCm: number;
    zoom: number;
    opticMarkFudgeFactor: number;
    reticleType: ReticleType;
    showRealMoaScale: boolean;
}

// todo finish this schema
export const scopeVisualizerFormValidationSchema = yup.object({
    selectedDistance: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .required("selectedDistance is required"),
    dropCm: yup
      .number()
      .required()
})

export const scopeVisualizerFormYupValidator = yupResolver(scopeVisualizerFormValidationSchema);

export const [
  ScopeVisualizerFormContextProvider,
  UseScopeVisualizerFormContext,
  useScopeVisualizerForm,
] = createFormContext<ScopeVisualizerFormValues>();