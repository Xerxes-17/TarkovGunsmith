import { BallisticCalculatorTableRow, BallisticSimDataPoint, BDC_Result, ConvertBSDPtoBCTR } from "../types";
import { Flex, Grid, Loader, Select, Stack, Text } from "@mantine/core";
import { BallisticCalculatorResultTable } from "../../../Components/Common/Tables/tgTables/ballistic-calculator-results";
import { BallisticEnergyChart } from "../../../Components/Common/Graphs/Charts/BallisticEnergyChart";
import { BallisticDropChart } from "../../../Components/Common/Graphs/Charts/BallisticDropChart";
import { useState } from "react";


export function DopeResultSection(
    { result, isLoading, resultString }:
        { result: BDC_Result, isLoading: boolean, resultString: string }
) {
    const totalWeaponAccuracyCRads = result.totalWeaponAccuracyCRads;
    const calibrations = result?.dataPoints.map(x => x.Distance);
    const options = calibrations?.map(value => {
        return {
            value: value.toString(),
            label: `${value} m`
        }
    }) ?? [];

    const [selectedCalibration, setSelectedCalibration] = useState<string>("50");

    const [selectedData, setSelectedData] = useState<BallisticSimDataPoint[]>(result?.dataPoints[1].output.DataPoints);
    const displayed: BallisticCalculatorTableRow[] = selectedData.map(item => ConvertBSDPtoBCTR(item, totalWeaponAccuracyCRads))

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
        <Grid columns={24}>
            <Grid.Col  span={24} lg={14} xl={14} >
                <Flex align={"center"} gap={10}>
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
                                setSelectedData(result?.dataPoints[index].output.DataPoints);
                            }
                        }}
                    />
                    <Stack spacing={3}>
                        <Text size={"md"} pl={5}>{resultString}</Text>
                    </Stack>
                </Flex>
                {selectedData && (
                    <>
                        <BallisticCalculatorResultTable result={displayed} />
                    </>
                )}
            </Grid.Col>

            <Grid.Col span={24} lg={10} xl={10} >
                {selectedData && (
                    <BallisticDropChart resultData={selectedData} selectedCalibration={selectedCalibration} totalWeaponAccuracyCRads={totalWeaponAccuracyCRads} />
                )}
                <BallisticEnergyChart resultData={result?.dataPoints[0].output} />
            </Grid.Col>
        </Grid>
    )
}