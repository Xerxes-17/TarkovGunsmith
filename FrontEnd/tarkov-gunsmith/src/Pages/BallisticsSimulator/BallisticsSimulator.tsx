import { ActionIcon, Button, Container, Divider, Group, HoverCard, Paper, Popover, ScrollArea, Space, Tabs, Text, TextInput, Title, Tooltip } from "@mantine/core"
import { PenetrationAndDamageForm } from "./PenetrationAndDamageForm"
import { IconEdit, IconGraph, IconPlus, IconTrash } from "@tabler/icons-react"
import { useState } from "react";
import { DownloadElementImageButton } from "../../Components/Common/Inputs/ElementImageDownloadButton";
import { CopyElementImageButton } from "../../Components/Common/Inputs/ElementImageCopyButton";
import { useMediaQuery, useViewportSize } from '@mantine/hooks';
import { BallisticSimulatorTitle } from "../../Components/Common/TextWithToolTips/BallisticSimulatorTitle";
import { log } from "console";

const PRINT_ID = "printMe";

/**
 * Let's make this one simple to start with, just a means of calling WishGranter for it to calculate a given penetration chance, the blunt damage, and so on.
 * 
 */
export function BallisticsSimulator() {
    const [newTabTitle, setNewTabTitle] = useState('');
    const [tabTitles, setTabTitles] = useState<string[]>(["Sim1"]);
    const [activeTab, setActiveTab] = useState<string | null>("Sim1");

    const mobileView = useMediaQuery('(max-width: 576px)');
    const { height, width } = useViewportSize();

    const [countOfLayers, setCountOfLayers] = useState<number>(1);
    console.log(countOfLayers)

    const containerSize = () => {
        if (countOfLayers === 1) {
            return "lg"
        }
        else if (countOfLayers === 2) {
            return "xl"
        }
        else {
            return "xxl"
        }
    }

    // console.log(mobileView)

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
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewTabTitle(event.target.value);
    };

    function editTabTitle(title: string, newTitle: string) {
        const index = tabTitles.findIndex(x => x === title);
        if (index === -1) {
            return
        }
        const updatedTabTitles = [...tabTitles];
        updatedTabTitles[index] = newTitle;
        setTabTitles(updatedTabTitles);
        if(activeTab === title){
            setActiveTab(newTitle);
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
                                    editTabTitle(title, newTabTitle);
                                }}>
                                    <TextInput label="New name - enter to save" placeholder="Name" size="xs" defaultValue={title} onChange={handleChange} />
                                </form>

                            </Popover.Dropdown>
                        </Popover>

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
            <PenetrationAndDamageForm layerCountCb={setCountOfLayers} />
        </Tabs.Panel>
    ))

    return (
        <Container size={"xl"} px={0} mt={-3}>
            <Space h={5} />
            <Paper shadow="sm" p="md" id={PRINT_ID} >
                <Group>
                    <BallisticSimulatorTitle />
                    <Group ml={"auto"}>
                        <DownloadElementImageButton targetElementId={PRINT_ID} fileName="tarkovGunsmithBallisticSimulator" />
                        <CopyElementImageButton targetElementId={PRINT_ID} />
                    </Group>
                </Group>

                <Divider my={5} />
                <Tabs orientation="horizontal" value={activeTab} onTabChange={setActiveTab} >
                    <Tabs.List data-html2canvas-ignore>
                        {tabs}
                        <Tabs.Tab value="new" aria-label="Add new simulation" onClick={() => addNewTab()}>
                            <ActionIcon variant="transparent">
                                <IconPlus size="1rem" />
                            </ActionIcon>
                        </Tabs.Tab>
                    </Tabs.List>
                    <ScrollArea.Autosize
                        mah={mobileView ? height - 345 : "100%"} // sets the max size before the scroll area appears, will need top play with it more
                        type="scroll"
                        offsetScrollbars
                    >
                        <Paper id={PRINT_ID}>
                            {tabPanels}
                        </Paper>
                    </ScrollArea.Autosize>
                </Tabs>

            </Paper>
        </Container>

    )
}