import { Button, Text, Group, Grid, Divider, Title, LoadingOverlay, Box, Table, Overlay, Center, SegmentedControl, Stack } from "@mantine/core";
import { BallisticSimulatorFormProvider, BallisticSimulatorFormValues, useBallisticSimulatorForm } from "./ballistic-simulator-form-context";
import { ArmorLayerUI } from "./ArmorLayerUI";
import { ProjectileUI } from "./ProjectileUI";
import { Dispatch, SetStateAction, useState } from "react";
import { BallisticSimParameters, BallisticSimResponse, requestSingleShotBallisticSim } from "./api-requests";
import { convertArmorStringToEnumVal } from "../../Components/ADC/ArmorData";
import { LINKS } from "../../Util/links";
import { BallisticSimulatorSingleShotGraph, ChartModes } from '../../Components/Common/Graphs/Charts/BallisticSimulatorSingleShotGraph';
import { ReductionFactorWTT } from "../../Components/Common/TextWithToolTips/ReductionFactorWTT";
import { RemoveArmorLayerButton } from "../../Components/Common/Inputs/RemoveArmorLayerButton";
import { AddArmorLayerButton } from "../../Components/Common/Inputs/AddArmorLayerButton";

function camelCaseToWords(str: string) {
    return str.replace(/([A-Z])/g, ' $1').trim();
}

interface PenAndDamFormProps {
    layerCountCb: Dispatch<SetStateAction<number>>;
}

export function PenetrationAndDamageForm({ layerCountCb }: PenAndDamFormProps) {
    const form = useBallisticSimulatorForm({
        initialValues: {
            penetration: 28,
            damage: 53,
            armorDamagePercentage: 40,

            hitPointsPool: 85,

            armorLayers: [{
                isPlate: false,
                armorClass: 4,
                durability: 44,
                maxDurability: 44,
                armorMaterial: "Ceramic",
                bluntDamageThroughput: 28,
            }]
        }
    });

    const [result, setResult] = useState<BallisticSimResponse[]>([]);
    const [hasResult, setHasResult] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [chartMode, setChartMode] = useState<ChartModes>('bar');

    const layerCount = form.values.armorLayers.length;
    layerCountCb(layerCount);

    //todo compare with other sim
    // interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    //     image: string;
    //     label: string;
    //     destructibility: string;
    //     explosionDestructibility: string;
    // }

    // const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    //     ({ image, label, destructibility, ...others }: ItemProps, ref) => (
    //         <div ref={ref} {...others}>
    //             <Group noWrap>
    //                 <div>
    //                     <Text size="sm">{label}</Text>
    //                     <Text size="xs" opacity={0.65}>
    //                         Destructibility: {destructibility}
    //                     </Text>
    //                 </div>
    //             </Group>
    //         </div>
    //     )
    // );

    const layers = result?.length ?? 1;

    const thElements: any[] = [];

    for (let i = 1; i <= layers; i++) {
        thElements.push(<th>Layer {i}</th>);
    }

    const transposedDictionary: Record<string, string[]> = {};

    result.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
            const fieldName = camelCaseToWords(key);
            if (!transposedDictionary[fieldName]) {
                transposedDictionary[fieldName] = [];
            }
            if (fieldName === "Penetration Chance") {
                transposedDictionary[fieldName].push(`${(value * 100).toFixed(1)} %`);
            }
            else if (fieldName === "Reduction Factor") {
                transposedDictionary[fieldName].push(`${(value * 100).toFixed(1)} %`);
            }
            else {
                transposedDictionary[fieldName].push(value.toFixed(2));
            }
        });
    });


    const elements = [
        { name: 'Penetration Chance', Value: "-", Id: 'Penetration Chance' },
        { name: 'Penetration Damage', Value: "-", Id: 'Penetration Damage' },
        { name: 'Mitigated Damage', Value: "-", Id: 'Mitigated Damage' },
        { name: 'Blunt Damage', Value: "-", Id: 'Blunt Damage' },
        { name: 'Average Damage', Value: "-", Id: 'Average Damage' },
        { name: 'Penetration Armor Damage', Value: "-", Id: 'Penetration Armor Damage' },
        { name: 'Block Armor Damage', Value: "-", Id: 'Block Armor Damage' },
        { name: 'Average Armor Damage', Value: "-", Id: 'Average Armor Damage' },
        { name: 'Post-hit Armor Durability', Value: "-", Id: 'Post-hit Armor Durability' },
        { name: <ReductionFactorWTT />, Value: "-", Id: 'Reduction Factor' },
        { name: 'Post Armor Penetration', Value: "-", Id: 'Post Armor Penetration' },
    ];

    const initialRows = elements.map(row =>
    (
        <tr key={row.Id}>
            <td>{row.Value}</td>
            <td>{row.name}</td>
        </tr>
    )
    )

    const rows = Object.keys(transposedDictionary).map((key) => (
        <tr key={key}>
            {transposedDictionary[key].map(value => {
                return <td>{value}</td>
            })}
            <td>{key}</td>
        </tr>
    ));

    function handleSubmit(values: BallisticSimulatorFormValues) {
        setIsLoading(true);
        const requestDetails: BallisticSimParameters = {
            penetration: values.penetration,
            damage: values.damage,
            armorDamagePerc: values.armorDamagePercentage,
            hitPoints: values.hitPointsPool,

            armorLayers: values.armorLayers.map(layer => {
                return {
                    isPlate: layer.isPlate,
                    armorClass: layer.armorClass,
                    bluntDamageThroughput: layer.bluntDamageThroughput,
                    durability: layer.durability,
                    maxDurability: layer.maxDurability,
                    armorMaterial: convertArmorStringToEnumVal(layer.armorMaterial)
                }
            })
        }

        requestSingleShotBallisticSim(requestDetails).then(response => {
            setResult(response)
            setHasResult(true);
            form.resetDirty();
        }).catch(error => {
            alert(`The error was: ${error}`);
        });
        setIsLoading(false);
    }

    function onClickIterate() {
        for (let index = 0; index < result.length; index++) {
            const element = result[index];
            form.setFieldValue(`armorLayers.${index}.durability`, element.PostHitArmorDurability > 0 ? element.PostHitArmorDurability : 0)
        }
        const values = form.getTransformedValues();

        for (let index = 0; index < values.armorLayers.length; index++) {
            const element = result[index];
            values.armorLayers[index].durability = element.PostHitArmorDurability > 0 ? element.PostHitArmorDurability : 0;
        }
        handleSubmit(values);
    }

    return (
        <BallisticSimulatorFormProvider form={form}>
            <form onSubmit={form.onSubmit((values) => {
                // console.log(values);
                setIsLoading(true);
                handleSubmit(values);
            })}>
                <LoadingOverlay visible={isLoading} overlayBlur={2} />
                <Stack spacing={2}>
                    <ProjectileUI />
                    {form.values.armorLayers.map((_, index) => {
                        return (
                            <ArmorLayerUI index={index} />
                        )
                    })}
                    <Group>
                        {form.values.armorLayers.length > 1 && (
                            <RemoveArmorLayerButton index={form.values.armorLayers.length - 1} />
                        )}
                        {form.values.armorLayers.length < 3 && (
                            <AddArmorLayerButton index={form.values.armorLayers.length - 1} />
                        )}

                    </Group>
                    <Grid gutter="xs">
                        {/* Results */}
                        <Grid.Col span={12} md={6}>
                            <Box pos="relative" h={"100%"}>
                                <Divider my="xs" label={(<Title order={4}>Results</Title>)} />
                                <Box pos="relative">

                                    {form.isDirty() && result !== undefined && <Overlay color="#000" opacity={0.60} center />}
                                    <Table highlightOnHover withColumnBorders verticalSpacing="5px">
                                        <thead>
                                            <tr>
                                                {thElements.map(th => { return th })}
                                                {result.length < 1 && (
                                                    <th>Value</th>
                                                )}
                                                <th>Statistic</th>
                                            </tr>
                                        </thead>
                                        <tbody>{rows}</tbody>
                                        {result.length < 1 && (
                                            <tbody>{initialRows}</tbody>
                                        )}
                                    </Table>
                                </Box>
                                {form.isDirty() && result !== undefined && (<Text>Input changed, results will not match.</Text>)}
                            </Box>
                        </Grid.Col>
                        {/* Charts */}
                        <Grid.Col span={12} md={6}>
                            {result.length > 0 && (
                                <Box pos="relative">
                                    <Divider label={(
                                        <Group spacing={8} >
                                            <Title order={4}>Graph</Title>
                                            {result.length > 1 && (
                                                <SegmentedControl
                                                    value={chartMode}
                                                    onChange={value => {
                                                        if (value === 'line' || value === 'bar')
                                                            setChartMode(value)
                                                    }}
                                                    data={[
                                                        { label: 'Bar', value: 'bar' },
                                                        { label: 'Line', value: 'line' },
                                                    ]}
                                                />
                                            )}

                                        </Group>

                                    )} />
                                    <Box pos="relative">
                                        {form.isDirty() && result !== undefined && <Overlay color="#000" opacity={0.60} center />}
                                        <BallisticSimulatorSingleShotGraph chartData={result} mode={chartMode} />
                                    </Box>
                                </Box>
                            )}
                        </Grid.Col>
                    </Grid>

                </Stack>

                <Group position="right" mt="md">
                    {result.length > 0 && (
                        <Text color="gray.7" size={"sm"} mr={"auto"}>Time generated: {new Date().toUTCString()} and is from https://tarkovgunsmith.com{LINKS.BALLISTICS_SIMULATOR}</Text>
                    )}

                    {result.length > 0 && !form.isDirty() && (
                        <Button onClick={onClickIterate} variant="outline" data-html2canvas-ignore>
                            Iterate
                        </Button>
                    )}
                    
                    <Button type="submit" data-html2canvas-ignore disabled={result.length > 0 && !form.isDirty()}>
                        {result === undefined ? <>Single Shot</> : form.isDirty() ? <>Refresh Result</> : <>Single Shot</>}
                    </Button>
                </Group>
            </form>
        </BallisticSimulatorFormProvider>
    )
}