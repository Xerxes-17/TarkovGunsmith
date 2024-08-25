import { Grid, Group, TextInput } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";

export function RowDefaultAmmo() {
    const form = useBallisticCalculatorFormContext();
    const ammo = form.values.dopeTableSelections.weaponObj?.defaultAmmo;
    const fVM = form.values.finalVelocityModifier;

    return (
        <>
            <Grid gutter={4}>
                <Grid.Col span={6}>
                    <Group grow spacing={4}>
                        <TextInput
                            disabled
                            w={235}
                            label={"Default Ammo"}
                            value={ammo ? `${ammo?.stats.name}` : "n/a"}
                        />
                    </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Group grow spacing={4}>
                        <TextInput
                            disabled
                            w={100}
                            label={"Penetration"}
                            value={ammo?.stats.penetration ?? "n/a"}
                        />
                        <TextInput
                            disabled
                            w={100}
                            label={"Damage"}
                            value={ammo?.stats.damage ?? "n/a"}
                        />
                    </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Group grow spacing={4}>
                        <TextInput
                            disabled
                            w={90}
                            label={"Initial Speed"}
                            value={ammo ? `${(ammo?.stats.initialSpeed * fVM).toFixed(1)} m/s` : "n/a"}
                        />
                        <TextInput
                            disabled
                            miw={130}
                            w={130}
                            label={"Ballistic Coefficient"}
                            value={ammo?.stats.ballisticCoefficient ?? "n/a"}
                        />
                    </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Group grow spacing={4}>
                        <TextInput
                            disabled
                            w={100}
                            label={"Bullet Diameter"}
                            value={ammo ? `${ammo?.stats.bulletDiameterMillimeters} mm` : "n/a"}
                        />
                        <TextInput
                            disabled
                            w={100}
                            label={"Bullet Mass"}
                            value={ammo ? `${ammo?.stats.bulletMass} g` : "n/a"}
                        />
                    </Group>
                </Grid.Col>
            </Grid>
            {/* <Grid gutter={4}>
                <Grid.Col span={6}>
                    <Group grow spacing={4}>

                    </Group>
                </Grid.Col>
                <Grid.Col span={6}>
                    <Group grow spacing={4}>

                    </Group>
                </Grid.Col>
            </Grid> */}
        </>

    )
}