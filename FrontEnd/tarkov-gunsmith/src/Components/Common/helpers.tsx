import html2canvas from "html2canvas";
import { copyImageToClipboard } from "copy-image-clipboard";
import { MRT_Cell } from "material-react-table";
import { AmmoTableRow } from "./Types/AmmoTypes";
import { Tooltip, Group } from "@mantine/core";
import { ReactNode } from "react";
 
 export const handleImageDownload = async (targetId:string) => {
    const element: any = document.getElementById(targetId),
        canvas = await html2canvas(element),
        data = canvas.toDataURL('image/png'),
        link = document.createElement('a');

    link.href = data;
    link.download = `TarkovGunsmith_${Date.now()}.png`

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const handleCopyImage = async (targetId:string) => {
    try {
        const element: any = document.getElementById(targetId),
            canvas = await html2canvas(element),
            data = canvas.toDataURL('image/png');

        if (data) await copyImageToClipboard(data)
    } catch (e: any) {
        if (e?.message) alert(e.message)
    }
}

export function sumCostOfModsInFE(presetMods:any[], purchasedMods: any[]): number{
    let total = 0;
    
    // Step 1: Create an array of preset mod IDs
    const presetModIds = presetMods.map((mod) => mod.Id);

    // Step 2: Filter purchased mods to include only mods not found in preset mods
    const actuallyPurchasedMods = purchasedMods.filter(
        (entry) => !presetModIds.includes(entry.WeaponMod.Id)
    );

    // Step 3: Sum the costs of the remaining purchased mods
    total = actuallyPurchasedMods.reduce((accumulator, entry) => {
        return accumulator + entry.PurchaseOffer?.PriceRUB;
    }, 0);

    return total;
}

export function currencyStringToSymbol(str: string) {
    if (str.includes("USD"))
        return "$"
    else if (str.includes("EUR"))
        return "€"
    else if (str.includes("RUB"))
        return "₽"
    else
        return ""
}

// Helper function to get the enum key based on its numerical value
export function getEnumKeyByValue(enumObj: any, enumValue: number): string | undefined {
    return Object.keys(enumObj).find((key) => enumObj[key] === enumValue);
}

export function AggregatedCellMedMaxMeanMin(cell:MRT_Cell<AmmoTableRow>){
    return (
        <Group>
            <Tooltip label="Max">
                <div>
                    ∨: {cell.getValue<Array<number>>()?.[1].toFixed(0)}
                </div>
            </Tooltip>
            <Tooltip label={<>Average <br />Median: {cell.getValue<Array<number>>()?.[0].toFixed(0)}</>}>
                <div>
                    x̄: {cell.getValue<Array<number>>()?.[2].toFixed(0)}
                </div>
            </Tooltip>
            <Tooltip label="Min">
                <div>
                    ∧: {cell.getValue<Array<number>>()?.[3].toFixed(0)}
                </div>
            </Tooltip>
        </Group>
    )
}