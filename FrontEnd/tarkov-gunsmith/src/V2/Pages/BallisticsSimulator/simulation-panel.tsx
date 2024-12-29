import { LoadingOverlay, Stack, Tabs, Text } from "@mantine/core";
import { BallisticSimulatorTab } from "./types";
import { useState } from "react";


export function SimulationPanel(
    {
        sim,

    }: {
        sim: BallisticSimulatorTab;
    }
) {
    const [isLoading, setIsLoading] = useState<boolean>(false);


    return (
        <Tabs.Panel value={sim.id} pl="xs">
            <LoadingOverlay visible={isLoading} overlayBlur={2} />
            <Stack spacing={2} mb={5}>
                {/* Projectile UI */}
                <Text>Projectile UI</Text>

                {/* Armor UI */}
                <Text>Armor UI</Text>

                {/* Results UI */}
                <Text>Results UI</Text>

            </Stack>
        </Tabs.Panel >
    )
}