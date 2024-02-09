import { MRT_Cell } from "mantine-react-table";

export function BluntDamageCell<T extends {}>(cell: MRT_Cell<T>, rowHitZones: string[]){
    if(rowHitZones.some(x=> x.includes('SAPI') || x.includes('Korund') || x.includes('6B13') )){
        return (<>-</>)
    }
    return (<>{(cell.getValue<number>()*100).toFixed(2)} %</>)
}