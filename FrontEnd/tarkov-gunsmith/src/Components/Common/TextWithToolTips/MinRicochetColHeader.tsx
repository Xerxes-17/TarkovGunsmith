import {  HoverCard, Text } from "@mantine/core";

export function MinRicochetColHeader() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Min Ricochet Chance
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        Chance of ricochet at the Min. Angle perpendicular from the hit surface.
                        <br/><br/>
                        Ricochet chance is interpolated between this value and the Max. Chance at 90°.
                        <br/><br/>
                        Higher is better.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>

    )

}