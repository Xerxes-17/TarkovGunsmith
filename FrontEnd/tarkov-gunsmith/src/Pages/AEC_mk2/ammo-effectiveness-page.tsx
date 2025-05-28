import { ActionIcon, Container, Group, Input, Loader, NumberInput, Paper, Stack, Text, Title } from '@mantine/core';
import { SEO } from "../../Util/SEO";
import { useEffect, useState } from "react";
import { requestAmmoEffectivenessChart } from "./api-requests";
import { IconDatabaseX, IconRefresh } from "@tabler/icons-react";
import { AecData, ConvertAecRawToDisplay, DisplayRowAEC } from "./types";
import { AmmoEffectivenessTable } from "./ammo-effectiveness-table";
import { HtkConfidenceInput } from './htk-confidence-input';

export function AmmoEffectivenessPage() {
    const [ammoEffectivenessData, setAmmoEffectivenessData] = useState<AecData>();

    const [processedAmmoData, setProcessedAmmoData] = useState<DisplayRowAEC[]>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function getAmmoEffectivenessData() {
        const response_WishGranter = await requestAmmoEffectivenessChart();
        if (response_WishGranter !== null) {
            setAmmoEffectivenessData(response_WishGranter);
            console.log("response data:", response_WishGranter)

            const processedTableData = ConvertAecRawToDisplay(response_WishGranter, 75)
            setProcessedAmmoData(processedTableData)

            setIsLoading(false)
            return;
        }
        setIsLoading(false)
        console.error("Error: WishGranter failed to respond.")
    }

    function onClickRefreshConfidence(value: number) {
        if (!ammoEffectivenessData) {
            return
        }

        const valueAsNum = typeof value !== 'string' ? value : 75
        const processedTableData = ConvertAecRawToDisplay(ammoEffectivenessData, valueAsNum)
        setProcessedAmmoData(processedTableData)
    }


    useEffect(() => {
        setIsLoading(true)
        getAmmoEffectivenessData();
    }, [])

    return (
        <>
            <SEO url="https://tarkovgunsmith.com/datasheets/ammo_effectiveness" title={'Ammo Effectiveness : Tarkov Gunsmith'} />
            <Container size={"99.5%"} px={0} pt={3}>
                <Paper shadow="sm" p={2} px={5} mt={0}>
                    {isLoading && ammoEffectivenessData === undefined && (
                        <Stack spacing={2} mb={5} align="center">
                            <Loader size="xl" variant="bars" />
                            <Text>Fetching data, this shouldn't be here long.</Text>
                        </Stack>
                    )}

                    {!isLoading && ammoEffectivenessData === undefined && (
                        <Stack spacing={2} mb={5} align="center">
                            <IconDatabaseX size="5rem" color="#9e1b1b" />
                            <Text>Welp, no response from Wishgranter-API, go yell at Xerxes on the discord about it.</Text>
                        </Stack>
                    )}

                    {processedAmmoData !== undefined && (
                        <>
                            <Stack>
                                <Group>
                                    <HtkConfidenceInput onClick={onClickRefreshConfidence}/>
                                </Group>

                                <AmmoEffectivenessTable tableData={processedAmmoData} />
                            </Stack>

                        </>
                    )}
                </Paper>

            </Container>
        </>
    )
}