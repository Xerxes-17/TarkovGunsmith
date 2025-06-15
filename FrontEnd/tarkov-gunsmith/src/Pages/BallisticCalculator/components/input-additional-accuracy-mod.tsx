import { Divider, Group, HoverCard, Input, NumberInput, Stack, Text } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";
import { bsgAmmoFactor, getTarkovMOA } from "../types";

export function AdditionalAccuracyModifier() {
    const form = useBallisticCalculatorFormContext();
    const baseAccuracy =
        (form.values.dopeTableSelections.barrelObj
            ? form.values.dopeTableSelections.barrelObj.centerOfImpact
            : form.values.dopeTableSelections.weaponObj?.centerOfImpact) ?? 0;

    const usingBarrelBaseAccuracy: boolean = form.values.dopeTableSelections.barrelObj ? true : false
    const ammoAccuracy = form.values.dopeTableSelections.calculationAmmoObj?.stats.accuracyModifier ?? 0;
    const aam = form.values.additionalAccuracyModifier
    const aamMult = ((100 + aam) / 100) * -1;
    const radiusCm100m = -1 * (100 * baseAccuracy * bsgAmmoFactor(ammoAccuracy) * aamMult)
    const tarkovMOA = -1 * (getTarkovMOA(baseAccuracy, ammoAccuracy, aamMult));
    const realMils = (tarkovMOA * 2) * .2909;

    return (
        <>
            <Divider label="Accuracy" labelPosition="center" />
            <Group grow pl={5} spacing={6}>
                <Stack spacing={4}>
                    <Input.Description>
                        {usingBarrelBaseAccuracy && (
                            <Text size="sm">
                                Barrel Accuracy: <br />
                                {getTarkovMOA(baseAccuracy, 0, 1).toFixed(2)} Tarkov MOA / {baseAccuracy} CRad  <br />
                                Ammo Accuracy: {ammoAccuracy}
                            </Text>
                        )}
                        {!usingBarrelBaseAccuracy && (
                            <Text size="sm">
                                Weapon Accuracy:<br />
                                {getTarkovMOA(baseAccuracy, 0, 1).toFixed(2)} Tarkov MOA / {baseAccuracy} CRad  <br />
                                Ammo Accuracy: {ammoAccuracy}
                            </Text>
                        )}
                    </Input.Description>
                    <NumberInput
                        label={"Additional Accuracy Modifier"}
                        inputWrapperOrder={['label', 'error', 'input', 'description']}
                        precision={1}
                        max={99}
                        min={-99}
                        step={.1}
                        stepHoldDelay={500}
                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                        description={"From weapon durability or muzzle devices. Change this so that Tarkov MOA matches in-game inspect panel value."}
                        {...form.getInputProps("additionalAccuracyModifier")}
                    />

                </Stack>
                <Stack>
                    <Input.Description>
                        <HoverCard width={280} shadow="md">
                            <HoverCard.Target>
                                <Text size="sm">~<b>{tarkovMOA.toFixed(2)} Tarkov MOA</b></Text>
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size="sm">
                                    Yes, BSG has used values representing MOA <i>diameter</i> in a Unity Engine function that expects the <i>radius</i>. Womp Womp. 😢🎺
                                </Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
                        <Text size="sm">
                            ~{radiusCm100m.toFixed(2)} cm radius @ 100m<br />
                            ~{(radiusCm100m * 2).toFixed(2)} cm diameter @ 100m<br />
                            ~{realMils.toFixed(2)} Real Mils <br />
                            ~{(tarkovMOA * 2).toFixed(2)} Real MOA <br />
                        </Text>

                    </Input.Description>

                </Stack>
            </Group>
            <Text size="xs" pl={3} my={1}>
                Note: Currently not rated for buckshot type ammunition.
            </Text>
        </>
    )
}