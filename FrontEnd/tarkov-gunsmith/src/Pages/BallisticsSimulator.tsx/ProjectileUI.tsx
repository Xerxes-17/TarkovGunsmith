import { Divider, Stack, Title, Text, Group } from "@mantine/core";
import { DurabilityAndMaxPair } from "../../Components/Common/Inputs/DurabilityAndMaxPair";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";
import { NumberAndSliderPercentage } from "../../Components/Common/Inputs/NumberAndSliderPercentage";
import { ArmorMaterialSelect } from "../../Components/Common/Inputs/SelectArmorMaterial";
import { NumberLabelAndSliderPercentage } from "../../Components/Common/Inputs/NumberLabelAndSliderPercentage";
import { useBallisticSimulatorFormContext } from "./ballistic-simulator--form-context";
import { DrawerButton } from "../../Components/Common/Inputs/DrawerButton";
import { IconSearch, IconShieldPlus } from "@tabler/icons-react";
import { ArmorDamagePercentageWithToolTip } from "../../Components/Common/TextWithToolTips/ArmorDamagePercentage";

const MAX_PENETRATION = 90;
const MAX_DAMAGE = 265;

const searchIcon = <IconSearch size="1.2rem" />

export function ProjectileUI() {
    const form = useBallisticSimulatorFormContext();

    const effectiveDurabilityDamageDes = (
        <Text size="sm">
            Eff. Durability Dmg: <b>{(form.values.penetration * form.values.armorDamagePercentage / 100).toFixed(2)}</b>
        </Text>
    )

    return (
        <>
            <Divider my="xs" label={(<Group spacing={8}><Title order={4}>Projectile Info</Title> <DrawerButton leftIcon={searchIcon} buttonLabel={"Search"} ammorOrArmor="ammo"/></Group>)} />
            <Stack spacing={4}>
                <NumberAndSlider label={"Penetration"} property={"penetration"} precision={2} max={MAX_PENETRATION} min={1} step={1} />
                <NumberAndSlider label={"Damage"} property={"damage"} precision={2} max={MAX_DAMAGE} min={1} step={1} />
                <NumberLabelAndSliderPercentage
                    label={<ArmorDamagePercentageWithToolTip/>}
                    description={effectiveDurabilityDamageDes}
                    property={"armorDamagePercentage"}
                    precision={2}
                    step={1}
                />
            </Stack>
        </>
    )
}