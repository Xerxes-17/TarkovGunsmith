import {  HoverCard, Text } from "@mantine/core";

export function MaxRicochetColHeader() {
    return (
        <>
            <HoverCard width={280} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Max Ricochet Chance
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        Chance of ricochet at 90° perpendicular from the hit surface.
                        <br/><br/>
                        Ricochet chance is interpolated between this value and the Min. Chance
                        at Min. Angle.
                        <br/><br/>
                        If this value is 0, then no ricochet is possible. Higher is better.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>

    )

}