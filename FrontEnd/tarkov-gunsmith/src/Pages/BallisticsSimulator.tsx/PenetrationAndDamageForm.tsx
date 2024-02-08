import { Button, Paper, Text, Group, Grid, Stack, Divider, Title, LoadingOverlay, Box, Table } from "@mantine/core";
import { BallisticSimulatorFormProvider, BallisticSimulatorFormValues, useBallisticSimulatorForm } from "./ballistic-simulator--form-context";
import { ArmorLayerUI } from "./ArmorLayerUI";
import { ProjectileUI } from "./ProjectileUI";
import { TargetUI } from "./TargetUI";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { BallisticSimParameters, BallisticSimResponse, requestSingleShotBallisticSim } from "./api-requests";
import { convertArmorStringToEnumVal } from "../../Components/ADC/ArmorData";
import { LINKS } from "../../Util/links";

interface DamageStatistics {
    PenetrationChance: number;
    PenetrationDamage: number;
    MitigatedDamage: number;
    BluntdDamage: number;
    AverageDamage: number;
    PenetrationArmorDamage: number;
    BlockArmorDamage: number;
    AverageArmorDamage: number;
    PostHitArmorDurability: number;
}

export function PenetrationAndDamageForm() {
    const form = useBallisticSimulatorForm({
        initialValues: {
            penetration: 28,
            damage: 53,
            armorDamagePercentage: 40,

            hitPointsPool: 85,

            armorClass: 4,
            durability: 44,
            maxDurability: 44,
            armorMaterial: "Ceramic",
            bluntDamageThroughput: 28,
        }
    });

    const [result, setResult] = useState<BallisticSimResponse>();

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

    const elements = [
        { name: 'Penetration Chance', Value: result ? (result?.PenetrationChance*100).toFixed(2) : "-" },
        { name: 'Penetration Damage', Value: result?.PenetrationDamage.toFixed(2) ?? "-" },
        { name: 'Mitigated Damage', Value: result?.MitigatedDamage.toFixed(2) ?? "-" },
        { name: 'Blunt Damage', Value: result?.BluntdDamage.toFixed(2) ?? "-" },
        { name: 'Average Damage', Value: result?.AverageDamage.toFixed(2) ?? "-" },
        { name: 'Penetration Armor Damage', Value: result?.PenetrationArmorDamage.toFixed(2) ?? "-" },
        { name: 'Block Armor Damage', Value: result?.BlockArmorDamage.toFixed(2) ?? "-" },
        { name: 'Average Armor Damage', Value: result?.AverageArmorDamage.toFixed(2) ?? "-" },
        { name: 'Post-hit Armor Durability', Value: result?.PostHitArmorDurability.toFixed(2) ?? "-" },
    ];

    const rows = elements.map((element) => (
        <tr key={element.name}>
            <td>{element.Value}{element.name === "Penetration Chance" && result && (<> %</>)}</td>
            <td>{element.name}</td>
        </tr>
    ));

    function handleSubmit(values: BallisticSimulatorFormValues) {
        open();
        const requestDetails: BallisticSimParameters = {
            penetration: values.penetration,
            damage: values.damage,
            armorDamagePerc: values.armorDamagePercentage,
            hitPoints: values.hitPointsPool,
            armorClass: values.armorClass,
            bluntDamageThroughput: values.bluntDamageThroughput,
            durability: values.durability,
            maxDurability: values.maxDurability,
            armorMaterial: convertArmorStringToEnumVal(values.armorMaterial)
        }

        requestSingleShotBallisticSim(requestDetails).then(response => {
            console.log("response", response)
            setResult(response)
        }).catch(error => {
            alert(`The error was: ${error}`);
        });
        close()
    }

    return (
        <BallisticSimulatorFormProvider form={form}>
            <form onSubmit={form.onSubmit((values) => {
                console.log(values);
                handleSubmit(values);
            })}>
                    {result !== undefined && (
                        <Text color="gray.7" size={"sm"} mr={"auto"}>Time generated: {new Date().toUTCString()} and is from https://tarkovgunsmith.com{LINKS.BALLISTICS_SIMULATOR}</Text>
                    )}
                <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
                    <Grid.Col span={12} xs={3} mih={"100%"}>
                        <Paper style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <ProjectileUI />
                            {/* <TargetUI /> */}
                        </Paper>
                    </Grid.Col>


                    <Grid.Col span={12} xs={3}>
                        <ArmorLayerUI />
                    </Grid.Col>

                    <Grid.Col span={12} xs={6}>
                        <Box pos="relative" h={"100%"}>
                            <LoadingOverlay visible={visible} overlayBlur={2} />
                            <Divider my="xs" label={(<Title order={4}>Results</Title>)} />
                            <Table highlightOnHover withColumnBorders verticalSpacing="xs">
                                <thead>
                                    <tr>
                                        <th>Value</th>
                                        <th>Statistic</th>
                                    </tr>
                                </thead>
                                <tbody>{rows}</tbody>
                            </Table>
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
                    <Button type="submit" data-html2canvas-ignore >Single Shot</Button>
                </Group>
            </form>
        </BallisticSimulatorFormProvider>
    )
}