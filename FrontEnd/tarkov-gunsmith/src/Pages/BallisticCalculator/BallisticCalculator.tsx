import { Container, Loader, Paper, ScrollArea, Stack, Text } from "@mantine/core";
import { SEO } from "../../Util/SEO";
import { CalculatorForm } from "./CalculatorForm";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { DopeTableUI_Options } from "./types";
import {  IconDatabaseX } from "@tabler/icons-react";
import axios from "axios";
import { API_URL } from "../../Util/util";



export function BallisticCalculator() {
    const mobileView = useMediaQuery('(max-width: 576px)');
    const { height, } = useViewportSize();

    const [dopeOptions, setDopeOptions] = useState<DopeTableUI_Options>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function requestDopeTableOptions() {
        let response = null;
    
        try {
            response = await axios.get(API_URL + `/GetDopeTableOptions`);
        } catch (error) {
            setIsLoading(false)
            throw error;
        }
        return response.data;
    }

    async function getDopeOptions() {
        const response_WishGranter = await requestDopeTableOptions();
        if (response_WishGranter !== null) {
            setDopeOptions(response_WishGranter);
            setIsLoading(false)
            return;
        }
        setIsLoading(false)
        console.error("Error: Both WishGranter and ApiTarkovDev failed to respond (correctly).")
    }
    useEffect(() => {
        setIsLoading(true)
        getDopeOptions();
    }, [])

    return (
        <>
            <SEO url="https://tarkovgunsmith.com/ballistic_calculator" title={'Ballistic Calculator : Tarkov Gunsmith'} />
            <Container size={"100%"} px={0} pt={3}>
                <Paper shadow="sm" p={2} px={5} mt={0}>
                    <ScrollArea.Autosize
                        mah={mobileView ? height - 200 : "100%"} // sets the max size before the scroll area appears, will need top play with it more
                        mx="auto"
                        type="scroll"
                        offsetScrollbars
                    >
                        {isLoading && dopeOptions === undefined && (
                            <Stack spacing={2} mb={5} align="center">
                                <Loader size="xl" variant="bars" />
                                <Text>Fetching options, please be patient. This should only take time if the backend recently restarted.</Text>
                            </Stack>
                        )}

                        {!isLoading && dopeOptions === undefined && (
                            <Stack spacing={2} mb={5} align="center">
                                <IconDatabaseX size="5rem" color="#9e1b1b" />
                                <Text>Welp, no response from Wishgranter-API, go yell at Xerxes on the discord about it.</Text>
                            </Stack>
                        )}

                        {dopeOptions !== undefined && (
                            <CalculatorForm dopeOptions={dopeOptions} />
                        )}

                    </ScrollArea.Autosize>
                </Paper>
            </Container>

        </>
    )
}