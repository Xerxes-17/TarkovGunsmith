import { Accordion, Button, Card, Checkbox, Container, Divider, Grid, Group, NumberInput, SimpleGrid, Slider } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import ArmorSelect from "./ArmorSelect";
import SliderAndNumber from "../Common/SliderAndNumber";
import { IconChevronCompactDown, IconChevronDown, IconChevronUp } from "@tabler/icons-react";

export default function DsContent(props: any) {
    const [accordion, setAccordion] = useState<string | null>(null);
    function handleAccordion() {
        if (accordion?.includes("armorFilters")) {
            setAccordion("");
        }
        else
            setAccordion("armorFilters")
    }

    const [accordionAmmo, setAccordionAmmo] = useState<string | null>(null);
    function handleAccordionAmmo() {
        if (accordionAmmo?.includes("ammoFilters")) {
            setAccordionAmmo("");
        }
        else
            setAccordionAmmo("ammoFilters")
    }


    const form = useForm({
        initialValues: {
            email: '',
            termsOfService: false,
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const [value, setValue] = useState<string[]>([]);


    return (
        <>
            <Card shadow="sm" padding="md" radius="0" withBorder bg={"#212529"}>
                <h1>Damage Simulator</h1>
                <Card.Section>
                    <Divider size="sm" />
                    Hahah
                </Card.Section>
            </Card>

            <Card>
                <Group>
                    <h2>Armor Selection</h2>
                    <div className="ms-auto">
                        <Button leftIcon={accordion?.includes("armorFilters") ? <IconChevronUp /> : <IconChevronDown />} onClick={() => handleAccordion()}>Filters</Button>
                    </div>
                </Group>

                <Accordion radius="0" value={accordion} unstyled>
                    <Accordion.Item value="armorFilters">
                        <Accordion.Panel>
                            <Checkbox.Group value={value} onChange={setValue} label="Target Zone">
                                <Divider size="sm" pb={8} />
                                <SimpleGrid cols={2} spacing="md">
                                    <Checkbox value="1" label="Thorax" />
                                    <Checkbox value="2" label="Head" />
                                </SimpleGrid>

                            </Checkbox.Group>
                            <Checkbox.Group value={value} onChange={setValue} label="Armor Type">
                                <Divider size="sm" pb={8} />
                                <SimpleGrid cols={4} spacing="md"
                                    breakpoints={[
                                        { maxWidth: '20rem', cols: 2, spacing: 'sm' },
                                    ]}>
                                    <Checkbox value="3" label="Vest" />
                                    <Checkbox value="4" label="Rig " />
                                    <Checkbox value="5" label="Helm" />
                                    <Checkbox value="6" label="Other" />
                                </SimpleGrid>

                            </Checkbox.Group>

                            <Checkbox.Group value={value} onChange={setValue} label="Armor Class">
                                <Divider size="sm" pb={8} />
                                <SimpleGrid cols={6} spacing="md"
                                    breakpoints={[
                                        { maxWidth: '36rem', cols: 3, spacing: 'sm' },
                                        { maxWidth: '20rem', cols: 2, spacing: 'sm' },
                                    ]}
                                >
                                    <Checkbox value="7" label="1" />
                                    <Checkbox value="8" label="2" />
                                    <Checkbox value="9" label="3" />
                                    <Checkbox value="10" label="4" />
                                    <Checkbox value="11" label="5" />
                                    <Checkbox value="12" label="6" />
                                </SimpleGrid>
                            </Checkbox.Group>

                            <Checkbox.Group value={value} onChange={setValue} label="Armor Material">
                                <Divider size="sm" pb={8} />
                                <SimpleGrid
                                    cols={8}
                                    spacing="md"
                                    breakpoints={[
                                        { maxWidth: '62rem', cols: 4, spacing: 'md' },
                                        { maxWidth: '48rem', cols: 4, spacing: 'sm' },
                                        { maxWidth: '36rem', cols: 3, spacing: 'sm' },
                                        { maxWidth: '20rem', cols: 2, spacing: 'sm' },
                                    ]}
                                >
                                    <Checkbox value="Aramid" label="Aramid" />
                                    <Checkbox value="UHMWPE" label="UHMWPE" />
                                    <Checkbox value="Combined" label="Combined" />
                                    <Checkbox value="Titan" label="Titan" />
                                    <Checkbox value="Alu" label="Alu" />
                                    <Checkbox value="Steel" label="Steel" />
                                    <Checkbox value="Ceramic" label="Ceramic" />
                                    <Checkbox value="Glass" label="Glass" />
                                </SimpleGrid>
                            </Checkbox.Group>

                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <ArmorSelect />
                <SliderAndNumber />
            </Card>
            <Card>
                <Group>
                    <h2>Ammo Selection</h2>
                    <div className="ms-auto">
                        <Button leftIcon={accordionAmmo?.includes("ammoFilters") ? <IconChevronUp /> : <IconChevronDown />} onClick={() => handleAccordionAmmo()}>Filters</Button>
                    </div>
                </Group>

                <Accordion radius="0" value={accordionAmmo} unstyled>
                    <Accordion.Item value="ammoFilters">
                        <Accordion.Panel>
                            <Checkbox.Group value={value} onChange={setValue} label="Full Rifle">
                                <Divider size="sm" pb={8} />
                                <SimpleGrid cols={2} spacing="md">
                                    <Checkbox value="1" label="7.62x54mmR" />
                                    <Checkbox value="2" label="7.62x51mm" />
                                    <Checkbox value="1" label="338 Lapua Mag" />
                                    <Checkbox value="2" label="12.7x55mm" />
                                </SimpleGrid>

                            </Checkbox.Group>
                            <Checkbox.Group value={value} onChange={setValue} label="Intermediate Rifle">
                                <Divider size="sm" pb={8} />
                                <SimpleGrid cols={3} spacing="xs"
                                    breakpoints={[
                                        { maxWidth: '20rem', cols: 3, spacing: 'sm' },
                                    ]}>
                                    <Checkbox value="3" label="5.45x39" />
                                    <Checkbox value="4" label="5.56x45" />
                                    <Checkbox value="5" label="7.62x39" />
                                    <Checkbox value="6" label="9x39" />
                                    <Checkbox value="6" label=".366 TKM" />
                                    <Checkbox value="6" label=".300 BLK" />
                                </SimpleGrid>

                            </Checkbox.Group>

                            <Checkbox.Group value={value} onChange={setValue} label="PDW / Pistol">
                                <Divider size="sm" pb={8} />
                                <SimpleGrid cols={6} spacing="md"
                                    breakpoints={[
                                        { maxWidth: '36rem', cols: 3, spacing: 'sm' },
                                        { maxWidth: '20rem', cols: 2, spacing: 'sm' },
                                    ]}
                                >
                                    <Checkbox value="7" label="4.6x30"/>
                                    <Checkbox value="8" label="9x21" />
                                    <Checkbox value="9" label="5.7x28" />
                                    <Checkbox value="10" label=".45 ACP" />
                                    <Checkbox value="11" label="9x19" />
                                    <Checkbox value="12" label="7.62 TT" />
                                    <Checkbox value="12" label=".357" />
                                </SimpleGrid>
                            </Checkbox.Group>

                            <Checkbox.Group value={value} onChange={setValue} label="Shotgun">
                                <Divider size="sm" pb={8} />
                                <SimpleGrid
                                    cols={8}
                                    spacing="md"
                                    breakpoints={[
                                        { maxWidth: '62rem', cols: 4, spacing: 'md' },
                                        { maxWidth: '48rem', cols: 4, spacing: 'sm' },
                                        { maxWidth: '36rem', cols: 3, spacing: 'sm' },
                                        { maxWidth: '20rem', cols: 2, spacing: 'sm' },
                                    ]}
                                >
                                    <Checkbox value="Aramid" label="12g" />
                                    <Checkbox value="UHMWPE" label="23mm" />
                                    <Checkbox value="Combined" label="20g" />
                                </SimpleGrid>
                            </Checkbox.Group>

                        </Accordion.Panel>
                    </Accordion.Item>
                </Accordion>

                <ArmorSelect />
            </Card>

        </>


    );
}