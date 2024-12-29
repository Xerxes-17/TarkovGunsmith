import { Paper } from "@mantine/core";

export function CommonCardPaper({children}: {children: JSX.Element}){

    return (
        <Paper shadow="sm" p={2} px={5} mt={0}>
            {children}
        </Paper>
    )
}