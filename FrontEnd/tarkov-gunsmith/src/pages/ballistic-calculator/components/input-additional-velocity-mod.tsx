import { NumberInput, Text } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";

export function AdditionalVelocityModifier() {
    const form = useBallisticCalculatorFormContext();

    const weaponVelo = form.values.dopeTableSelections.weaponObj?.velocityModifier ?? 0;
    const barrelVelo = form.values.dopeTableSelections.barrelObj?.velocityModifier ?? 0;
    const avm = form.values.additionalVelocityModifier;

    const addedVelo = !avm || typeof(avm) !== 'number' ? 0  : avm ;

    const currentTotal = 100 + weaponVelo + barrelVelo + addedVelo;

    const multiplier = currentTotal / 100
    if(multiplier !== form.values.finalVelocityModifier){
        form.setFieldValue("finalVelocityModifier", multiplier)
    }

    return (
        <NumberInput
            label={"Additional Velocity Modifier"}
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            precision={1}
            max={20}
            min={-20}
            step={.1}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            description={
                <Text size="sm">
                    Total: {currentTotal.toFixed(1)} / 100  = <b>{multiplier.toFixed(3)}</b>
                </Text>
            }
            {...form.getInputProps("additionalVelocityModifier")}
        />
    )
}