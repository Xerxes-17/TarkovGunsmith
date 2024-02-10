import {  HoverCard, Text } from "@mantine/core";

export function ArmorDamagePercentageWithToolTip() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Armor Damage Percentage
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        The proportion of a projectile's penetration that is dealt as armor damage.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>
    )
}