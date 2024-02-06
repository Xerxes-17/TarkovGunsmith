import { Container, Divider, Grid, Paper, ScrollArea, Space, Tabs, Text, rem } from "@mantine/core"
import { PenetrationAndDamageForm } from "./PenetrationAndDamageForm"
import { IconGraph, IconMessageCircle, IconPhoto, IconPlus, IconSettings } from "@tabler/icons-react"

/**
 * Let's make this one simple to start with, just a means of calling WishGranter for it to calculate a given penetration chance, the blunt damage, and so on.
 * 
 */
export function BallisticsSimulator() {
    return (
        <Container>
            <br />
            <Paper shadow="sm" p="md">
                <Text>Prototype Ballsitic Simulator UI - Single to Multi Layer Sims</Text>
                <Divider my="sm" />
                <Tabs orientation="horizontal" defaultValue="sim1">
                    <Tabs.List>
                        <Tabs.Tab value="sim1" icon={<IconGraph size="1rem" />}>Sim1</Tabs.Tab>
                        <Tabs.Tab value="sim2" icon={<IconGraph size="1rem" />}>Sim2</Tabs.Tab>
                        <Tabs.Tab value="sim3" icon={<IconGraph size="1rem" />}>Sim3</Tabs.Tab>
                        <Tabs.Tab icon={<IconPlus size="1rem" />} value="sim4" aria-label="Get money" />
                    </Tabs.List>
                    <ScrollArea.Autosize
                        // mah={450} // sets the max size before the scroll area appears, will need top play with it more
                        mx="auto"
                        type="scroll"
                        offsetScrollbars
                    >
                        <Tabs.Panel value="sim1" pl="xs">
                            <PenetrationAndDamageForm />
                        </Tabs.Panel>

                        <Tabs.Panel value="sim2" pl="xs">
                            <PenetrationAndDamageForm />
                        </Tabs.Panel>

                        <Tabs.Panel value="sim3" pl="xs">
                            <PenetrationAndDamageForm />
                        </Tabs.Panel>

                        <Tabs.Panel value="sim4" pl="xs">
                            <PenetrationAndDamageForm />
                        </Tabs.Panel>
                    </ScrollArea.Autosize>



                </Tabs>

            </Paper>
        </Container>

    )
}
