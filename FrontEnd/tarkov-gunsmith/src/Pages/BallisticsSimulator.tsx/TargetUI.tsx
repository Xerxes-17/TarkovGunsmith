import { Divider, Title, Text } from "@mantine/core";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";

const MAX_HP = 150;
const HPmarks = [
    { value: 35, label: 'Head' },
    { value: 85, label: 'Thorax' },
]

export function TargetUI() {
    return (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: "flex-end" }}>
            <Divider my="xs" label={(<Title order={4}>Target Info</Title>)} />
            <NumberAndSlider
                label={"Hit Points"}
                property={"hitPointsPool"}
                precision={0}
                max={MAX_HP}
                min={1}
                step={1}
                marks={HPmarks}
            />
        </div>
    )
}