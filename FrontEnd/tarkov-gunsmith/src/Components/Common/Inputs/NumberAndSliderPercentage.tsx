import { NumberInput, Slider} from "@mantine/core";
import { useBallisticSimulatorFormContext } from
    "../../../Pages/BallisticsSimulator.tsx/ballistic-simulator--form-context";

interface NumberAndSliderPercentageProps {
    label: string,
    property: string;
    precision: number;
    step: number;
}

export function NumberAndSliderPercentage(props: NumberAndSliderPercentageProps) {
    const { label, property, precision, step } = props;
    const form = useBallisticSimulatorFormContext();

    return (
        <div>
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
        </div>
    )
}