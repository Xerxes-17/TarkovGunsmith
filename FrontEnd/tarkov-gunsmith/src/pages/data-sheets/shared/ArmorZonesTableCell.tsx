import { Text, Group, HoverCard } from "@mantine/core";

export function ArmorZonesTableCell(zoneStrings: string[]) {
    const joined = zoneStrings.join("\n ");
    return (
        
        <Group>
            <HoverCard width={120} shadow="md" withinPortal={true} position="left">
                <HoverCard.Target>
                    <Text>
                        Hover
                    </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text size="sm">
                        {joined}
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </Group>
    );
}