import { HoverCard, Text } from "@mantine/core";
import { MRT_Cell } from "mantine-react-table";

export function BluntDamageCell<T extends {}>(cell: MRT_Cell<T>, rowHitZones: string[]) {
    if (rowHitZones.some(x => x.includes('SAPI') || x.includes('Korund') || x.includes('6B13'))) {
        return (
            <HoverCard shadow="md">
                <HoverCard.Target>
                    <Text size="sm">
                        {(cell.getValue<number>()).toFixed(1)} %
                    </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown >
                    <Text fw={400} style={{ whiteSpace: "normal" }}>
                        As of patch 14.0.0, plate collider armor doesn't have blunt damage.
                    </Text>
                </HoverCard.Dropdown>
            </HoverCard>
            )
    }
    return (<>{(cell.getValue<number>()).toFixed(1)} %</>)
}