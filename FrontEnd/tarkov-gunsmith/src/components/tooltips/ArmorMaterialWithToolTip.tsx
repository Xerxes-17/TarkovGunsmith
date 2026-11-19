import {  HoverCard, Text } from "@mantine/core";

export function ArmorMaterialWithToolTip() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                        <Text size="sm">
                            Armor Material
                        </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        The material an armor is made from.
                        <br/><br/>
                        Changes how destructible armor is, and how well it repairs.
                        <br/><br/>
                        No other direct effects.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>

    )

}