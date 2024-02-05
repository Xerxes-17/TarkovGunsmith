import { Container, Divider, Grid, Paper, Space, Text, rem } from "@mantine/core"
import { PenetrationAndDamageForm } from "./PenetrationAndDamageForm"

/**
 * Let's make this one simple to start with, just a means of calling WishGranter for it to calculate a given penetration chance, the blunt damage, and so on.
 * 
 */
export function BallisticsSimulator() {
    return (
        <Container>
            <br/>
            <Paper shadow="sm" p="md">
                <Text>Prototype Ballsitic Simulator UI - Single to Multi Layer Sims</Text>
                <Divider my="sm" />
                <PenetrationAndDamageForm/>
            </Paper>
        </Container>

    )
}
