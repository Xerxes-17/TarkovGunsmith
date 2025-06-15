import { useState, useEffect } from "react";
import { balCalYupValidator, BallisticCalculatorFormProvider, useBallisticCalculatorForm } from "./ballistic-calculator-form-context";
import { Box, Button, Center, Divider, Grid, Group, Input, Loader, MantineProvider, Modal, Stack, Text, Title, HoverCard, Portal } from "@mantine/core";
import { requestBallisticCalculation } from "./api-requests";
import { BDC_Result, DopeTableUI_Options, DropCalculatorInput, getModifiedCRadForResults } from "./types";
import { SelectDopeCaliber } from "./components/select-caliber";
import { SelectDopeWeapon } from "./components/select-weapon";
import { SelectDopeBarrel } from "./components/select-barrel";
import { RowCalculationAmmo } from "./form/row-calculation-ammo";
import { RowDefaultAmmo } from "./form/row-default-ammo";
import { AdditionalVelocityModifier } from "./components/input-additional-velocity-mod";
import { InputMaxDistance } from "./components/input-max-distance";
import { DopeResultSection } from "./form/results-section";
import { FrequentlyAskedQuestions } from "./components/frequently-asked-questions";
import { IconDatabase, IconHelp } from "@tabler/icons-react";
import { useDisclosure, useScrollIntoView, useHover } from "@mantine/hooks";
import { InputHeightOverBore } from "./components/input-height-over-bore";
import { PresetManager } from "./components/preset-manager";
import { DropCalculatorInputWithMeta } from "./types";
import { AdditionalAccuracyModifier } from "./components/input-additional-accuracy-mod";

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
            additionalAccuracyModifier: 0,
            finalVelocityModifier: 1,
            lineOfSightOverBore: 68.58
        },
        validate: balCalYupValidator,
    })

    const [result, setResult] = useState<BDC_Result>();
    const [resultString, setResultString] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [presetLoaded, setPresetLoaded] = useState(false);
    const { hovered: presetSavedHovered, ref: presetSavedRef } = useHover();

    useEffect(() => {
        if (presetLoaded && form.isValid()) {
            onClickGenerate();
            setPresetLoaded(false);
        }
    }, [presetLoaded, form.isValid()]);

    function onClickGenerate() {
        const validation = form.validate();
        if (validation.hasErrors) {
            scrollIntoViewInputs();
            return;
        }
        setIsLoading(true);

        const formValues = form.getTransformedValues();
        const defaultAmmo = formValues.dopeTableSelections.defaultAmmo?.stats;
        const secondAmmo = formValues.dopeTableSelections.calculationAmmoObj?.stats;

        if (!defaultAmmo || !secondAmmo) {
            console.log("Ammo data missing");
            return;
        }

        const baseAccuracy =
            (form.values.dopeTableSelections.barrelObj
                ? form.values.dopeTableSelections.barrelObj.centerOfImpact
                : form.values.dopeTableSelections.weaponObj?.centerOfImpact) ?? 0;
        const ammoAccuracy = form.values.dopeTableSelections.calculationAmmoObj?.stats.accuracyModifier ?? 0;
        const aam = form.values.additionalAccuracyModifier;
        const aamMult = ((100 + aam) / 100) * -1;
        const modifiedCRad = getModifiedCRadForResults(baseAccuracy, ammoAccuracy, aamMult);

        const calibrationDistances = formValues.dopeTableOptions.calibrationRanges.filter(x => x <= formValues.maxDistance);
        const lineOfSightOverBore = formValues.lineOfSightOverBore / 1000; // Convert mm to m

        const dropCalculatorInput: DropCalculatorInputWithMeta = {
            defaultAmmoInput: {
                AmmoId: defaultAmmo.id,
                BulletMass: defaultAmmo.bulletMass,
                BulletDiameterMillimeters: defaultAmmo.bulletDiameterMillimeters,
                BallisticCoeficient: defaultAmmo.ballisticCoefficient,
                InitialSpeed: defaultAmmo.initialSpeed * formValues.finalVelocityModifier,
                MaxDistance: formValues.maxDistance,
                Damage: defaultAmmo.damage,
                Penetration: defaultAmmo.penetration
            },
            secondAmmoInput: {
                AmmoId: secondAmmo.id,
                BulletMass: secondAmmo.bulletMass,
                BulletDiameterMillimeters: secondAmmo.bulletDiameterMillimeters,
                BallisticCoeficient: secondAmmo.ballisticCoefficient,
                InitialSpeed: secondAmmo.initialSpeed * formValues.finalVelocityModifier,
                MaxDistance: formValues.maxDistance,
                Damage: secondAmmo.damage,
                Penetration: secondAmmo.penetration
            },
            calibrationDistances,
            lineOfSightOverBore,
            caliberName: form.values.dopeTableSelections.caliberName,
            weaponId: form.values.dopeTableSelections.weaponId,
            barrelId: form.values.dopeTableSelections.barrelId,
        };

        setResultString(
            `${formValues.dopeTableSelections.weaponObj?.shortName} ` +
            `(defAmmo: ${formValues.dopeTableSelections.defaultAmmo?.ammoLabel}) ` +
            `with ${formValues.dopeTableSelections.calculationAmmoObj?.ammoLabel} ` +
            `@ ${formValues.finalVelocityModifier.toFixed(3)} velocity multiplier ` +
            `and ${formValues.lineOfSightOverBore.toFixed(2)}mm height over bore.`
        );

        handleSubmit(dropCalculatorInput, modifiedCRad);
    }

    const [presetNotification, setPresetNotification] = useState<{
        message: string;
        color: string;
    } | null>(null);

    function handleSubmit(values: DropCalculatorInput, accuracyAsCRads: number) {
        requestBallisticCalculation(values)
            .then(response => {
                const bundledResponse: BDC_Result =
                {
                    totalWeaponAccuracyCRads: accuracyAsCRads,
                    dataPoints: response
                }

                setResult(bundledResponse);
                form.resetDirty();
            })
            .catch(error => {
                alert(`Calculation error: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
                scrollIntoView();
            });
    }

    const calibrationRangesJoin = form.values.dopeTableOptions.calibrationRanges
        .filter(x => x <= form.values.maxDistance)
        .join(", ");

    const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({ offset: 60 });
    const { scrollIntoView: scrollIntoViewInputs, targetRef: targetRefInputs } = useScrollIntoView<HTMLDivElement>({ offset: 60 });

    const getCurrentFormState = () => ({
        dopeTableSelections: form.values.dopeTableSelections,
        maxDistance: form.values.maxDistance,
        additionalVelocityModifier: form.values.additionalVelocityModifier,
        finalVelocityModifier: form.values.finalVelocityModifier,
        lineOfSightOverBore: form.values.lineOfSightOverBore
    });

    return (
        <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={{
                colorScheme: 'dark',
                breakpoints: {
                    xs: '30em',
                    sm: '48em',
                    md: '64em',
                    lg: '74em',
                    xl: '1540px',
                },
            }}>
            <BallisticCalculatorFormProvider form={form}>
                <form>
                    <Grid columns={24} px={4}>
                        <Grid.Col span={24} sm={12} md={10} lg={8} xl={6}>
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

                                <AdditionalAccuracyModifier />

                                <Divider label="Misc" labelPosition="center" />

                                <Group pl={5} spacing={5}>
                                    <InputMaxDistance />
                                    <Grid pl={8} grow>
                                        <Grid.Col pl={5} span={6}>
                                            <Input.Label>Calibrations: </Input.Label>
                                            <Text pt={6} pb={6}>{calibrationRangesJoin}.</Text>
                                        </Grid.Col>
                                    </Grid>
                                </Group>

                                <Group pl={5} spacing={5}>
                                    <Grid pl={8} grow>
                                        <Grid.Col pl={0} span={3}>
                                            <InputHeightOverBore />
                                        </Grid.Col>
                                        <Grid.Col pt={12} pl={5} span={7}>
                                            <Input.Description>
                                                The distance in mm between the bore axis and sight axis of your weapon.
                                                <br />A usual 2.7" distance is 68.58mm.
                                                <br />Don't know what this is? Don't touch it.
                                            </Input.Description>
                                        </Grid.Col>
                                    </Grid>
                                </Group>

                                <Group grow>
                                    <PresetManager
                                        onLoad={(presetData) => {
                                            form.reset();
                                            form.setValues({
                                                ...form.values,
                                                ...presetData,
                                                dopeTableSelections: {
                                                    ...form.values.dopeTableSelections,
                                                    ...presetData.dopeTableSelections,
                                                    defaultAmmo: presetData.dopeTableSelections.defaultAmmo,
                                                    calculationAmmoObj: presetData.dopeTableSelections.calculationAmmoObj
                                                }
                                            });
                                            setPresetLoaded(true);
                                            onClickGenerate()
                                        }}
                                        getCurrentState={getCurrentFormState}
                                    />
                                    <Button
                                        fullWidth
                                        ml={10}
                                        mr={10}
                                        onClick={onClickGenerate}
                                        disabled={isLoading}
                                    >
                                        Generate Drop Table
                                    </Button>

                                </Group>
                                <Portal>
                                    <HoverCard
                                        position="bottom"
                                        withArrow
                                        arrowSize={6}
                                        shadow="md"
                                        withinPortal
                                    >
                                        <HoverCard.Target>
                                            <div
                                                ref={presetSavedRef}
                                                style={{
                                                    position: 'fixed',
                                                    bottom: 20,
                                                    right: 20,
                                                    zIndex: 1000,
                                                    opacity: 0,
                                                    width: 1,
                                                    height: 1
                                                }}
                                            />
                                        </HoverCard.Target>
                                        <HoverCard.Dropdown>
                                            <Text color={presetNotification?.color || 'black'}>
                                                {presetNotification?.message}
                                            </Text>
                                        </HoverCard.Dropdown>
                                    </HoverCard>
                                </Portal>
                                {presetNotification && (
                                    <div style={{
                                        position: 'fixed',
                                        bottom: 20,
                                        right: 20,
                                        backgroundColor: presetNotification.color,
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: 5,
                                        zIndex: 1000
                                    }}>
                                        {presetNotification.message}
                                    </div>
                                )}
                                <Input.Description ml={20} w="auto">
                                    A very special thanks to "sw_tower" whose help was integral to this feature.
                                </Input.Description>

                                {result && (
                                    <>
                                        <Group position="center">
                                            <Button
                                                compact
                                                color="cyan"
                                                leftIcon={<IconHelp size="1rem" />}
                                                ml={10}
                                                mr={10}
                                                onClick={openFAQ}
                                            >
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

                        <Grid.Col ref={targetRef} span={24} sm={12} md={14} lg={16} xl={18}>
                            {isLoading && (
                                <Center mih={250}>
                                    <Stack spacing={2} py={10} mb={5} align="center">
                                        <Loader size="xl" />
                                        <Text>Prayers sent to WishGranter, Слава моноліту!!</Text>
                                        <IconDatabase size="5rem" color="#3e9eed" />
                                    </Stack>
                                </Center>
                            )}

                            {!result && !isLoading && (
                                <Box>
                                    <Divider label="Frequently Asked Questions" labelPosition="center" />
                                    <FrequentlyAskedQuestions />
                                </Box>
                            )}
                            {result && !isLoading && (
                                <>
                                    <Divider label="Result" labelPosition="center" />
                                    <DopeResultSection
                                        isLoading={isLoading}
                                        result={result}
                                        resultString={resultString}
                                    />
                                </>
                            )}
                        </Grid.Col>
                    </Grid>
                </form>
            </BallisticCalculatorFormProvider>
        </MantineProvider>
    )
}