import { Container, Loader, Paper, Stack, Text } from '@mantine/core';
import { SEO } from "../../Util/SEO";
import { useEffect, useState } from "react";
import { requestAmmoEffectivenessChart } from "./api-requests";
import { IconDatabaseX } from "@tabler/icons-react";
import { AecData } from "./types";
import { AmmoEffectivenessTable } from "./ammo-effectiveness-table";

export function AmmoEffectivenessPage() {
    const [ammoEffectivenessData, setAmmoEffectivenessData] = useState<AecData>();
    
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function getAmmoEffectivenessData() {
        const response_WishGranter = await requestAmmoEffectivenessChart();
        if (response_WishGranter !== null) {
            setAmmoEffectivenessData(response_WishGranter);
            setIsLoading(false)
            return;
        }
        setIsLoading(false)
        console.error("Error: WishGranter failed to respond.")
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

                    {ammoEffectivenessData !== undefined && (
                        <>
                            <AmmoEffectivenessTable tableData={ammoEffectivenessData} />
                        </>
                    )}
                </Paper>
            </Container>
        </>
    )
}