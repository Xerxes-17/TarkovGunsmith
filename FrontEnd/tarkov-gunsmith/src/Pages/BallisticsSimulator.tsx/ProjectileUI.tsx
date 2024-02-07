import { Divider, Stack, Title, Text } from "@mantine/core";
import { DurabilityAndMaxPair } from "../../Components/Common/Inputs/DurabilityAndMaxPair";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";
import { NumberAndSliderPercentage } from "../../Components/Common/Inputs/NumberAndSliderPercentage";
import { ArmorMaterialSelect } from "../../Components/Common/Inputs/SelectArmorMaterial";
import { NumberLabelAndSliderPercentage } from "../../Components/Common/Inputs/NumberLabelAndSliderPercentage";
import { useBallisticSimulatorFormContext } from "./ballistic-simulator--form-context";

const MAX_PENETRATION = 90;
const MAX_DAMAGE = 265;



export function ProjectileUI() {
    const form = useBallisticSimulatorFormContext();

    const effectiveDurabilityDamageDes = (
        <Text size="sm">
            Eff. Durability Dmg: <b>{(form.values.penetration * form.values.armorDamagePercentage / 100).toFixed(2)}</b>
        </Text>
    )
    
    return (
        <>
            <Divider my="xs" label={(<Title order={4}>Projectile Info</Title>)} />
            <Stack>
                <NumberAndSlider label={"Penetration"} property={"penetration"} precision={2} max={MAX_PENETRATION} min={1} step={1} />
                <NumberAndSlider label={"Damage"} property={"damage"} precision={2} max={MAX_DAMAGE} min={1} step={1} />
                <NumberLabelAndSliderPercentage
                    label={"Armor Damage Percentage"}
                    description={effectiveDurabilityDamageDes}
                    property={"armorDamagePercentage"}
                    precision={2}
                    step={1}
                />
            </Stack>
        </>
    )
}