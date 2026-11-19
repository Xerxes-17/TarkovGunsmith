import { ActionIcon, Group, Input, NumberInput, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import { useState } from "react";


export interface HtkConfidenceInputProps {
    onClick: (value: number) => void
}

export function HtkConfidenceInput({ onClick }: HtkConfidenceInputProps) {

    const [value, setValue] = useState<number | ''>(75);

    function handleStupidMantineTypeShit(): number {
        const valueAsNum = typeof value !== 'string' ? value : 75
        return valueAsNum
    }

    return (
        <Group spacing="xs">
            <Text fw={600}>Required HTK Confidence</Text>
            <Group spacing="xs">
                <NumberInput
                    w={100}
                    precision={2}
                    max={98}
                    min={1}
                    step={1}
                    stepHoldDelay={500}
                    stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
                    value={value} onChange={setValue}
                />
                <ActionIcon onClick={() => onClick(handleStupidMantineTypeShit())}>
                    <IconRefresh size="1.2rem" />
                </ActionIcon>
            </Group>
        </Group>
    )
}