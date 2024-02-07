import { Divider,  Stack, Title } from "@mantine/core";
import { DurabilityAndMaxPair } from "../../Components/Common/Inputs/DurabilityAndMaxPair";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";
import { NumberAndSliderPercentage } from "../../Components/Common/Inputs/NumberAndSliderPercentage";
import { ArmorMaterialSelect } from "../../Components/Common/Inputs/SelectArmorMaterial";


export function ArmorLayerUI() {
    return (
        <>
            <Divider my="xs" label={(<Title order={4}>Armor Layer</Title>)} />
            <Stack>
                <NumberAndSlider label={"Armor Class"} property={"armorClass"} precision={2} max={6} min={1} step={1} />
                <NumberAndSliderPercentage
                    label={"Blunt Damage Throughput"}
                    property={"bluntDamageThroughput"}
                    precision={2}
                    step={1}
                />
                <DurabilityAndMaxPair />
                <ArmorMaterialSelect />
            </Stack>
        </>
    )
}