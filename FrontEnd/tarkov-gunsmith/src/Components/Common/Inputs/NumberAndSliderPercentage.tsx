import { Box, NumberInput, Slider} from "@mantine/core";
import { useBallisticSimulatorFormContext } from
    "../../../Pages/BallisticsSimulator/ballistic-simulator--form-context";
import { ReactNode } from "react";

interface NumberAndSliderPercentageProps {
    label: string | ReactNode,
    property: string;
    precision: number;
    step: number;
    w?: number | string;
}

export function NumberAndSliderPercentage(props: NumberAndSliderPercentageProps) {
    const { label, property, precision, step, w } = props;
    const form = useBallisticSimulatorFormContext();

    return (
        <Box w={w} >
            <NumberInput
                label={label}
                parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
                formatter={(value) =>
                    !Number.isNaN(parseFloat(value))
                        ? `${value} %`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                        : ' %'
                }
                precision={precision}
                max={100}
                min={0}
                step={step}
                stepHoldDelay={500}
                stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                {...form.getInputProps(property)}
            />
            <Slider
                label={null}
                max={100}
                min={0}
                step={step}
                {...form.getInputProps(property)}
            />
        </Box>
    )
}