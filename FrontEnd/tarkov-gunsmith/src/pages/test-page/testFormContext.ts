import { createFormContext, yupResolver } from "@mantine/form";

import * as yup from "yup";

export interface TestFormValues {
    stringField: string;
    distance: number;
    selectedDistance: string
    dropCm: number;
    dispersionCm: number;
    zoom: number;
    milsMultiplier: number;
    reticleType: string;
    shiftX: number;
    shiftY: number;
}

export const testFormValidationSchema = yup.object({
    stringField: yup
    .string()
    .trim()
    .transform((value) => (value === "" ? undefined : value))
    .required("stringField is required"),
    numberField: yup
      .number()
      .required()
})

export const testFormYupValidator = yupResolver(testFormValidationSchema);


export const [
  TestFormContextProvider,
  UseTestFormContext,
  useTestForm,
] = createFormContext<TestFormValues>();