import { Divider, Title, Text } from "@mantine/core";
import { NumberAndSlider } from "../../Components/Common/Inputs/NumberAndSlider";

const MAX_HP = 85;
const HPmarks = [
    { value: 35, label: <Text size={"xs"}>Head</Text> },
    { value: 60, label: <Text size={"xs"}>Arm</Text>},
    { value: 65, label: <Text size={"xs"}>Leg</Text> },
    { value: 70, label: <Text ml={14} size={"xs"}>Stomach</Text> },
    { value: 85, label: <Text size={"xs"}>Thorax</Text> },
]

export function TargetUI() {
    return (
        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: "flex-end" }}>
            <Divider my={0} label={(<Title order={4}>Target Info</Title>)} />
            <NumberAndSlider
                label={"Hit Points"}
                property={"hitPointsPool"}
                precision={0}
                max={MAX_HP}
                min={35}
                step={1}
                marks={HPmarks}
                mb={20}
            />
        </div>
    )
}