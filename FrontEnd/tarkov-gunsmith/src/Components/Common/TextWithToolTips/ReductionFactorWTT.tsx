import { Group, HoverCard, Text } from "@mantine/core";
import { smolInfo } from "../tgIcons";

export function ReductionFactorWTT() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                    <Group spacing="2px">
                        <Text size="sm">
                            Reduction Factor
                        </Text>
                        {smolInfo}
                    </Group>
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