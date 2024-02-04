import {  HoverCard, Text } from "@mantine/core";

export function ArmorTypeWithToolTip() {
    return (
        <>
            <HoverCard width={210} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Armor Type
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        Dictates which player skill this armor item belongs to for bonuses, leveling, etc.
                        <br/><br/>
                        No other effects.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>

    )

}