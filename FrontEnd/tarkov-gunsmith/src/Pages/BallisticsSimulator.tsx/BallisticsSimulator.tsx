import { ActionIcon, Button, CloseButton, Container, Divider, Grid, Group, HoverCard, Paper, ScrollArea, Space, Tabs, Text, Title, Tooltip, rem } from "@mantine/core"
import { PenetrationAndDamageForm } from "./PenetrationAndDamageForm"
import { IconCopy, IconDownload, IconGraph, IconMessageCircle, IconPhoto, IconPlus, IconSettings, IconTrash } from "@tabler/icons-react"
import { ArmorMaterialDestructibilitySelect } from "../../Api/ArmorApiCalls"
import { useState } from "react";



/**
 * Let's make this one simple to start with, just a means of calling WishGranter for it to calculate a given penetration chance, the blunt damage, and so on.
 * 
 */
export function BallisticsSimulator() {
    const [tabTitles, setTabTitles] = useState<string[]>(["Sim1"]);
    const [activeTab, setActiveTab] = useState<string | null>("Sim1");

    function addNewTab() {
        const newTabTitle = `Sim${tabTitles.length + 1}`
        const newTabTitles = [...tabTitles, newTabTitle];
        setTabTitles(newTabTitles);
        setActiveTab(newTabTitle);
    }

    function removeTab(title: string) {
        const newTitles = tabTitles.filter((str) => str !== title);
        setTabTitles(newTitles);

        if (activeTab === title) {
            const index = tabTitles.indexOf(title);
            if (index < tabTitles.length - 1) {
                setActiveTab(newTitles[index])
            }
            else {
                const lastItem = newTitles[newTitles.length - 1];
                setActiveTab(lastItem)
            }
        }

    }

    const tabs = tabTitles.map((title) => (
        <HoverCard shadow="md" openDelay={250}>
            <HoverCard.Target >
                <Tabs.Tab value={title} icon={<IconGraph size="1.2rem" />}>
                    <Text>{title}</Text>
                </Tabs.Tab>
            </HoverCard.Target>
            {tabTitles.length > 1 && (
                <HoverCard.Dropdown>
                    <Group>
                        {title !== activeTab && false && (
                            <Button compact color="green">
                                Compare
                            </Button>
                        )}

                        <ActionIcon color="red" aria-label="delete simulation" onClick={() => removeTab(title)}>
                            <IconTrash size="1.125rem" />
                        </ActionIcon>

                    </Group>
                </HoverCard.Dropdown>
            )}
        </HoverCard>
    ))

    const tabPanels = tabTitles.map((title) => (
        <Tabs.Panel value={title} pl="xs">
            <PenetrationAndDamageForm />
        </Tabs.Panel>
    ))

    return (
        <Container>
            <br />
            <Paper shadow="sm" p="md">
                <Group>
                    <Title order={2}>Ballsitic Simulator</Title>
                    <Group ml={"auto"}>
                        <Tooltip label="Download simulation as image" transitionProps={{ transition: 'slide-up', duration: 300 }}>
                            <Button variant="outline" leftIcon={<IconDownload size="1.2rem" />}>
                                Download
                            </Button>
                        </Tooltip>
                        <Tooltip label="Copy simulation as image to clipboard" transitionProps={{ transition: 'slide-up', duration: 300 }}>
                            <Button variant="outline"  leftIcon={<IconCopy size="1.2rem" />}>
                                Copy
                            </Button>
                        </Tooltip>
                    </Group>
                </Group>


                <Divider my="sm" />
                <Tabs orientation="horizontal" value={activeTab} onTabChange={setActiveTab}>
                    <Tabs.List>
                        {tabs}
                        <Tabs.Tab value="new" aria-label="Add new simulation" onClick={() => addNewTab()}>
                            <ActionIcon variant="transparent">
                                <IconPlus size="1rem" />
                            </ActionIcon>
                        </Tabs.Tab>
                    </Tabs.List>
                    <ScrollArea.Autosize
                        // mah={450} // sets the max size before the scroll area appears, will need top play with it more
                        mx="auto"
                        type="scroll"
                        offsetScrollbars
                    >
                        {tabPanels}
                    </ScrollArea.Autosize>



                </Tabs>

            </Paper>
        </Container>

    )
}
