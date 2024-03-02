import { Group, HoverCard, Text, Title } from "@mantine/core";

export function BallisticSimulatorTitle() {
    return (
        <>
            <HoverCard width={250} shadow="md">
                <HoverCard.Target>
                    <Group spacing="xs">

                        <Title order={2}>Ballistic Simulator</Title>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-info-circle" width="22" height="22" viewBox="0 0 24 24" stroke-width="1.5" stroke="#ffffff" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" />
                            <path d="M12 9h.01" />
                            <path d="M11 12h1v4h1" />
                        </svg>


                    </Group>

                </HoverCard.Target>
                <HoverCard.Dropdown>
                    <Text fw={400}>
                        Simulate how well a bullet performs vs armor.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
        </>
    )
}