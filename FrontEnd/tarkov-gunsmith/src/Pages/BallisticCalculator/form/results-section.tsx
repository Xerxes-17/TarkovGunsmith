import { BallisticSimDataPoint, SimulationToCalibrationDistancePair } from "../types";
import { Box, Flex, Grid, Group, Loader, Select, Stack, Text } from "@mantine/core";
import { BallisticCalculatorResultTable } from "../../../Components/Common/Tables/tgTables/ballistic-calculator-results";
import { BallisticEnergyChart } from "../../../Components/Common/Graphs/Charts/BallisticEnergyChart";
import { BallisticDropChart } from "../../../Components/Common/Graphs/Charts/BallisticDropChart";
import { useState } from "react";
import { useMediaQuery } from "@mui/material";


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
                <Flex align={"center"} >
                    <Select
                        miw={140}
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
                    <Text pl={5}>{resultString}</Text>
                </Flex>
            </Grid.Col>

            <Grid.Col span={12} lg={7} xl={6} >
                {selectedData && (
                    <BallisticCalculatorResultTable result={selectedData} />
                )}
            </Grid.Col>

            <Grid.Col span={12} lg={5} xl={6} >
                {selectedData && (
                    <BallisticDropChart resultData={selectedData} selectedCalibration={selectedCalibration} />
                )}
                <BallisticEnergyChart resultData={result?.[0].output} />
            </Grid.Col>
        </Grid>
    )
}