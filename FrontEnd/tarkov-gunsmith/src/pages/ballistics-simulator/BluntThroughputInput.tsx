import { Checkbox } from "@mantine/core";
import { NumberAndSliderPercentage } from "./inputs/NumberAndSliderPercentage";
import { BluntThroughputWithToolTip } from "../../components/tooltips/BluntThroughputWithToolTip";
import { useBallisticSimulatorFormContext } from "./ballisticSimulatorFormContext";
import { TargetZone } from "./TargetUiAlternate";

export interface BluntThroughputInputProps {
    index: number
    w?: string | number
}

export function BluntThroughputInput({ index, w }: BluntThroughputInputProps) {
    const form = useBallisticSimulatorFormContext()

    const description =
        ((form.values.targetZone === "Stomach" as TargetZone) || (form.values.targetZone === "Thorax" as TargetZone)) ?
            <Checkbox label="Plate?" {...form.getInputProps(`armorLayers.${index}.isPlate`, { type: 'checkbox' })} /> :
            <></>

    return (
        <>
            {index === 0 && (
                <NumberAndSliderPercentage
                    w={w}
                    label={<BluntThroughputWithToolTip />}
                    property={`armorLayers.${index}.bluntDamageThroughput`}
                    precision={2}
                    step={1}
                    description={description}
                />
            )}
            {index !== 0 && (
                <NumberAndSliderPercentage
                    w={w}
                    label={<BluntThroughputWithToolTip />}
                    property={`armorLayers.${index}.bluntDamageThroughput`}
                    precision={2}
                    step={1}
                />
            )}
        </>
    )
}