import { Box, Button, Center, Container, Divider, Grid, Group, Loader, MantineProvider, Modal, Paper, Stack, Text, Title } from "@mantine/core";
import { SEO } from "../../Util/SEO";
import { CalculatorForm } from "./CalculatorForm";
import { useEffect, useState } from "react";
import { BDC_Result, DopeTableUI_Options } from "./types";
import { IconDatabase, IconDatabaseX, IconHelp } from "@tabler/icons-react";
import axios from "axios";
import { API_URL } from "../../Util/util";
import { DopeResultSection } from "./form/results-section";
import { FrequentlyAskedQuestions } from "./components/frequently-asked-questions";
import { useDisclosure } from "@mantine/hooks";

export function BallisticCalculator() {
    const [dopeOptions, setDopeOptions] = useState<DopeTableUI_Options>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [result, setResult] = useState<BDC_Result>();

    const [timeStampRefreshHack, setTimeStampRefreshHack] = useState<number>(0); //! This hacky thing is here to force the Table element to re-render with new data passed in, due to a limitation of MRT

    const [openedFAQ, { open: openFAQ, close: closeFAQ }] = useDisclosure(false);

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
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    colorScheme: 'dark',
                    breakpoints: {
                        xs: '30em',
                        sm: '48em',
                        md: '64em',
                        lg: '74em',
                        xl: '1540px',
                    },
                }}>
                <Container size={"99.5%"} px={0} pt={3}>
                    <Paper shadow="sm" p={2} px={5} mt={0}>

                        <Grid columns={24} px={4}>

                            {isLoading && !dopeOptions && (
                                <Stack spacing={2} mb={5} align="center">
                                    <Loader size="xl" variant="bars" />
                                    <Text>Fetching options, please be patient. This should only take time if the backend recently restarted.</Text>
                                </Stack>
                            )}

                            {!isLoading && !dopeOptions && (
                                <Stack spacing={2} mb={5} align="center">
                                    <IconDatabaseX size="5rem" color="#9e1b1b" />
                                    <Text>Welp, no response from Wishgranter-API, go yell at Xerxes on the discord about it.</Text>
                                </Stack>
                            )}

                            {isLoading && dopeOptions && (
                                <Center mih={250}>
                                    <Stack spacing={2} py={10} mb={5} align="center">
                                        <Loader size="xl" />
                                        <Text>Prayers sent to WishGranter, Слава моноліту!!</Text>
                                        <IconDatabase size="5rem" color="#3e9eed" />
                                    </Stack>
                                </Center>
                            )}

                            {dopeOptions !== undefined && (
                                <Grid.Col span={24} sm={12} md={10} lg={8} xl={6}>
                                    <CalculatorForm dopeOptions={dopeOptions} setResult={setResult} setTimeStampRefreshHack={setTimeStampRefreshHack} />
                                    {result && (
                                        <>
                                            <Group position="center">
                                                <Button
                                                    compact
                                                    color="cyan"
                                                    leftIcon={<IconHelp size="1rem" />}
                                                    ml={10}
                                                    mr={10}
                                                    onClick={openFAQ}
                                                >
                                                    Frequently Asked Questions
                                                </Button>
                                            </Group>
                                            <Modal opened={openedFAQ} onClose={closeFAQ} size={1400} title={<Title order={3}>Frequently Asked Questions</Title>}>
                                                <FrequentlyAskedQuestions />
                                            </Modal>
                                        </>
                                    )}
                                </Grid.Col>
                            )}

                            {!result && !isLoading && (
                                <Grid.Col span={24} sm={12} md={14} lg={16} xl={18}>
                                    <Box>
                                        <Divider label="Frequently Asked Questions" labelPosition="center" />
                                        <FrequentlyAskedQuestions />
                                    </Box>
                                </Grid.Col>
                            )}

                            {result && !isLoading && (
                                <Grid.Col span={24} sm={12} md={14} lg={16} xl={18}>
                                    <Divider label="Result" labelPosition="center" />
                                    <DopeResultSection
                                        isLoading={isLoading}
                                        result={result}
                                        timeStampRefreshHack={timeStampRefreshHack}
                                    />
                                </Grid.Col>
                            )}
                        </Grid>
                    </Paper>
                </Container>
            </MantineProvider>

        </>
    )
}