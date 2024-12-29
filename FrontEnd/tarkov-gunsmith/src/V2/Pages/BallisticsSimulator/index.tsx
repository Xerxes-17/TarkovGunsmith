import { useState } from "react";
import { SEO } from "../../../Util/SEO";
import { CommonCardPaper } from "../Common/Components/CardPaper";

import { Container, Tabs, Paper, ScrollArea } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { BallisticSimulatorTab, createBallisticSimulatorTab, PRINT_ID } from "./types";
import { SimulationTab } from "./simulation-tab";
import { SimulationPanel } from "./simulation-panel";
import { useMediaQuery, useViewportSize } from "@mantine/hooks";

export function BallisticsSimulator() {
    const mobileView = useMediaQuery('(max-width: 576px)');
    const { height, } = useViewportSize();

    const [simulations, setSimulations] = useState<BallisticSimulatorTab[]>([
        createBallisticSimulatorTab("Sim1", undefined),
        createBallisticSimulatorTab("Sim2", undefined)
    ])

    const [activeSimulationId, setActiveSimulationId] = useState<string | null>(simulations[0].id);

    function addNewSim() {
        const title = `Sim${simulations.length + 1}`
        const newSim = createBallisticSimulatorTab(title, undefined)

        const newTabs = [...simulations, newSim]
        setSimulations(newTabs)
        setActiveSimulationId(newSim.id)
    }

    function editSimTitle(id: string, replacement: string) {
        const index = simulations.findIndex(x => x.id === id);
        if (index === -1) {
            return
        }

        const updatedSimulations = [...simulations];
        updatedSimulations[index].title = replacement;
        setSimulations(updatedSimulations);
    }

    function copySim(id: string) {
        const index = simulations.findIndex(x => x.id === id);

        const originalSim = simulations[index];
        const newSim = createBallisticSimulatorTab(`${originalSim?.title} copy`, undefined);

        const foreSlice = simulations.slice(0, index + 1);
        const aftSlice = simulations.slice(index + 1);

        const concatFore = foreSlice.concat(newSim);
        const newSims = concatFore.concat(aftSlice);
        setSimulations(newSims);
    }

    function removeSim(id: string) {
        const newSims = simulations.filter(sim => sim.id !== id);
        setSimulations(newSims);

        if (activeSimulationId === id) {
            const index = simulations.findIndex(x => x.id === id)
            if (index < simulations.length - 1) {
                setActiveSimulationId(newSims[index].id)
            }
            const lastItem = newSims[newSims.length - 1];
            setActiveSimulationId(lastItem.id)
        }
    }

    const tabs = simulations.map(sim =>
    (
        <SimulationTab
            key={sim.id}
            sim={sim}
            editSimTitle={editSimTitle}
            copySim={copySim}
            removeSim={removeSim}
        />
    ))
    tabs.push(
        <Tabs.Tab key={"new-tab"} value="new" aria-label="Add new simulation" onClick={() => addNewSim()}>
            <IconPlus size="1rem" />
        </Tabs.Tab>
    )

    const panels = simulations.map(sim => (
        <SimulationPanel sim={sim} key={sim.id} />
    ))

    return (
        <>
            <SEO url="https://tarkovgunsmith.com/ballistics_simulator" title={'Ballistics Simulator : Tarkov Gunsmith'} />
            <Container size={1420} px={0} pt={3}>
                <CommonCardPaper>
                    <Tabs orientation="horizontal" value={activeSimulationId} onTabChange={setActiveSimulationId} >
                        <Tabs.List>
                            {tabs}
                        </Tabs.List>
                        <ScrollArea.Autosize
                            mah={mobileView ? height - 200 : "100%"} // sets the max size before the scroll area appears, will need top play with it more
                            type="scroll"
                            offsetScrollbars
                        >
                            <Paper id={PRINT_ID}>
                                {panels}
                            </Paper>
                        </ScrollArea.Autosize>
                    </Tabs>
                </CommonCardPaper>
            </Container>
        </>
    )
}