import { Grid, Group, Input, NumberInput, Text } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";

export function InputMaxDistance() {
    const form = useBallisticCalculatorFormContext();
    const minMaxDistance = parseInt(form.values.dopeTableSelections.calibration)

    const calibrationRangesJoin = form.values.dopeTableOptions.calibrationRanges
        .filter(x => x <= form.values.maxDistance)
        .join(", ");

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
            <Grid pl={8} grow>
                <Grid.Col pl={5} span={6}>
                    <Input.Label>Calibrations: </Input.Label>
                    <Text size={"xs"} pt={6} pb={6}>{calibrationRangesJoin}.</Text>
                </Grid.Col>
            </Grid>
        </Group>

    )
}