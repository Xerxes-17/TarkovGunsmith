import { HoverCard, Group, ActionIcon, TextInput, Tabs, Popover, Tooltip, Text } from "@mantine/core";
import { IconGraph, IconEdit, IconCopy, IconTrash } from "@tabler/icons-react";
import { BallisticSimulatorTab } from "./types"
import { useState } from "react";

export function SimulationTab(
    {
        sim,
        editSimTitle,
        copySim,
        removeSim,
    }: {
        sim: BallisticSimulatorTab;
        editSimTitle: (original: string, replacement: string) => void;
        copySim: (id: string) => void;
        removeSim: (removed: string) => void;
    }
) {
    const [newSimTitle, setNewSimTitle] = useState('');

    const handleNewSimTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewSimTitle(event.target.value);
    };

    return (
        <HoverCard shadow="md" openDelay={500} key={sim.id}>
            <HoverCard.Target>
                <Tabs.Tab value={sim.id} icon={<IconGraph size="1.2rem" />}>
                    <Text>{sim.title}</Text>
                </Tabs.Tab>
            </HoverCard.Target>
            <HoverCard.Dropdown>
                <Group spacing={"xs"}>
                    <Popover width={300} trapFocus position="bottom" withArrow shadow="md">
                        <Popover.Target>
                            <Tooltip label={"Edit tab name"}>
                                <ActionIcon aria-label="Edit simulation tab name" >
                                    <IconEdit size="1.125rem" />
                                </ActionIcon>
                            </Tooltip>

                        </Popover.Target>
                        <Popover.Dropdown sx={(theme) => ({ background: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white })}>
                            <form onSubmit={(e) => {
                                e.preventDefault();
                                editSimTitle(sim.id, newSimTitle);
                            }}>
                                <TextInput label="New name - enter to save" placeholder="Name" size="xs" defaultValue={sim.title} onChange={handleNewSimTitleChange} />
                            </form>

                        </Popover.Dropdown>
                    </Popover>

                    <Tooltip label={"Copy Sim"}>
                        <ActionIcon color="yellow" aria-label="copy simulation" onClick={() => copySim(sim.id)}>
                            <IconCopy size="1.125rem" />
                        </ActionIcon>
                    </Tooltip>

                    <Tooltip label={"Remove Sim"}>
                        <ActionIcon color="red" aria-label="delete simulation" onClick={() => removeSim(sim.id)}>
                            <IconTrash size="1.125rem" />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </HoverCard.Dropdown>
        </HoverCard>
    )
}