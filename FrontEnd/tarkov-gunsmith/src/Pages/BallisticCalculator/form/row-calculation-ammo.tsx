import { Grid, Group,Text, TextInput } from "@mantine/core";
import { SelectCalculationDopeAmmo } from "../components/select-calculation-ammo";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";
import { useMediaQuery } from "@mui/material";


export function RowCalculationAmmo() {
    const form = useBallisticCalculatorFormContext();
    const ammo = form.values.dopeTableSelections.calculationAmmoObj;
    const fVM = form.values.finalVelocityModifier;
    
    const useSmallLabels = useMediaQuery('(max-width: 1540px)');
    
    return (
        <>
            <Grid gutter={4}>
                <Grid.Col span={12} xs={6} >
                    <Group grow spacing={4}>
                        <SelectCalculationDopeAmmo />
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} xs={6} >
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
                <Grid.Col span={12} xl={6}>
                    <Group spacing={4} grow align="end" >
                        <TextInput
                            disabled
                            w={85}
                            label={"Initial Speed"}
                            value={ammo ? `${(ammo?.stats.initialSpeed * fVM).toFixed(1)} m/s` : "n/a"}
                        />
                        <TextInput
                            disabled
                            miw={85}
                            w={130}
                            label={<Text size={useSmallLabels ? 12 : 10}>Ballistic Coefficient</Text>}
                            value={ammo?.stats.ballisticCoefficient ?? "n/a"}
                        />
                    </Group>
                </Grid.Col>
                <Grid.Col span={12} xl={6}>
                    <Group grow spacing={4} align="end">
                        <TextInput
                            disabled
                            w={100}
                            label={<Text size={useSmallLabels ? 12 : 11}>Bullet Diameter</Text>}
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
        </>
    )
}