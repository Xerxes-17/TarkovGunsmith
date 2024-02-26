import { Box, Divider, Group, SimpleGrid, Title } from "@mantine/core";
import { DurabilityAndMaxPair } from "../../Components/Common/Inputs/DurabilityAndMaxPair";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";
import { NumberAndSliderPercentage } from "../../Components/Common/Inputs/NumberAndSliderPercentage";
import { ArmorMaterialSelect } from "../../Components/Common/Inputs/SelectArmorMaterial";
import { useBallisticSimulatorFormContext } from "./ballistic-simulator--form-context";
import { DrawerButton } from "../../Components/Common/Inputs/DrawerButton";
import { IconSearch } from "@tabler/icons-react";
import { BluntThroughputWithToolTip } from "../../Components/Common/TextWithToolTips/BluntThroughputWithToolTip";
import { useViewportSize } from "@mantine/hooks";

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

    

    return (
        <>
            {isDesktop && (
                <Group spacing={"md"} align="flex-start">
                    <Divider mt={"24.69px"} label={(
                        <Group spacing={8} >
                            <Title order={4}>Armor Layer {index + 1}</Title>
                            <DrawerButton leftIcon={searchIcon} buttonLabel={"Search"} ammoOrArmor="armor" armorIndex={index} />
                        </Group>)} />
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
                    <Divider mt={"24.69px"} label={(
                        <Group spacing={8} >
                            <Title order={4}>Armor Layer {index + 1}</Title>
                            <DrawerButton leftIcon={searchIcon} buttonLabel={"Search"} ammoOrArmor="armor" armorIndex={index} />
                        </Group>)} />
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