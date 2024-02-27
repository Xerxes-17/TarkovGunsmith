import { Box, Divider, Group, SimpleGrid, Title, Text, Stack } from "@mantine/core";
import { DurabilityAndMaxPair } from "../../Components/Common/Inputs/DurabilityAndMaxPair";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";
import { NumberAndSliderPercentage } from "../../Components/Common/Inputs/NumberAndSliderPercentage";
import { ArmorMaterialSelect } from "../../Components/Common/Inputs/SelectArmorMaterial";
import { useBallisticSimulatorFormContext } from "./ballistic-simulator--form-context";
import { DrawerButton } from "../../Components/Common/Inputs/DrawerButton";
import { IconSearch } from "@tabler/icons-react";
import { BluntThroughputWithToolTip } from "../../Components/Common/TextWithToolTips/BluntThroughputWithToolTip";
import { useViewportSize } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { ArmorModule, ArmorModuleTableRow } from "../../Types/ArmorTypes";
import { API_URL } from "../../Util/util";
import { convertEnumValToArmorString } from "../../Components/ADC/ArmorData";
import { createHitZoneValues } from "../../Components/Common/Helpers/ArmorHelpers";

interface ArmorLayerUiProps {
    index: number
}

const searchIcon = <IconSearch size="1.2rem" />

export function ArmorLayerUI({ index }: ArmorLayerUiProps) {
    const form = useBallisticSimulatorFormContext();
    const { width } = useViewportSize();
    const isDesktop = width >= 1032
    const isMobile = width < 1032;

    const addSpacer = width < 1032 && width > 850;

    const textMAW = width > 850 ? 180 : "auto"

    const initialData: ArmorModuleTableRow[] = [];
    const [armorData, setArmorData] = useState<ArmorModuleTableRow[]>(initialData);

    const getArmorData = async () => {
        try {
            const response = await fetch(API_URL + '/GetArmorModulesData');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: ArmorModule[] = await response.json();

            const rows: ArmorModuleTableRow[] = data.map(row => ({
                id: row.id,
                category: row.category,
                armorType: row.armorType,
                name: row.name,
                armorClass: row.armorClass,
                bluntThroughput: row.bluntThroughput,
                maxDurability: row.maxDurability,
                maxEffectiveDurability: row.maxEffectiveDurability,
                armorMaterial: convertEnumValToArmorString(row.armorMaterial),
                weight: row.weight,
                ricochetParams: row.ricochetParams,
                usedInNames: row.usedInNames.join(","),
                compatibleWith: row.compatibleWith.join(","),
                hitZones: createHitZoneValues(row),
            }));

            const filteredRows = rows.filter(x => x.category === "Insert")

            setArmorData(filteredRows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        getArmorData();
    }, [])

    const matched = armorData.find(x =>
        x.armorClass === form.values.armorLayers[index].armorClass &&
        x.bluntThroughput === form.values.armorLayers[index].bluntDamageThroughput / 100 &&
        x.maxDurability === form.values.armorLayers[index].maxDurability &&
        x.armorMaterial === form.values.armorLayers[index].armorMaterial
    )

    return (
        <>
            {isDesktop && (
                <Group spacing={"md"} align="flex-start">
                    <Stack spacing={2}>
                        <Divider label={(
                            <Group spacing={8} >
                                <Title order={4}>Armor Layer {index + 1}</Title>
                                <DrawerButton leftIcon={searchIcon} buttonLabel={"Search"} ammoOrArmor="armor" armorIndex={index} />
                            </Group>)} />
                        {matched ? (
                            <>
                                <Text maw={180} style={{ whiteSpace: "break-spaces" }}>{matched.usedInNames}</Text>
                                <Text maw={180} style={{ whiteSpace: "break-spaces" }}>{matched.hitZones.join(", ")}</Text>
                            </>
                        ) : (
                            <Text>Custom/No match</Text>
                        )}
                    </Stack>

                    <NumberAndSlider w={100} label={"Armor Class"} property={`armorLayers.${index}.armorClass`} precision={2} max={6} min={1} step={1} />
                    <NumberAndSliderPercentage
                        w={130}
                        label={<BluntThroughputWithToolTip />}
                        property={`armorLayers.${index}.bluntDamageThroughput`}
                        precision={2}
                        step={1}
                    />
                    { }
                    <DurabilityAndMaxPair wMaxDura={125} index={index} />
                    <ArmorMaterialSelect w={140} armorLayersIndex={index} />
                    {/* {index + 1 === form.values.armorLayers.length && (
                        <Group grow mt={"24.69px"}>
                            {form.values.armorLayers.length > 1 && (
                                <RemoveArmorLayerButton index={index} />
                            )}
                            {form.values.armorLayers.length < 3 && (
                                <AddArmorLayerButton index={index} />
                            )}

                        </Group>
                    )} */}
                </Group>
            )}
            {isMobile && (
                <SimpleGrid w={"100%"}
                    cols={4}
                    spacing="xs"
                    verticalSpacing={5}
                    breakpoints={[
                        { maxWidth: 850, cols: 2, spacing: 'xs' },
                        { maxWidth: 500, cols: 1, spacing: 'xs' },
                    ]}
                >
                    <Stack spacing={2}>
                        <Divider label={(
                            <Group spacing={8} >
                                <Title order={4}>Armor Layer {index + 1}</Title>
                                <DrawerButton leftIcon={searchIcon} buttonLabel={"Search"} ammoOrArmor="armor" armorIndex={index} />
                            </Group>)} />
                        {matched ? (
                            <>
                                <Text maw={textMAW} style={{ whiteSpace: "break-spaces" }}>{matched.usedInNames}</Text>
                                <Text maw={textMAW} style={{ whiteSpace: "break-spaces" }}>{matched.name}</Text>
                            </>
                        ) : (
                            <Text>Custom/No match</Text>
                        )}
                    </Stack>
                    <NumberAndSlider w={"100%"} label={"Armor Class"} property={`armorLayers.${index}.armorClass`} precision={2} max={6} min={1} step={1} />
                    <NumberAndSliderPercentage
                        w={"100%"}
                        label={<BluntThroughputWithToolTip />}
                        property={`armorLayers.${index}.bluntDamageThroughput`}
                        precision={2}
                        step={1}
                    />
                    {addSpacer && (
                        <>
                            <Box></Box>
                            <Box></Box>
                        </>
                    )}
                    <DurabilityAndMaxPair wMaxDura={"100%"} index={index} />
                    <ArmorMaterialSelect w={"100%"} armorLayersIndex={index} />
                </SimpleGrid>
            )}

        </>

    )
}