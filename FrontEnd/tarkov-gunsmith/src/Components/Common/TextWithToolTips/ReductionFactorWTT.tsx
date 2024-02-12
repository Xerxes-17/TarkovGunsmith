import {  HoverCard, Text } from "@mantine/core";

export function ReductionFactorWTT() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Reduction Factor
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        How much of the current damage and penetration will remain after going through an armor layer. This value is clamped between 60% and 100%.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>
    )
}