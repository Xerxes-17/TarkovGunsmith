import { Group, NumberInput } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";

export function InputMaxDistance() {
    const form = useBallisticCalculatorFormContext();
    const minMaxDistance = parseInt(form.values.dopeTableSelections.calibration)

    return (
        <Group spacing="xs" >
            <NumberInput
                w={140}
                label={"Max Distance (m)"}
                precision={0}
                max={2000}
                min={minMaxDistance}
                step={10}
                stepHoldDelay={500}
                stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                {...form.getInputProps("maxDistance")}
            />
        </Group>

    )
}