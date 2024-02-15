import { Divider, Group, Stack, TextInput, Title } from "@mantine/core";
import { DurabilityAndMaxPair } from "../../Components/Common/Inputs/DurabilityAndMaxPair";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";
import { NumberAndSliderPercentage } from "../../Components/Common/Inputs/NumberAndSliderPercentage";
import { ArmorMaterialSelect } from "../../Components/Common/Inputs/SelectArmorMaterial";
import { FormArmorLayer, useBallisticSimulatorForm, useBallisticSimulatorFormContext } from "./ballistic-simulator--form-context";
import { AddArmorLayerButton } from "../../Components/Common/Inputs/AddArmorLayerButton";
import { RemoveArmorLayerButton } from "../../Components/Common/Inputs/RemoveArmorLayerButton";
import { DrawerButton } from "../../Components/Common/Inputs/DrawerButton";
import { IconSearch } from "@tabler/icons-react";
import { BluntThroughputWithToolTip } from "../../Components/Common/TextWithToolTips/BluntThroughputWithToolTip";

interface ArmorLayerUiProps {
    index: number
}

const searchIcon = <IconSearch size="1.2rem" />

export function ArmorLayerUI({ index }: ArmorLayerUiProps) {
    const form = useBallisticSimulatorFormContext();

    return (
        <>
            <Divider my="xs" label={(
                <Group spacing={8} >
                    <Title order={4}>Armor Layer {index + 1}</Title>
                    <DrawerButton leftIcon={searchIcon} buttonLabel={"Search"} ammorOrArmor="armor" armorIndex={index} />
                </Group>)} />
            <Stack>
                <NumberAndSlider label={"Armor Class"} property={`armorLayers.${index}.armorClass`} precision={2} max={6} min={1} step={1} />
                <NumberAndSliderPercentage
                    label={<BluntThroughputWithToolTip />}
                    property={`armorLayers.${index}.bluntDamageThroughput`}
                    precision={2}
                    step={1}
                />
                <DurabilityAndMaxPair index={index} />
                <ArmorMaterialSelect armorLayersIndex={index} />
                {index + 1 === form.values.armorLayers.length && (
                    <Group grow>
                        {form.values.armorLayers.length > 1 && (
                            <RemoveArmorLayerButton index={index} />
                        )}
                        {form.values.armorLayers.length < 3 && (
                            <AddArmorLayerButton index={index} />
                        )}

                    </Group>
                )}
            </Stack>
        </>
    )
}