import { Badge } from "@mantine/core";

type HtkBadgeProps = {
    value: number;
    projectileCount: number
};

function getEffectivenessColorCodeString(value: number, projectileCount: number) {
    var htk = value;
    if (projectileCount > 1) {
        htk = Math.ceil(htk / projectileCount)
    }

    if (htk === 1) {
        return "grape"
    }
    else if (htk <= 2) {
        return "blue"
    }
    else if (htk <= 4) {
        return "lime"
    }
    else if (htk <= 6) {
        return "yellow"
    }
    else if (htk <= 8) {
        return "orange"
    }
    else if (htk <= 15) {
        return "red"
    }
    else {
        return "gray"
    }
}

function getDisplayValue(value: number, projectileCount: number){
    var displayString = "";
    if(projectileCount > 1){

        if(value > 64){
            displayString = ">64"
        }
        else{
            displayString = value.toFixed(1)
        }
    }
    else{
        if(value > 30){
            displayString = ">30"
        }
        else{
            displayString = value.toFixed(1)
        }
    }
    return displayString;
}

export function HtkBadge({ value, projectileCount }: HtkBadgeProps) {
    const colorCode = getEffectivenessColorCodeString(value, projectileCount);
    const displayValue = getDisplayValue(value, projectileCount);

    return (
        <Badge color={colorCode} variant="light">{displayValue}</Badge>
    )
}