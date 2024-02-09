import { MRT_Cell, MRT_Row } from "mantine-react-table";
import { NewArmorTableRow } from '../../../Types/HelmetTypes';
import { createHitZoneValues_ArmorTableRow } from "../Helpers/ArmorHelpers";

export function ArmorBluntDamageCell<T extends {}>(cell: MRT_Cell<T>, row: MRT_Row<NewArmorTableRow>){
    const isChilde = row.getParentRow() !== undefined;
    const rowHitZones = createHitZoneValues_ArmorTableRow(row.original);

    if(isChilde && rowHitZones.some(x=> x.includes('SAPI') || x.includes('Korund') || x.includes('6B13') )){
        return (<>-</>)
    }
    return (<>{(cell.getValue<number>()*100).toFixed(2)} %</>)
}