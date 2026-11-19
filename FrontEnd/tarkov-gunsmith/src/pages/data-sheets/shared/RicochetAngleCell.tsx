import { MRT_Cell } from "mantine-react-table";
import { RicochetParams } from "../../../types/armorTypes";


export function RicochetAngleCell<T extends {}>(cell: MRT_Cell<T>, rowRicochetParams: RicochetParams){
    if(rowRicochetParams.x === 0){
        return (<>-</>)
    }
    return (<>{cell.getValue<number>()} °</>)
}