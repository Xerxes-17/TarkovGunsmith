import { Box, Grid, Paper } from "@mantine/core";
import { BallisticSimResponse } from "../../../Pages/BallisticsSimulator.tsx/api-requests";
import { BsSsBarChart } from "./Charts/BsSsBarChart";
import { BsSsLineChart } from "./Charts/BsSsLineChart";

export type ChartModes = "line" | "bar"

export interface BallisticSimulatorSingleShotGraphProps {
    chartData: BallisticSimResponse[]
    mode?: "line" | "bar"
}

export function BallisticSimulatorSingleShotGraph({ chartData, mode }: BallisticSimulatorSingleShotGraphProps) {
    return (
        <Grid>
            <Grid.Col span={12}>
                {(mode === "line") && (
                    <Box>
                        <BsSsLineChart chartData={chartData} mode={mode} />
                    </Box>
                )}
                {(mode === "bar") && (
                    <Box >
                        <BsSsBarChart chartData={chartData} mode={mode} />
                    </Box>
                )}
            </Grid.Col>
        </Grid>
    )
}