import { Center, Flex, Grid, Text } from "@mantine/core";
import { FAQ_SimStepChart } from "../../../Components/Common/Graphs/Charts/FAQ_SimStepChart";
import { FAQ_AnglesTable } from '../../../Components/Common/Tables/calculator-tables/faq-angles-table';
import { FAQ_DropChart } from "../../../Components/Common/Graphs/Charts/FAQ_DropChart";
import { FAQ_DropChartShotties } from "../../../Components/Common/Graphs/Charts/FAQ_DropChartShotguns";


export function FrequentlyAskedQuestions() {
    return (
        <>
            <Grid>
                <Grid.Col span={12}>
                    <Grid>
                        <Grid.Col span={12} xl={8}>
                            <Text size={15} fw={700} >
                                How does ballistics work in Tarkov? <br />
                            </Text>
                            <Text size={13}>
                                The simulation of a bullet is processed over simulation steps of 0.01s in which it travels in a straight line.
                                At the start of each step, the values and direction of the bullet are calculated and it maintains those values for the entirety of the step.
                                Simple example, a bullet that travels 10m in a step will have the same damage and penetration if it hits a target at 2m or at 8m of this step,
                                but the total travel distance and time will still be different.
                                <br /><br />
                                Tarkov accounts for air resistance, bullet mass and gravitational pull on bullets and how they will cause a bullet to bleed energy and slow down.
                                However, bullets fired by Ai are anti-gravity; they don't experience any drop at all! They still bleed energy over distance and thus speed, penetration and damage.
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={12} xl={4}>
                            <Center mx="auto">
                                <FAQ_SimStepChart />
                            </Center>
                        </Grid.Col>
                    </Grid>

                </Grid.Col>
                <Grid.Col span={12}>
                    <Grid>
                        <Grid.Col span={12} xl={8}>
                            <Text size={15} fw={700} >
                                How is a zero/calibration distance angle made? <br />
                            </Text>
                            <Text size={13}>
                                First the <b>default ammo</b> of a weapon is simulated, accounting for the barrel, mods, etc without any angle, just straight forward along the barrel axis.
                                From this default ammo at horizontal curve, we can take two numbers: the distance and the drop. Using these with Atan(), we can find the required "departure angle"
                                for the bullet to reach that distance with zero drop relative to the muzzle's position. To account for the line of sight's height over the bore, we can add this
                                number to the drop before finding the angle. The game does this automatically, so you don't need to worry about it.
                            </Text>
                            <br />
                            <Text size={13}>
                                But remember, this is only for the <b>default ammo</b> of a weapon, so what the game/we are producing is the <strong>calibration distance angle</strong> for the <i>default ammo only</i>, so not really a "zero".
                                So when you select a "zero" in Tarkov, you're really selecting this <strong>calibration distance angle</strong>.
                                Also keep in mind that for distances at or below 50m you will have a "close zero" (1st intersection LoS) and above that you will have a "far zero" (2nd intersection LoS).
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={12} xl={4} >
                            <Center>
                                <FAQ_AnglesTable />
                            </Center>
                        </Grid.Col>
                    </Grid>
                </Grid.Col>

                <Grid.Col span={12}>
                    <Grid>
                        <Grid.Col span={12} xl={4}>
                            <Text size={15} fw={700} >
                                So how does this impact my shot? <br />
                            </Text>
                            <Text size={13} >
                                Well it changes the impact point of your shot 😀.<br />
                                If a weapon has a default ammo that is faster than the ammo that you're using, your shots will go low at your calibrated distance and your "true zero" is closer than labelled.
                                Likewise, if the default ammo is slower than the ammo that you're using, your shots will go high at your calibrated distance and your "true zero" is further away than labelled.
                                This would be why your long distance sniping shots don't match your expectations in many cases, and is particularly felt by weapons with slow and arcing ammo like the VSS, or calibers with high variance in their initial velocity, such as shotguns.
                            </Text>
                        </Grid.Col>
                        <Grid.Col span={12} xl={8}>
                            {/* <Center mx="auto"> */}
                            <Flex
                                gap={"md"}
                                justify="center"
                                align="center"
                                direction="row"
                                wrap="wrap"
                            >
                                <FAQ_DropChart />
                                <FAQ_DropChartShotties />
                            </Flex>

                            {/* </Center> */}
                        </Grid.Col>
                    </Grid>
                </Grid.Col>
                <Grid.Col span={12}>
                    <Text size={15} fw={700} >
                        Why are your numbers are different to Tarkov-Ballistics? <br />
                    </Text>
                    <Text size={13}>
                        First, TB is no long maintained so quite a few numbers are outdated there. Second, from what I can infer from the development of my ballistic simulator, the way they've saved distance/time numbers isn't
                        interpolated within a step and they just use the end of step's time, and the way they transform their data results in perfect parabolas which is incorrect. Absolutely not hating on them, they did a decent enough job, but I
                        can say with confidence my system is more accurate. Third, calculated results have been tested and verified in game with the assistance of sw_tower, a known sniping ballistics man; so trust, fam.
                    </Text>
                </Grid.Col>
            </Grid>
        </>
    )
}