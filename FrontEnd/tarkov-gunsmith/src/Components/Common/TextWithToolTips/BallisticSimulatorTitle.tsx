import { HoverCard, Text, Title } from "@mantine/core";

export function BallisticSimulatorTitle() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                    <Title order={2}>Ballistic Simulator</Title>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        Simulate how well a bullet performs vs armor.
                        <br/><br/>
                        <strong>Please note</strong> this isn't accurate with Armor Plates yet, so use it for checking non-plate armor interactions.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>
    )
}