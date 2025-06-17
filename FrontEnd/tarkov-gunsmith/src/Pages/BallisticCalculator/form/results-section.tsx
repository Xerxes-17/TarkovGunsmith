import { BallisticCalculatorTableRow, BallisticSimDataPoint, BDC_Result, ConvertBSDPtoBCTR } from "../types";
import { Flex, Grid, Group, Input, Loader, NumberInput, Select, Stack, Text } from "@mantine/core";
import { BallisticCalculatorResultTable } from "../../../Components/Common/Tables/tgTables/ballistic-calculator-results";
import { BallisticEnergyChart } from "../../../Components/Common/Graphs/Charts/BallisticEnergyChart";
import { BallisticDropChart } from "../../../Components/Common/Graphs/Charts/BallisticDropChart";
import { useState } from "react";
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
    const [valueAdjustment, setValueAdjustment] = useState<number | ''>(1.00);

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
            <Grid.Col span={24} lg={14} xl={14} >
                <Stack spacing={3}>
                    <Text size={"md"} pl={5}>{resultString}</Text>
                </Stack>
                <Flex align={"center"} gap={10} pl={5} pb={8}>
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

                    <Group spacing="sm" noWrap>
                            <NumberInput
                                w={140}
                                value={valueAdjustment} onChange={setValueAdjustment}
                                inputWrapperOrder={['label', 'description', 'input', 'error']}
                                label="Scope Mils Multiplier"
                                precision={2}
                                max={5}
                                min={.01}
                                step={.01}
                            />
                        <Input.Description pl={5}>In-game scope mils are not to scale. Set the multiplier for the adjusted mils column here.<br />From .01 to 5.00, step is .01.</Input.Description>
                    </Group>

                </Flex>
                {selectedData && (
                    <>
                        <BallisticCalculatorResultTable result={displayed} valueAdjustment={valueAdjustment}/>
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