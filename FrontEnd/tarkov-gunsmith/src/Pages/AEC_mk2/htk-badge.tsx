import { Badge } from "@mantine/core";

// todo: use this or something else with the cell content override, focusing on functionality first before styling.
export function HtkBadge({children}: React.PropsWithChildren){
    return (
        <Badge color="indigo" variant="dot">{children}</Badge>
    )
}