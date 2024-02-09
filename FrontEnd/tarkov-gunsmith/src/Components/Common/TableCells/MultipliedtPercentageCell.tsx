import { MRT_Cell } from "mantine-react-table";

export function MultipliedPercentageCell<T extends {}>(cell: MRT_Cell<T>){
    return (<>{cell.getValue<number>()*100} %</>)
}