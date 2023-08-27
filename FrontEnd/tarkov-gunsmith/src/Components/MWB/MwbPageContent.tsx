import {
    Container,
    SimpleGrid
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
                    <MwbControlsCard />
                    <ResultCard />
                </SimpleGrid>
            </Container>
        </ThemeProvider>
    );
}
