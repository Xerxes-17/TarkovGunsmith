import { BallisticCalculatorTableRow, BallisticSimDataPoint, BDC_Result, ConvertBSDPtoBCTR } from "../types";
import { Grid, Loader, Stack, Text } from "@mantine/core";
import { BallisticCalculatorResultTable } from "../../../Components/Common/Tables/tgTables/ballistic-calculator-results";
import { BallisticEnergyChart } from "../../../Components/Common/Graphs/Charts/BallisticEnergyChart";
import { BallisticDropChart } from "../../../Components/Common/Graphs/Charts/BallisticDropChart";
import { useEffect, useState } from "react";
import { LINKS } from "../../../Util/links";


export function DopeResultSection(
    { result, isLoading, timeStampRefreshHack }:
        { result: BDC_Result, isLoading: boolean, timeStampRefreshHack: number }
) {
    const resultString = result.resultString;
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
    console.log(displayed)

    function handleOnChange(value: string | null) {
        if (typeof (value) === "string") {
            setSelectedCalibration(value);
            var index = options.findIndex(x => x.value === value);
            if (index === -1) {
                index = 1
            }
            setSelectedData(result?.dataPoints[index].output.DataPoints);
        }
    }


    useEffect(() => {
        var index = options.findIndex(x => x.value === selectedCalibration);
        if (index === -1) {
            index = 1
            setSelectedCalibration("50")
        }
        setSelectedData(result?.dataPoints[index].output.DataPoints)
    }, [result])

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
            <Grid.Col span={24} lg={14} xl={14} >
                <Stack spacing={3}>
                    <Text size={"md"} pl={5}>{resultString}</Text>
                </Stack>
                {selectedData && (
                    <>
                        <BallisticCalculatorResultTable
                            result={displayed}
                            options={options}
                            selectedCalibration={selectedCalibration}
                            handleOnChange={handleOnChange}
                        />
                        <Text color="gray.5" size={"xs"} >Time generated: {new Date(timeStampRefreshHack).toUTCString()} and is from https://tarkovgunsmith.com{LINKS.BALLISTIC_CALCULATOR}</Text>
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