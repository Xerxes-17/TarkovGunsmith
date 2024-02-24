import { Button, Paper, Text, Group, Grid, Divider, Title, LoadingOverlay, Box, Table, Overlay, Center, SegmentedControl } from "@mantine/core";
import { BallisticSimulatorFormProvider, BallisticSimulatorFormValues, useBallisticSimulatorForm } from "./ballistic-simulator--form-context";
import { ArmorLayerUI } from "./ArmorLayerUI";
import { ProjectileUI } from "./ProjectileUI";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction, useState } from "react";
import { BallisticSimParameters, BallisticSimResponse, requestSingleShotBallisticSim } from "./api-requests";
import { convertArmorStringToEnumVal } from "../../Components/ADC/ArmorData";
import { LINKS } from "../../Util/links";
import { BallisticSimulatorSingleShotGraph, ChartModes } from '../../Components/Common/Graphs/Charts/BallisticSimulatorSingleShotGraph';
import { ReductionFactorWTT } from "../../Components/Common/TextWithToolTips/ReductionFactorWTT";

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

    const layerSize = () => {
        if (layerCount === 1) {
            return 6
        }
        else if (layerCount === 2) {
            return 4
        }
        else {
            return 3
        }
    }

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

    // const elementsArray = result.map(result => {
    //     return [{
    //         name: 'Penetration Chance',
    //         Value: `${(result.PenetrationChance * 100).toFixed(2)} %`
    //     }, {
    //         name: 'Penetration Damage',
    //         Value: result.PenetrationDamage.toFixed(2)
    //     }, {
    //         name: 'Mitigated Damage',
    //         Value: result.MitigatedDamage.toFixed(2)
    //     }, {
    //         name: 'Blunt Damage',
    //         Value: result.BluntDamage.toFixed(2)
    //     }, {
    //         name: 'Average Damage',
    //         Value: result.AverageDamage.toFixed(2)
    //     }, {
    //         name: 'Penetration Armor Damage',
    //         Value: result.PenetrationArmorDamage.toFixed(2)
    //     }, {
    //         name: 'Block Armor Damage',
    //         Value: result.BlockArmorDamage.toFixed(2)
    //     }, {
    //         name: 'Average Armor Damage',
    //         Value: result.AverageArmorDamage.toFixed(2)
    //     }, {
    //         name: 'Post-hit Armor Durability',
    //         Value: result.PostHitArmorDurability.toFixed(2)
    //     }, {
    //         name: 'Reduction Factor',
    //         Value: result.ReductionFactor.toFixed(2)
    //     }, {
    //         name: 'Post Armor Penetration',
    //         Value: result.PostArmorPenetration.toFixed(2)
    //     }]});
    const layers = result?.length ?? 1;

    const thElements: any[] = [];

    for (let i = 1; i <= layers; i++) {
        thElements.push(<th>Layer {i}</th>);
    }

    const valuesArray = result.map(result => {
        return [
            `${(result.PenetrationChance * 100).toFixed(2)} %`,
            result.PenetrationDamage.toFixed(2),
            result.MitigatedDamage.toFixed(2),
            result.BluntDamage.toFixed(2),
            result.AverageDamage.toFixed(2),
            result.PenetrationArmorDamage.toFixed(2),
            result.BlockArmorDamage.toFixed(2),
            result.AverageArmorDamage.toFixed(2),
            result.PostHitArmorDurability.toFixed(2),
            `${(result.ReductionFactor * 100).toFixed(2)} %`,
            result.PostArmorPenetration.toFixed(2)
        ];
    });

    const transposedDictionary: Record<string, string[]> = {};

    result.forEach(item => {
        Object.entries(item).forEach(([key, value]) => {
            const fieldName = camelCaseToWords(key); // Convert camelCase key to words separated by spaces
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

    // console.log("result", result)
    // console.log("transposedDictionary", transposedDictionary)
    // console.log("transposedArray", transposedArray);

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

    return (
        <BallisticSimulatorFormProvider form={form}>
            <form onSubmit={form.onSubmit((values) => {
                // console.log(values);
                setIsLoading(true);
                handleSubmit(values);
            })}>
                {result.length > 0 && (
                    <Text color="gray.7" size={"sm"} mr={"auto"}>Time generated: {new Date().toUTCString()} and is from https://tarkovgunsmith.com{LINKS.BALLISTICS_SIMULATOR}</Text>
                )}
                <Grid columns={24} gutter={20} m={0} >
                    <Grid.Col span={24} xs={12} sm={6} md={4} lg={4} xl={layerSize()} mih={"100%"}>
                        {/* <Paper style={{ height: '100%', display: 'flex', flexDirection: 'column' }}> */}
                        <ProjectileUI />
                        {/* <TargetUI /> */}
                        {/* </Paper> */}
                    </Grid.Col>

                    {form.values.armorLayers.map((_, index) => {
                        return (
                            <Grid.Col span={24} xs={12} sm={6} md={4} lg={4} xl={layerSize()}>
                                <ArmorLayerUI index={index} />
                            </Grid.Col>
                        )
                    })}
                    {/* Results */}
                    <Grid.Col span={24} xs={24} sm={12} md={8} xl={6}>
                        {/* <Grid.Col span="content"> */}
                        <Box pos="relative" h={"100%"}>
                            <Divider my="xs" label={(<Title order={4}>Results</Title>)} />
                            <Box pos="relative">
                                <LoadingOverlay visible={isLoading} overlayBlur={2} />
                                {form.isDirty() && result !== undefined && <Overlay color="#000" opacity={0.60} center />}
                                <Table highlightOnHover withColumnBorders verticalSpacing="xs">
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
                    <Grid.Col span={24} xs={24} sm={12} lg={12} xl={6} >
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


                <Group position="right" mt="md">

                    {/* //todo compare with other sim */}
                    {/* <Menu shadow="md" width={200}>
                        <Menu.Target>
                            <Button variant="outline">Toggle menu</Button>
                        </Menu.Target>

                        <Menu.Dropdown>
                            <ScrollArea.Autosize mah={150}>
                                <Menu.Label>Application</Menu.Label>
                                <Menu.Item>Settings</Menu.Item>
                                <Menu.Item>Messages</Menu.Item>
                                <Menu.Item>Settings</Menu.Item>
                                <Menu.Item>Messages</Menu.Item>
                                <Menu.Item>Settings</Menu.Item>
                                <Menu.Item>Messages</Menu.Item>
                                <Menu.Item>Settings</Menu.Item>
                                <Menu.Item>Messages</Menu.Item>
                            </ScrollArea.Autosize>

                        </Menu.Dropdown>
                    </Menu>
                    <Select

                        clearable
                        placeholder="Compare with:"
                        dropdownPosition="flip"
                        itemComponent={SelectItem}
                        data={mockMaterials}
                    /> */}
                    {/* <Button onClick={toggle} >Multi Shot</Button> */}
                    <Button type="submit" data-html2canvas-ignore disabled={result.length > 0 && !form.isDirty()}>
                        {result === undefined ? <>Single Shot</> : form.isDirty() ? <>Refresh Result</> : <>Single Shot</>}
                    </Button>
                </Group>
            </form>
        </BallisticSimulatorFormProvider>
    )
}