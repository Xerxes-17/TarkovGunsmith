import { Checkbox } from "@mantine/core";
import { NumberAndSliderPercentage } from "../../Components/Common/Inputs/NumberAndSliderPercentage";
import { BluntThroughputWithToolTip } from "../../Components/Common/TextWithToolTips/BluntThroughputWithToolTip";
import { useBallisticSimulatorFormContext } from "./ballistic-simulator-form-context";
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