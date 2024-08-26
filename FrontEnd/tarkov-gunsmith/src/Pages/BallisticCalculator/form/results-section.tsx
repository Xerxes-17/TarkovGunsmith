import { BallisticSimDataPoint, SimulationToCalibrationDistancePair } from "../types";
import { Box, Flex, Grid, Group, Loader, Select, Stack, Text } from "@mantine/core";
import { BallisticCalculatorResultTable } from "../../../Components/Common/Tables/tgTables/ballistic-calculator-results";
import { BallisticEnergyChart } from "../../../Components/Common/Graphs/Charts/BallisticEnergyChart";
import { BallisticDropLineChart } from "../../../Components/Common/Graphs/Charts/BallisticDropChart";
import { useState } from "react";


export function DopeResultSection({ result, isLoading, resultString }: { result: SimulationToCalibrationDistancePair[], isLoading: boolean, resultString: string }) {
    const calibrations = result?.map(x => x.Distance);
    const options = calibrations?.map(value => {
        return {
            value: value.toString(),
            label: `${value} m`
        }
    }) ?? [];

    const [selectedCalibration, setSelectedCalibration] = useState<string>("50");

    const [selectedData, setSelectedData] = useState<BallisticSimDataPoint[]>(result?.[0].output.DataPoints);

    if (isLoading) {
        return (
            <Stack spacing={2} mb={5} align="center">
                <Loader size="xl" variant="bars" />
                <Text>Loading, please be patient.</Text>
            </Stack>
        )
    }

    if (!result) {
        return null;
    }

    return (
        <Grid>
            <Grid.Col span={12}>
                <Group>
                    <Select
                        w={140}
                        label="Calibration Distance"
                        placeholder="Select"
                        data={options}
                        value={selectedCalibration}
                        onChange={(value) => {
                            if (typeof (value) === "string") {
                                setSelectedCalibration(value);
                                const index = options.findIndex(x => x.value === value) ?? 0;
                                setSelectedData(result?.[index].output.DataPoints);
                            }
                        }}
                    />
                    <Text pt={24}>{resultString}</Text>
                </Group>
            </Grid.Col>

            <Grid.Col span={6}>
                <Stack spacing={2}>
                    {selectedData && (
                        <BallisticCalculatorResultTable result={selectedData} />
                    )}

                </Stack >
            </Grid.Col>

            <Grid.Col span={12} xl={6}>
                <Flex
                    gap="md"
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    wrap="wrap"
                >
                    <Box w={600} h={400}>
                        {selectedData && (
                            <BallisticDropLineChart resultData={selectedData} selectedCalibration={selectedCalibration} />
                        )}
                    </Box>
                    <Box w={640} h={300}>
                        <BallisticEnergyChart resultData={result?.[0].output} />
                    </Box>
                </Flex>
            </Grid.Col>
        </Grid>
    )
}