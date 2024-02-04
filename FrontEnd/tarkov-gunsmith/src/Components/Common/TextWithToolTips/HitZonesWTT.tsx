import {  HoverCard, Text } from "@mantine/core";

export function HitZonesWTT() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Hit Zones
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        The area(s) an item of armor (can) protect. Plates colliders are marked with *.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>

    )

}