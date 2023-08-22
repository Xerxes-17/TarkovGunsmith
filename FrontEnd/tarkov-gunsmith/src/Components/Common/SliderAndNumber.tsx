import { Grid, Group, Input, NumberInput, Slider } from "@mantine/core";
import { useState } from "react";



export default function SliderAndNumber() {
    const MaxValue = 40;

    const [value, setValue] = useState<number>(MaxValue);
    const [percentage, setPercentage] = useState<number>(100)

    const sliderMarks = [
        { value: MaxValue * 0.75, label: "75%" },
        { value: MaxValue * 0.5, label: "50%" },
        { value: MaxValue * 0.25, label: "25%" },
    ];

    function handleValueChange(val: number) {
        console.log("handleValueChange", val)
        setValue(val)
        setPercentage((val / MaxValue) * 100)
    }

    function handlePercentageChange(val: string) {
        console.log("handlePercentageChange", val)
        setPercentage(parseFloat(val))
        setValue((parseFloat(val) / 100) * MaxValue)
    }

    return (
        <>

            <Grid grow gutter="xl">
                <Grid.Col xs={7} span={12}>
                    <Input.Wrapper
                        id="armorDurability"
                        label="Armor Durability"
                    >
                        <Slider
                            max={MaxValue}
                            value={value}
                            label={(value) => `${((value / MaxValue) * 100).toFixed(1)} %`}

                            onChange={handleValueChange}
                            marks={sliderMarks}
                        />
                    </Input.Wrapper>
                </Grid.Col>
                <Grid.Col xs={2} span={12}>
                    <NumberInput
                        label="Value"
                        precision={2}
                        min={0}
                        step={1}
                        stepHoldDelay={500}
                        stepHoldInterval={100}
                        max={MaxValue}
                        value={value}
                        onChange={handleValueChange}
                    />
                    <NumberInput
                        label="Percentage"
                        precision={2}
                        min={0}
                        step={1}
                        stepHoldDelay={500}
                        stepHoldInterval={100}
                        max={100}
                        value={percentage}
                        onChange={(value) => handlePercentageChange(`${value}`)}
                        formatter={(value) =>
                            !Number.isNaN(parseFloat(value))
                                ? `${value} %`
                                : ''}
                    />

                    <Grid>
                        <Grid.Col span={6}>

                        </Grid.Col>
                        <Grid.Col span={6}>

                        </Grid.Col>
                    </Grid>
                </Grid.Col>
            </Grid>


        </>
    )
}