import { Button, NumberInput, Paper, Select, TextInput, Text, Slider, Group, Grid, Stack, Divider, Flex } from "@mantine/core";
import { BallisticSimulatorFormProvider, useBallisticSimulatorForm } from "./ballistic-simulator--form-context";
import { ArmorMaterialDestructibility, ArmorMaterialDestructibilitySelect } from "../../Api/ArmorApiCalls";
import { forwardRef } from "react";


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

    const mockMaterials: ArmorMaterialDestructibilitySelect[] = [
        {
            value: "UHMW Polyethylene",
            label: "UHMW Polyethylene",
            destructibility: 0.3375,
            explosionDestructibility: 0.3
        },
        {
            value: "Aramid",
            label: "Aramid",
            destructibility: 0.1875,
            explosionDestructibility: 0.15
        },
        {
            value: "Combined materials",
            label: "Combined materials",
            destructibility: 0.375,
            explosionDestructibility: 0.2
        },
        {
            value: "Titan",
            label: "Titan",
            destructibility: 0.4125,
            explosionDestructibility: 0.375
        },
        {
            value: "Aluminum",
            label: "Aluminum",
            destructibility: 0.45,
            explosionDestructibility: 0.45
        },
        {
            value: "Armor steel",
            label: "Armor steel",
            destructibility: 0.525,
            explosionDestructibility: 0.45
        },
        {
            value: "Ceramic",
            label: "Ceramic",
            destructibility: 0.6,
            explosionDestructibility: 0.525
        },
        {
            value: "Glass",
            label: "Glass",
            destructibility: 0.6,
            explosionDestructibility: 0.6
        }
    ]

    interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
        image: string;
        label: string;
        destructibility: string;
        explosionDestructibility: string;
    }

    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ image, label, destructibility, ...others }: ItemProps, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            Destructibility: {destructibility}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );

    return (
        <BallisticSimulatorFormProvider form={form}>
            <form onSubmit={form.onSubmit((values) => console.log(values))}>

                <Grid gutter={5} gutterXs="md" gutterMd="xl" gutterXl={50}>
                    <Grid.Col span={12} xs={3} mih={"100%"}>
                        <Paper style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Stack>
                                <Text>Projectile Information</Text>
                                <div>
                                    <NumberInput
                                        label="Penetration"
                                        precision={2}
                                        max={90}
                                        min={1}
                                        step={1}
                                        stepHoldDelay={500}
                                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                                        {...form.getInputProps('penetration')}
                                    />
                                    <Slider
                                        label={null}
                                        max={90}
                                        min={1}
                                        step={1}
                                        {...form.getInputProps('penetration')}
                                    />
                                </div>
                                <div>
                                    <NumberInput
                                        label="Damage"
                                        precision={2}
                                        max={265}
                                        min={1}
                                        step={1}
                                        stepHoldDelay={500}
                                        {...form.getInputProps('damage')}
                                    />
                                    <Slider
                                        label={null}
                                        precision={2}
                                        max={265}
                                        min={1}
                                        step={1}
                                        {...form.getInputProps('damage')}
                                    />
                                </div>
                                <div>
                                    <NumberInput
                                        label="Armor Damage Percentage"
                                        aria-label="Armor Damage Percentage"
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        formatter={(value) =>
                                            !Number.isNaN(parseFloat(value))
                                                ? `${value} %`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                                : ' %'
                                        }

                                        precision={2}
                                        min={1}
                                        max={100}
                                        step={1}
                                        stepHoldDelay={500}
                                        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                                        {...form.getInputProps('armorDamagePercentage')}

                                    />
                                    <Slider
                                        label={null}
                                        precision={2}
                                        min={1}
                                        max={100}
                                        step={1}
                                        {...form.getInputProps('armorDamagePercentage')}

                                    />
                                    <Text mt="sm" size="sm">
                                        Effective Durability Damage: <br /> <b>{(form.values.penetration * form.values.armorDamagePercentage / 100).toFixed(2)}</b>
                                    </Text>
                                </div>
                            </Stack>
                                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: "flex-end" }}>
                                    <NumberInput
                                        label="Hit Points"
                                        precision={2}
                                        max={265}
                                        min={35}
                                        step={1}
                                        stepHoldDelay={500}
                                        {...form.getInputProps('hitPointsPool')}
                                    />
                                    <Slider
                                        label={null}
                                        marks={[
                                            { value: 35, label: 'Head' },
                                            { value: 85, label: 'Thorax' },
                                          ]}
                                        precision={2}
                                        max={150}
                                        min={1}
                                        step={1}
                                        {...form.getInputProps('hitPointsPool')}
                                    />
                                </div>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={12} xs={3}>
                        <Paper>
                            <Stack>
                                <Text>Armor Layer 1</Text>
                                <div>
                                    <NumberInput
                                        label="Armor Class"
                                        precision={0}
                                        max={6}
                                        min={1}
                                        step={1}
                                        {...form.getInputProps('armorClass')}
                                    />
                                    <Slider
                                        label={null}
                                        max={6}
                                        min={1}
                                        step={1}
                                        {...form.getInputProps('armorClass')}
                                    />
                                </div>
                                <div>
                                    <NumberInput
                                        label="Blunt Damage Throughput"
                                        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                                        formatter={(value) =>
                                            !Number.isNaN(parseFloat(value))
                                                ? `${value} %`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                                                : ' %'
                                        }

                                        precision={2}
                                        min={1}
                                        max={100}
                                        step={1}
                                        stepHoldDelay={500}
                                        {...form.getInputProps('bluntDamageThroughput')}
                                    />
                                    <Slider
                                        label={null}
                                        precision={2}
                                        min={1}
                                        max={100}
                                        step={1}
                                        {...form.getInputProps('bluntDamageThroughput')}
                                    />
                                </div>

                                <div>
                                    <NumberInput
                                        label={
                                            <Text size="sm">
                                                Durability - <b>{((form.values.durability / form.values.maxDurability) * 100).toFixed(2)}%</b>
                                            </Text>
                                        }
                                        precision={2}
                                        max={form.values.maxDurability}
                                        min={0}
                                        step={1}
                                        {...form.getInputProps('durability')}
                                    />
                                    <Slider
                                        label={null}
                                        precision={2}
                                        max={form.values.maxDurability}
                                        min={0}
                                        step={1}
                                        {...form.getInputProps('durability')}
                                    />

                                </div>
                                <div >
                                    <NumberInput
                                        label="Max Durability"
                                        type="number"
                                        precision={2}
                                        max={90}
                                        min={6}
                                        step={1}
                                        {...form.getInputProps('maxDurability')}
                                        onChange={(value) => {
                                            if (value) {
                                                if (form.values.durability > value) {
                                                    form.setValues({ durability: value })
                                                }
                                                else if (form.values.durability === form.values.maxDurability) {
                                                    form.setValues({ durability: value })
                                                }
                                                form.setFieldValue("maxDurability", value);
                                            }
                                        }}
                                    />
                                    <Slider
                                        label={null}
                                        precision={2}
                                        max={90}
                                        min={6}
                                        step={1}
                                        {...form.getInputProps('maxDurability')}
                                        onChange={(maxDura) => {
                                            if (maxDura) {
                                                if (form.values.durability > maxDura) {
                                                    form.setValues({ durability: maxDura })
                                                }
                                                else if (form.values.durability === form.values.maxDurability) {
                                                    form.setValues({ durability: maxDura })
                                                }
                                                form.setFieldValue("maxDurability", maxDura);
                                            }
                                        }}
                                        onChangeEnd={(value) => {
                                            if (value) {
                                                if (form.values.durability > value) {
                                                    form.setValues({ durability: value })
                                                }
                                                form.setFieldValue("maxDurability", value);
                                            }
                                        }}
                                    />
                                </div>
                                <Text size="sm">
                                    Effective Durability: &nbsp;&nbsp;<b>{(form.values.durability / mockMaterials.find(x => x.label === form.values.armorMaterial)!.destructibility).toFixed(2)}</b>

                                </Text>
                                <Select
                                    label="Armor Material"
                                    placeholder="Pick one"
                                    dropdownPosition="flip"
                                    itemComponent={SelectItem}
                                    data={mockMaterials}
                                    {...form.getInputProps('armorMaterial')}
                                />
                            </Stack>
                        </Paper>
                    </Grid.Col>
                    <Grid.Col span={12} xs={6}>
                        <Stack>
                            <Text>Results</Text>
                            <Divider my="sm" />
                            <Text>Penetration Chance</Text>
                            <Text>Penetration Damage</Text>
                            <Text>Mitigated Damage</Text>
                            <Text>Blunt Damage</Text>
                            <Text>Average Damage</Text>
                            <Divider my="sm" />
                            <Text>Penetration Armor Damage</Text>
                            <Text>Block Armor Damage</Text>
                            <Text>Average Armor Damage</Text>
                            <Text>Post-hit Armor Durability</Text>
                        </Stack>
                        {/* <br/>
                        <Stack>

                            <Button>Add New Armor Layer</Button>
                        </Stack> */}

                    </Grid.Col>
                </Grid>









                <Group position="right" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>
        </BallisticSimulatorFormProvider>
    )
}