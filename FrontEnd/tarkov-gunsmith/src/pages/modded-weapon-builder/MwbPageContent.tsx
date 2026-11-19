import {
    Container,
    SimpleGrid,
    Card as ManCard,
    Text
} from '@mantine/core';
import { ThemeProvider, createTheme } from "@mui/material";
import ResultCard from './ResultCard';
import MwbControlsCard from './MwbControlsCard';

export const MwbPageContent = () => {
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <ThemeProvider theme={darkTheme}>
            <Container size="xl" px="xs" pt="xs" pb={{ base: '3rem', xs: '2rem', md: '1rem' }}>
                <SimpleGrid
                    cols={1}
                    spacing="xs"
                    verticalSpacing="sm"
                >
                    <ManCard shadow="sm" padding="md" radius="md" withBorder bg={"#212529"} style={{ overflow: "auto" }}>
                            <Text>
                                Sorry everyone, I've had to take this page down as there's a bug that kills the entire BE in it that I need to fix.
                                <br/>
                                This could take a while, join the discord if you'd like to be notified of when it is fixed.
                                <br/>
                                - Xerxes17
                            </Text>
                    </ManCard>
                    
                    {/* <MwbControlsCard />
                    <ResultCard /> */}
                </SimpleGrid>
            </Container>
        </ThemeProvider>
    );
}
