import { Accordion, Container, Loader, Paper, Stack, Text, useMantineTheme, rem } from '@mantine/core';
import { SEO } from "../../Util/SEO";
import { useEffect, useState } from "react";
import { requestAmmoEffectivenessChart } from "./api-requests";
import { IconDatabaseX, IconInfoCircle } from "@tabler/icons-react";
import { AecData } from "./types";
import { AmmoEffectivenessTable } from "./ammo-effectiveness-table";

export function AmmoEffectivenessPage() {
    const theme = useMantineTheme();
    const getColor = (color: string) => theme.colors[color][theme.colorScheme === 'dark' ? 5 : 7];

    const [ammoEffectivenessData, setAmmoEffectivenessData] = useState<AecData>();

    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function getAmmoEffectivenessData() {
        const response_WishGranter = await requestAmmoEffectivenessChart();
        if (response_WishGranter !== null) {
            setAmmoEffectivenessData(response_WishGranter);
            setIsLoading(false)
            return;
        }
        setIsLoading(false)
        console.error("Error: WishGranter failed to respond.")
    }

    useEffect(() => {
        setIsLoading(true)
        getAmmoEffectivenessData();
    }, [])

    return (
        <>
            <SEO url="https://tarkovgunsmith.com/datasheets/ammo_effectiveness" title={'Ammo Effectiveness : Tarkov Gunsmith'} />
            <Container size={"99.5%"} px={0} pt={3}>
                <Paper shadow="sm" p={2} px={5} mt={0}>
                    <Accordion variant="contained">
                        <Accordion.Item value="photos">
                            <Accordion.Control icon={<IconInfoCircle size={rem(20)} color={getColor('blue')} />}>
                                FAQ - Details, Assumptions and Explanation of this Chart
                            </Accordion.Control>
                            <Accordion.Panel>
                                First, this table assumes that the distance between the shooter and the target is 15m,
                                with a corresponding reduction in the Damage and Penetration of the round fired. In my
                                judgement, this is a reasonable average range for the most common engagements of Tarkov.
                                <br />
                                <br />
                                Second, with all of the plates, they are paired with the chest Aramid inserts of the
                                USEC Trooper vest. This is because that armor item has a durability close to the average
                                of all similar aramid layers (50, vs 50.2) and a median blunt throughput of 33%.
                                I've chosen class 3 because this is the best/worst case for soft armor, and anyone playing
                                'correctly' will choose a plate carrier with AC3 soft over AC2 whenever they can. I've
                                also done sanity checking with the NFM Thor Concealable (lowest durability), and the
                                Zabralo (Highest) and found that both are outperformed by the trooper. This is because
                                the Thor is low enough durability for that to matter in some cases, and with the Zabralo
                                its increased blunt throughput of 36% adds up, reducing the HTK.
                                <br />
                                <br />
                                Third, the measurement of this table is Hits To Kill (HTK) against the Thorax HP pool,
                                not accounting for things like hitting arms, stomach or etc. Furthermore, this
                                measurement also considers the required cumulative chance of kill* (CCoK) confidence.
                                This means you can set your own desired level of "acceptable" performance, higher
                                confidence is better. This is also the required number of projectile hits, so
                                multi-projectile shotgun ammos such as flechette is the number of impacts, not the
                                number of shells fired. Also, the HTK of arms and legs is against the entire PMC health
                                pool, accounting for paired limb health pools and the blacked limb damage multiplier.
                                <br />
                                <br />
                                *This measures the chance that this hit or an earlier one has killed the target.
                                <br />
                                <br />
                                Currently the process for plate carriers is the following:
                                <ul>
                                    <li>Get all ammos with and simulate them to 15m distance.</li>
                                    <li>Get all armor plates, and the USEC Trooper aramid layer.</li>
                                    <li>For each plate, pair it with the trooper aramid and simulate it against all ammos with &gt;10 base penetration. We're skipping these because it's known that they will not be performant.</li>
                                    <li>Save the resulting hit series information for that combination.</li>
                                    <li>For display, group all entries by the ammo, then group those results by plate AC.</li>
                                    <li>In each of these hit series, find the first hit that matches the required CCoK confidence and save the hit number to an array.</li>
                                    <li>Average that array of kill-hit numbers, this provides the average HTK of that AC</li>
                                </ul>
                                Non-plate carrier armors, such as the PACA, the Uley, etc, are similar, but are compared
                                against all ammo types, and are saved to AC 2 and AC 3/4 (Legacy), as in these armor
                                items are obsolete legacy types. They are in a separate categories from the plate-carrier
                                AC 3/4 because they have distinctly different mechanics, such as blunt damage being far
                                more effective against them. AC 1 is not included as there are no thorax armors of
                                this level.
                                <br />
                                <br />
                                Fourth, fragmentation chance is not listed as that gameplay mechanic has been disabled
                                since patch ~14.1.0, and other modifiers such as bleed chance are also skipped, as the
                                focus of this table is raw hits-to-kill performance, also velocity isn't going to matter at 15m.
                                <br />
                                <br />
                                Fifth, single shot ammos HTK display is capped at 30 rounds, because if it takes more
                                than a full standard magazine to kill a target through armor, it's clearly ineffective.
                                Likewise multi-projectile ammo is capped at 64, because that'd be the equivalent of 8
                                shots of the usual 8 pellet loads and again, if it doesn't work by that point it's
                                clearly bad!
                            </Accordion.Panel>
                        </Accordion.Item>
                    </Accordion>

                    {isLoading && ammoEffectivenessData === undefined && (
                        <Stack spacing={2} mb={5} align="center">
                            <Loader size="xl" variant="bars" />
                            <Text>Fetching data, this shouldn't be here long unless the server recently restarted and is recalculating.</Text>
                        </Stack>
                    )}

                    {!isLoading && ammoEffectivenessData === undefined && (
                        <Stack spacing={2} mb={5} align="center">
                            <IconDatabaseX size="5rem" color="#9e1b1b" />
                            <Text>Welp, no response from Wishgranter-API, go yell at Xerxes on the discord about it.</Text>
                        </Stack>
                    )}

                    {ammoEffectivenessData !== undefined && (
                        <>
                            <AmmoEffectivenessTable tableData={ammoEffectivenessData} />
                        </>
                    )}
                </Paper>
            </Container>
        </>
    )
}