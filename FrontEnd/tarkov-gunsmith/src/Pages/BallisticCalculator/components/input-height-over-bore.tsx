import { Group, NumberInput } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";

export function InputHeightOverBore() {
    const form = useBallisticCalculatorFormContext();

    return (
        <Group spacing="xs" >
            <NumberInput
                w={149}
                label={"Height Over Bore (mm)"}
                precision={2}
                max={2000}
                min={1}
                step={1}
                stepHoldDelay={500}
                stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                {...form.getInputProps("lineOfSightOverBore")}
            />
        </Group>

    )
}