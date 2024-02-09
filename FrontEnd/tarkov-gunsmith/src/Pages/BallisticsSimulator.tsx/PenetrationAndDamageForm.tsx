import { Button, Paper, Text, Group, Grid, Divider, Title, LoadingOverlay, Box, Table, Overlay } from "@mantine/core";
import { BallisticSimulatorFormProvider, BallisticSimulatorFormValues, useBallisticSimulatorForm } from "./ballistic-simulator--form-context";
import { ArmorLayerUI } from "./ArmorLayerUI";
import { ProjectileUI } from "./ProjectileUI";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { BallisticSimParameters, BallisticSimResponse, requestSingleShotBallisticSim } from "./api-requests";
import { convertArmorStringToEnumVal } from "../../Components/ADC/ArmorData";
import { LINKS } from "../../Util/links";

function camelCaseToWords(str: string) {
    return str.replace(/([A-Z])/g, ' $1').trim();
}

export function PenetrationAndDamageForm() {
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

    const [visible, { toggle, open, close }] = useDisclosure(false);

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
            result.ReductionFactor.toFixed(2),
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
            if(fieldName === "Penetration Chance"){
                transposedDictionary[fieldName].push(`${(value * 100).toFixed(2)} %`);
            } else {
                transposedDictionary[fieldName].push(value.toFixed(2));
            }
        });
    });

    // console.log("result", result)
    // console.log("transposedDictionary", transposedDictionary)
    // console.log("transposedArray", transposedArray);

    // const elements = [
    //     { name: 'Penetration Chance', Value: result ? (result?.PenetrationChance * 100).toFixed(2) : "-" },
    //     { name: 'Penetration Damage', Value: result?.PenetrationDamage.toFixed(2) ?? "-" },
    //     { name: 'Mitigated Damage', Value: result?.MitigatedDamage.toFixed(2) ?? "-" },
    //     { name: 'Blunt Damage', Value: result?.BluntdDamage.toFixed(2) ?? "-" },
    //     { name: 'Average Damage', Value: result?.AverageDamage.toFixed(2) ?? "-" },
    //     { name: 'Penetration Armor Damage', Value: result?.PenetrationArmorDamage.toFixed(2) ?? "-" },
    //     { name: 'Block Armor Damage', Value: result?.BlockArmorDamage.toFixed(2) ?? "-" },
    //     { name: 'Average Armor Damage', Value: result?.AverageArmorDamage.toFixed(2) ?? "-" },
    //     { name: 'Post-hit Armor Durability', Value: result?.PostHitArmorDurability.toFixed(2) ?? "-" },
    //     { name: 'Reduction Factor', Value: result?.ReductionFactor.toFixed(2) ?? "-" },
    //     { name: 'Post Armor Penetration', Value: result?.PostArmorPenetration.toFixed(2) ?? "-" },
    // ];

    const rows = Object.keys(transposedDictionary).map((key) => (
        <tr key={key}>
            {transposedDictionary[key].map(value => {
                return <td>{value}</td>
            })}
            <td>{key}</td>
        </tr>
    ));

    function handleSubmit(values: BallisticSimulatorFormValues) {
        open();
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
        close()
    }

    return (
        <BallisticSimulatorFormProvider form={form}>
            <form onSubmit={form.onSubmit((values) => {
                // console.log(values);
                handleSubmit(values);
            })}>
                {result.length > 0 && (
                    <Text color="gray.7" size={"sm"} mr={"auto"}>Time generated: {new Date().toUTCString()} and is from https://tarkovgunsmith.com{LINKS.BALLISTICS_SIMULATOR}</Text>
                )}
                <Grid columns={24} gutter={20} grow>
                    <Grid.Col span={24} xs={4} mih={"100%"}>
                        {/* <Paper style={{ height: '100%', display: 'flex', flexDirection: 'column' }}> */}
                            <ProjectileUI />
                            {/* <TargetUI /> */}
                        {/* </Paper> */}
                    </Grid.Col>

                    {
                        form.values.armorLayers.map((_, index) => {
                            return (
                                <Grid.Col span={24} xs={4}>
                                    <ArmorLayerUI index={index}/>
                                </Grid.Col>
                            )
                        })
                    }


                    <Grid.Col span={24} xs={8}>
                        <Box pos="relative" h={"100%"}>
                            <LoadingOverlay visible={visible} overlayBlur={2} />

                            <Divider my="xs" label={(<Title order={4}>Results</Title>)} />

                            <Box pos="relative">
                                {form.isDirty() && result !== undefined && <Overlay color="#000" opacity={0.60} center />}
                                <Table highlightOnHover withColumnBorders verticalSpacing="xs">
                                    <thead>
                                        <tr>
                                            {thElements.map(th => {return th})}
                                            <th>Statistic</th>
                                        </tr>
                                    </thead>
                                    <tbody>{rows}</tbody>
                                </Table>
                            </Box>
                            {form.isDirty() && result !== undefined && (<Text>Input changed, results will not match.</Text>)}

                            {/* <Stack>
                                <Divider mt={4} mb={0} label={(<Title order={6}>Damage</Title>)} />
                                <Text>Penetration Chance</Text>
                                <Text>Penetration Damage</Text>
                                <Text>Mitigated Damage</Text>
                                <Text>Blunt Damage</Text>
                                <Text>Average Damage</Text>
                            </Stack>
                            <Stack>
                                <Divider mt={4} mb={0} label={(<Title order={6}>Armor</Title>)} />
                                <Text>Penetration Armor Damage</Text>
                                <Text>Block Armor Damage</Text>
                                <Text>Average Armor Damage</Text>
                                <Text>Post-hit Armor Durability</Text>
                            </Stack> */}
                        </Box>


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
                    <Button type="submit" data-html2canvas-ignore >
                        {result === undefined ? <>Single Shot</> : form.isDirty() ? <>Refresh Result</> : <>Single Shot</>}
                    </Button>
                </Group>
            </form>
        </BallisticSimulatorFormProvider>
    )
}