import { MRT_Cell } from "mantine-react-table";

export function DirectPercentageCell<T extends {}>(cell: MRT_Cell<T>){
    return (<>{cell.getValue<number>()} %</>)
}