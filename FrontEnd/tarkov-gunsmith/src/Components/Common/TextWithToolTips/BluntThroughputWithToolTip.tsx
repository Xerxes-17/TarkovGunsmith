import {  HoverCard, Text } from "@mantine/core";

export function BluntThroughputWithToolTip() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Blunt Throughput
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        The multiplier on a projectile's damage when a non-plate armor collider blocks it. Plate-collider armor ignores this stat and always have 0 blunt damage.
                        <br/><br/>
                        This value is moderated by the armor's current "effectiveness", which is the AC and current durability out max, vs the penetration value. 
                        <br/><br/>
                        Low penetration rounds will do proportionally less than higher penetration rounds.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>

    )

}