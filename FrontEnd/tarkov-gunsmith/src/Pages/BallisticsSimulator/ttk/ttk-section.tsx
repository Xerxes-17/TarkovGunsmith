import { useEffect, useMemo, useState } from "react";
import {
    Alert,
    Box,
    Button,
    Collapse,
    Divider,
    Group,
    List,
    LoadingOverlay,
    NumberInput,
    Overlay,
    Paper,
    Text,
    Title,
} from "@mantine/core";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";

import { useBallisticSimulatorFormContext } from "../ballistic-simulator-form-context";
import { convertArmorStringToEnumVal } from "../../../Components/ADC/ArmorData";
import { TtkMatrixParameters, TtkMatrixResult, requestTtkMatrix } from "../api-requests";
import {
    DEFAULT_SEMI_AUTO_RPM_CAP,
    DEFAULT_TTK_CONFIDENCE,
    DEFAULT_TTK_DISTANCE,
    buildTtkRows,
    keepBestAmmoPerWeapon,
} from "./ttk-types";
import { TtkResultsTable } from "./ttk-results-table";
import { TtkTopResultsChart } from "./ttk-top-results-chart";

export interface TtkSectionProps {
    opened: boolean;
}

export function TtkSection({ opened }: TtkSectionProps) {
    const form = useBallisticSimulatorFormContext();

    const [distance, setDistance] = useState<number | "">(DEFAULT_TTK_DISTANCE);
    const [confidence, setConfidence] = useState<number | "">(DEFAULT_TTK_CONFIDENCE);
    const [semiAutoRpmCap, setSemiAutoRpmCap] = useState<number | "">(DEFAULT_SEMI_AUTO_RPM_CAP);
    const [bestAmmoPerWeaponOnly, setBestAmmoPerWeaponOnly] = useState<boolean>(false);

    const [matrix, setMatrix] = useState<TtkMatrixResult>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isStale, setIsStale] = useState<boolean>(false);

    const targetZone = form.values.targetZone;

    // Only the thorax and the head kill outright at zero HP. The other zones black out and bleed
    // damage into the thorax, which this model does not follow, so the number means something else.
    const zoneIsLethal = targetZone === "Thorax" || targetZone === "Head";

    const confidenceValue = typeof confidence === "number" ? confidence : DEFAULT_TTK_CONFIDENCE;
    const rpmCapValue = typeof semiAutoRpmCap === "number" ? semiAutoRpmCap : DEFAULT_SEMI_AUTO_RPM_CAP;

    function runTtkMatrix() {
        const requestDetails: TtkMatrixParameters = {
            initialHitPoints: form.values.hitPointsPool,
            targetZone: form.values.targetZone,
            distance: typeof distance === "number" ? distance : DEFAULT_TTK_DISTANCE,
            maxHits: 60,
            armorLayers: form.values.armorLayers.map((layer) => {
                return {
                    isPlate: layer.isPlate,
                    armorClass: layer.armorClass,
                    bluntDamageThroughput: layer.bluntDamageThroughput,
                    durability: layer.durability,
                    maxDurability: layer.maxDurability,
                    armorMaterial: convertArmorStringToEnumVal(layer.armorMaterial),
                };
            }),
        };

        setIsLoading(true);
        requestTtkMatrix(requestDetails)
            .then((response) => {
                setMatrix(response);
                setIsStale(false);
            })
            .catch((error) => {
                alert(`The error was: ${error}`);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }

    // Kick off the first run when the section is opened, then leave refreshing to the user.
    useEffect(() => {
        if (opened && matrix === undefined && !isLoading) {
            runTtkMatrix();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [opened]);

    // The armor stack and target zone feed the simulation, so changing them invalidates the results.
    useEffect(() => {
        if (matrix !== undefined) {
            setIsStale(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(form.values.armorLayers), form.values.targetZone, form.values.hitPointsPool]);

    // Confidence and the semi auto cap are applied to the returned kill curves, so they never need
    // another request.
    const allRows = useMemo(() => {
        if (!matrix) {
            return [];
        }
        return buildTtkRows(matrix, confidenceValue, rpmCapValue);
    }, [matrix, confidenceValue, rpmCapValue]);

    const displayedRows = useMemo(() => {
        return bestAmmoPerWeaponOnly ? keepBestAmmoPerWeapon(allRows) : allRows;
    }, [allRows, bestAmmoPerWeaponOnly]);

    const reachableCount = displayedRows.filter((row) => Number.isFinite(row.ttkSeconds)).length;

    return (
        <Collapse in={opened}>
            <Box pos="relative" mt="xs">
                <LoadingOverlay visible={isLoading} overlayBlur={2} />

                <Paper p="xs" withBorder mt="xs">
                    <Group align="flex-end" spacing="md">
                        <NumberInput
                            w={130}
                            label="Distance (m)"
                            description="Re-runs the sim"
                            min={1}
                            max={500}
                            step={5}
                            value={distance}
                            onChange={setDistance}
                        />
                        <NumberInput
                            w={150}
                            label="Kill confidence (%)"
                            description="Applied instantly"
                            min={1}
                            max={98}
                            step={1}
                            value={confidence}
                            onChange={setConfidence}
                        />
                        <NumberInput
                            w={170}
                            label="Semi auto RPM cap"
                            description="Human click rate"
                            min={30}
                            max={900}
                            step={10}
                            value={semiAutoRpmCap}
                            onChange={setSemiAutoRpmCap}
                        />
                        <Button
                            leftIcon={<IconRefresh size="1rem" />}
                            onClick={runTtkMatrix}
                            variant={isStale ? "filled" : "outline"}
                            data-html2canvas-ignore
                        >
                            {matrix === undefined ? "Calculate" : "Recalculate"}
                        </Button>
                    </Group>
                </Paper>

                {isStale && matrix !== undefined && (
                    <Text mt="xs" color="orange">
                        Armor or target inputs changed, recalculate to update these results.
                    </Text>
                )}

                {!zoneIsLethal && (
                    <Alert
                        icon={<IconAlertTriangle size="1rem" />}
                        color="orange"
                        mt="xs"
                        title={`${targetZone} is not a lethal zone`}
                    >
                        A {targetZone.toLowerCase()} reaching zero HP blacks the limb out rather than
                        killing, and the spill-over damage into the thorax is not modelled here. Read
                        these times as time to black out the {targetZone.toLowerCase()}, not time to
                        kill. Switch to Thorax or Head for true time to kill.
                    </Alert>
                )}

                {matrix !== undefined && (
                    <Box pos="relative" mt="xs">
                        {isStale && <Overlay color="#000" opacity={0.6} center />}

                        <Text size="sm" color="dimmed" my="xs">
                            {displayedRows.length.toLocaleString()} gun and ammo combinations,{" "}
                            {reachableCount.toLocaleString()} of which reach {confidenceValue}%
                            confidence within {matrix.inputs.maxHits} hits. Simulated at{" "}
                            {matrix.inputs.distance}m against the armor configured above.
                        </Text>

                        <TtkResultsTable
                            rows={displayedRows}
                            bestAmmoPerWeaponOnly={bestAmmoPerWeaponOnly}
                            onToggleBestAmmoPerWeapon={setBestAmmoPerWeaponOnly}
                            confidence={confidenceValue}
                        />

                        <Divider
                            my="xs"
                            label={<Title order={5}>Fastest 15 combinations</Title>}
                        />
                        <TtkTopResultsChart rows={displayedRows} />

                        <Divider my="xs" label={<Title order={5}>Assumptions</Title>} />
                        <List size="sm" spacing={4} withPadding>
                            <List.Item>
                                Time to kill is measured from the first shot landing, so a one hit
                                kill is 0.000s and an N hit kill spans N-1 firing intervals.
                            </List.Item>
                            <List.Item>
                                Every shot is assumed to hit the selected zone. Recoil, spread,
                                magazine capacity and reloads are not modelled, so full auto weapons
                                rank optimistically against how they play.
                            </List.Item>
                            <List.Item>
                                Full auto and burst weapons use their cyclic rate. Weapons that only
                                fire single shots are capped at the semi auto RPM above, because the
                                game's listed single fire rate is faster than a person can click.
                                Those listed rates sit between 330 and 700, so at the default cap of{" "}
                                {DEFAULT_SEMI_AUTO_RPM_CAP} every semi auto weapon fires at the same
                                rate and they are separated purely by their ammo. Raise the cap to
                                let the faster actions pull ahead.
                            </List.Item>
                            <List.Item>
                                Armor durability is tracked as an expected value rather than jointly
                                with the health distribution, so the kill curve is most reliable
                                through its middle. Thresholds above roughly 90% carry noticeably
                                more model error than moderate ones.
                            </List.Item>
                            <List.Item>
                                Multi projectile shells count each pellet as a hit, which is why
                                trigger pulls and hits to kill differ for buckshot.
                            </List.Item>
                        </List>
                    </Box>
                )}
            </Box>
        </Collapse>
    );
}
