import { useState } from "react";
import { balCalYupValidator, BallisticCalculatorFormProvider, BallisticSimInput, useBallisticCalculatorForm } from "./ballistic-calculator-form-context";
import { Box, Button, Divider, Grid, Group, Input, MantineProvider, Modal, Stack, Text, Title } from "@mantine/core";

import { requestBallisticCalculation } from "./api-requests";
import { DopeTableUI_Options, DropCalculatorInput, SimulationToCalibrationDistancePair } from "./types";
import { SelectDopeCaliber } from "./components/select-caliber";
import { SelectDopeWeapon } from "./components/select-weapon";
import { SelectDopeBarrel } from "./components/select-barrel";
import { RowCalculationAmmo } from "./form/row-calculation-ammo";
import { RowDefaultAmmo } from "./form/row-default-ammo";
import { AdditionalVelocityModifier } from "./components/input-additional-velocity-mod";
import { InputMaxDistance } from "./components/input-max-distance";
import { DopeResultSection } from "./form/results-section";
import { FrequentlyAskedQuestions } from "./components/frequently-asked-questions";
import { IconHelp } from "@tabler/icons-react";
import { useDisclosure, useScrollIntoView } from "@mantine/hooks";

export function CalculatorForm({ dopeOptions }: { dopeOptions: DopeTableUI_Options }) {
    const [openedFAQ, { open: openFAQ, close: closeFAQ }] = useDisclosure(false);

    const form = useBallisticCalculatorForm({
        initialValues: {
            dopeTableOptions: dopeOptions,
            dopeTableSelections: {
                caliberName: "",
                weaponId: "",
                barrelId: "n/a",
                calculationAmmoId: "",
                calibration: "100"
            },
            maxDistance: 200,
            additionalVelocityModifier: 0,
            finalVelocityModifier: 1
        },
        validate: balCalYupValidator,
    })


    const [result, setResult] = useState<SimulationToCalibrationDistancePair[]>();
    const [resultString, setResultString] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    function onClickGenerate() {
        const validation = form.validate();
        if (validation.hasErrors) {
            scrollIntoViewInputs();
            return;
        }

        const formValues = form.getTransformedValues();
        const defaultAmmo = formValues.dopeTableSelections.defaultAmmo?.stats;
        const secondAmmo = formValues.dopeTableSelections.calculationAmmoObj?.stats;

        if (!defaultAmmo || !secondAmmo) {
            console.log("You fucked up")
            return
        }

        const defaultAmmoInput: BallisticSimInput = {
            AmmoId: defaultAmmo.id,
            BulletMass: defaultAmmo.bulletMass,
            BulletDiameterMillimeters: defaultAmmo.bulletDiameterMillimeters,
            BallisticCoeficient: defaultAmmo.ballisticCoefficient,
            InitialSpeed: defaultAmmo.initialSpeed * formValues.finalVelocityModifier,
            MaxDistance: formValues.maxDistance,
            Damage: defaultAmmo.damage,
            Penetration: defaultAmmo.penetration
        }

        const secondAmmoInput: BallisticSimInput = {
            AmmoId: secondAmmo.id,
            BulletMass: secondAmmo.bulletMass,
            BulletDiameterMillimeters: secondAmmo.bulletDiameterMillimeters,
            BallisticCoeficient: secondAmmo.ballisticCoefficient,
            InitialSpeed: secondAmmo.initialSpeed * formValues.finalVelocityModifier,
            MaxDistance: formValues.maxDistance,
            Damage: secondAmmo.damage,
            Penetration: secondAmmo.penetration
        }

        const calibrationDistances = formValues.dopeTableOptions.calibrationRanges.filter(x => x <= formValues.maxDistance)

        const dropCalculatorInput: DropCalculatorInput = {
            defaultAmmoInput,
            secondAmmoInput,
            calibrationDistances
        }

        setResultString(`${formValues.dopeTableSelections.weaponObj?.shortName} (defAmmo: ${formValues.dopeTableSelections.defaultAmmo?.ammoLabel}) with ${formValues.dopeTableSelections.calculationAmmoObj?.ammoLabel} @ ${formValues.finalVelocityModifier.toFixed(3)} velocity multiplier.`)

        handleSubmit(dropCalculatorInput);
    }

    function handleSubmit(values: DropCalculatorInput) {
        requestBallisticCalculation(values).then(response => {
            setResult(response)
            form.resetDirty();
        }).catch(error => {
            alert(`The error was: ${error}`);
        });
        setIsLoading(false);
        setResult(undefined)
        scrollIntoView()
    }

    const calibrationRangesJoin = form.values.dopeTableOptions.calibrationRanges.filter(x => x <= form.values.maxDistance).join(", ")

    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
        offset: 60,
        easing: (t) => 1, // easeInOutQuint
    });

    const { scrollIntoView: scrollIntoViewInputs, targetRef: targetRefInputs } = useScrollIntoView<HTMLDivElement>({
        offset: 60,
        easing: (t) => 1, // easeInOutQuint
    });


    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: 'dark',
                breakpoints: {
                    xs: '30em', // 480
                    sm: '48em', // 766
                    md: '64em', // 1024
                    lg: '74em', // 1184
                    xl: '1540px',
                },
            }}>
            <BallisticCalculatorFormProvider form={form}>
                <form >
                    <Grid columns={24} px={4}>
                        <Grid.Col span={24} sm={12} md={10} lg={8} xl={6} >
                            <Divider ref={targetRefInputs} label="Weapon" labelPosition="center" />
                            <Stack spacing={"xs"}>
                                <Grid gutter={4}>
                                    <Grid.Col span={12}>
                                        <Group grow spacing={4}>
                                            <SelectDopeCaliber />
                                            <SelectDopeWeapon />
                                        </Group>
                                    </Grid.Col>
                                    <Grid.Col span={12}>
                                        <Group grow spacing={4} align="end">
                                            <SelectDopeBarrel />
                                            <AdditionalVelocityModifier />
                                        </Group>
                                    </Grid.Col>
                                </Grid>

                                <RowDefaultAmmo />

                                <Divider label="Calculation Ammo" labelPosition="center" />
                                <RowCalculationAmmo />

                                <Divider label="Misc" labelPosition="center" />

                                <Group pl={5} spacing={5} mb={5}>
                                    <InputMaxDistance />
                                    <Grid pl={10} grow>
                                        <Grid.Col pl={5} span={12}>
                                            <Input.Label >Calibrations: </Input.Label>
                                            <Text pt={6} pb={6}>{calibrationRangesJoin}.</Text>
                                        </Grid.Col>
                                    </Grid>

                                </Group>
                                <Group grow>
                                    <Button fullWidth ml={10} mr={10} onClick={onClickGenerate}>
                                        Generate Drop Table
                                    </Button>
                                </Group>
                                <Input.Description ml={20} w="auto">A very special thanks to "sw_tower" whose help was integral to this feature.</Input.Description>

                                {result && (
                                    <>
                                        <Group position="center">
                                            <Button compact color="cyan" leftIcon={<IconHelp size="1rem" />} ml={10} mr={10} onClick={openFAQ} >
                                                Frequently Asked Questions
                                            </Button>
                                        </Group>
                                        <Modal opened={openedFAQ} onClose={closeFAQ} title={<Title order={3}>Frequently Asked Questions</Title>}>
                                            <FrequentlyAskedQuestions />
                                        </Modal>
                                    </>
                                )}
                            </Stack>

                        </Grid.Col>

                        <Grid.Col span={24} sm={12} md={14} lg={16} xl={18} >
                            {!result && (
                                <Box>
                                    <Divider label="Frequently Asked Questions" labelPosition="center" />
                                    <FrequentlyAskedQuestions />
                                </Box>
                            )}
                            {result && (
                                <>
                                    <Divider ref={targetRef} label="Result" labelPosition="center" />
                                    <DopeResultSection isLoading={isLoading} result={result} resultString={resultString} />
                                </>
                            )}
                        </Grid.Col>
                    </Grid>
                </form>
            </BallisticCalculatorFormProvider>
        </MantineProvider>
    )
}