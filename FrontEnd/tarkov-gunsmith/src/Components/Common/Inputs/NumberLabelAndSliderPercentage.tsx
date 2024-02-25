import { NumberInput, Slider} from "@mantine/core";
import { useBallisticSimulatorFormContext } from
    "../../../Pages/BallisticsSimulator/ballistic-simulator--form-context";
import { ReactNode } from "react";

interface NumberDescAndSliderPercentageProps {
    label: string | ReactNode,
    description: ReactNode,
    property: string;
    precision: number;
    step: number;
}

export function NumberLabelAndSliderPercentage(props: NumberDescAndSliderPercentageProps) {
    const { label, description, property, precision, step } = props;
    const form = useBallisticSimulatorFormContext();

    return (
        <NumberInput
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            label={label}
            aria-label={typeof label === "string" ? label : "An input"}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
            formatter={(value) =>
                !Number.isNaN(parseFloat(value))
                    ? `${value} %`.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',')
                    : ' %'
            }

            precision={precision}
            min={0}
            max={100}
            step={step}
            stepHoldDelay={500}
            stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
            {...form.getInputProps(property)}

            //todo - sim comparisons
            // rightSectionWidth={100}
            // rightSection={
            //     <Tooltip label="Comparison value" position="top-end" withArrow>
            //         <div>
            //             <Text size="sm">50%</Text>
            //         </div>
            //     </Tooltip>
            // }

            description={
                <>
                    <Slider
                        label={null}
                        precision={precision}
                        min={0}
                        max={100}
                        step={step}
                        {...form.getInputProps(property)}
                    />
                    {description}
                </>
            }
        />
    )
}