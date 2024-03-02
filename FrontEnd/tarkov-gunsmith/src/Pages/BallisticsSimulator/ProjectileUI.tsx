import { Divider, Stack, Title, Text, Group, SimpleGrid } from "@mantine/core";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";
import { NumberLabelAndSliderPercentage } from "../../Components/Common/Inputs/NumberLabelAndSliderPercentage";
import { useBallisticSimulatorFormContext } from "./ballistic-simulator-form-context";
import { DrawerButton } from "../../Components/Common/Inputs/DrawerButton";
import { IconSearch, IconShieldPlus } from "@tabler/icons-react";
import { ArmorDamagePercentageWithToolTip } from "../../Components/Common/TextWithToolTips/ArmorDamagePercentage";
import { useViewportSize } from "@mantine/hooks";
import { AmmoTableRow, filterNonBulletsOut, mapAmmoCaliberFullNameToLabel } from "../../Types/AmmoTypes";
import { useEffect, useState } from "react";
import { getAmmoDataFromApi_TarkovDev } from "../../Api/AmmoApiCalls";

const MAX_PENETRATION = 90;
const MAX_DAMAGE = 265;

const searchIcon = <IconSearch size="1.2rem" />

export function ProjectileUI() {
    const form = useBallisticSimulatorFormContext();
    const { width } = useViewportSize();

    const effectiveDurabilityDamageDes = (
        <Text size="sm">
            Eff. Durability Dmg: <b>{(form.values.penetration * form.values.armorDamagePercentage / 100).toFixed(2)}</b>
        </Text>
    )
    const isDesktop = width >= 1032
    const isMobile = width < 1032;

    const initialData: AmmoTableRow[] = [];
    const [ammoData, setAmmoData] = useState<AmmoTableRow[]>(initialData);

    async function getAmmoData() {
        const response_ApiTarkovDev = await getAmmoDataFromApi_TarkovDev()
        if (response_ApiTarkovDev !== null) {
            setAmmoData(filterNonBulletsOut(response_ApiTarkovDev));
            return;
        }

        console.error("Error: Both WishGranter and ApiTarkovDev failed to respond (correctly).")
    }
    useEffect(() => {
        getAmmoData();
    }, [])

    const matched = ammoData.find(x => x.penetrationPower === form.values.penetration && x.damage === form.values.damage && x.armorDamagePerc === form.values.armorDamagePercentage)
    const matchedString = matched ? `${mapAmmoCaliberFullNameToLabel(matched?.caliber)} ${matched?.shortName}` : 'Custom/No match'
    return (
        <>
            {isDesktop && (
                <Group spacing={"md"} align="flex-start">
                    <Stack spacing={2}>
                        <Divider mt={6} label={(<Group spacing={8}><Title order={4}>Projectile Info</Title> <DrawerButton leftIcon={searchIcon} buttonLabel={"Search"} ammoOrArmor="ammo" /></Group>)} />
                        <Text>{matchedString}</Text>
                    </Stack>

                    <NumberAndSlider w={100} label={"Penetration"} property={"penetration"} precision={2} max={MAX_PENETRATION} min={1} step={1} />
                    <NumberAndSlider w={130} label={"Damage"} property={"damage"} precision={2} max={MAX_DAMAGE} min={1} step={1} />
                    <NumberLabelAndSliderPercentage
                        label={<ArmorDamagePercentageWithToolTip />}
                        description={effectiveDurabilityDamageDes}
                        property={"armorDamagePercentage"}
                        precision={2}
                        step={1}
                    />
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
                        <Divider mt={6} label={(<Group spacing={8}><Title order={4}>Projectile Info</Title> <DrawerButton leftIcon={searchIcon} buttonLabel={"Search"} ammoOrArmor="ammo" /></Group>)} />
                        <Text>{matchedString}</Text>
                    </Stack>
                    <NumberAndSlider w={"100%"} label={"Penetration"} property={"penetration"} precision={2} max={MAX_PENETRATION} min={1} step={1} />
                    <NumberAndSlider w={"100%"} label={"Damage"} property={"damage"} precision={2} max={MAX_DAMAGE} min={1} step={1} />
                    <NumberLabelAndSliderPercentage
                        label={<ArmorDamagePercentageWithToolTip />}
                        description={effectiveDurabilityDamageDes}
                        property={"armorDamagePercentage"}
                        precision={2}
                        step={1}
                    />
                </SimpleGrid>
            )}
        </>



    )
}