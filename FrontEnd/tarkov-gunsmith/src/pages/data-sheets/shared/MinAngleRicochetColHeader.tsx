import {  HoverCard, Text } from "@mantine/core";

export function MinAngleRicochetColHeader() {
    return (
        <>
            <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Min Ricochet Angle
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        The minimum angle a ricochet can occur at perpendicular from the hit surface.
                        <br/><br/>
                        Ricochet chance is interpolated between the Min. Chance at this angle and the Max. Chance at 90°.
                        <br/><br/>
                        Lower is better.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>
    )
}