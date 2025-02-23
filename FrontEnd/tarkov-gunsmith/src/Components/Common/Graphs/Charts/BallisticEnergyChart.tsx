import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ComposedChart, Line, ReferenceLine } from "recharts";
import { BallisticSimDataPoint, BallisticSimOutput } from "../../../../Pages/BallisticCalculator/types";
import { Box } from "@mantine/core";


export interface BallisticCalculatorGraphProps {
    resultData: BallisticSimOutput
}

export function BallisticEnergyChart({ resultData }: BallisticCalculatorGraphProps) {
    const chartData = resultData.DataPoints; // cut off the zero meter entry
    const damages = chartData.map(x => x.Damage);
    const penetrations = chartData.map(x => x.Penetration);
    const combinedArray = [...damages, ...penetrations];
    const damageOrPenetrationMax = Math.max(...combinedArray);

    const lengthOfArray = chartData.length;
    const intInterval = Math.floor(lengthOfArray / 4) - 1;


    const speedOfSoundLabel = (props: {
        viewBox: { x: number | undefined; y: string | number | undefined; };
      }) => {
        return (
          <g>
            <text x={props.viewBox.x} y={props.viewBox.y} fill="#ffffff" dy={-10} dx={(props.viewBox.x ?? 0) + -90}>
              Speed of Sound
            </text>
          </g>
        );
      };

    return (
        <Box miw={200} maw={650} h={285} mih={210} mb={20}>
            <ResponsiveContainer width={"100%"} >
                <ComposedChart
                    data={chartData}
                    margin={{
                        top: 10,
                        right: 30,
                        left: 30,
                        bottom: 0,
                    }}
                    style={{ zIndex: 10 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        type="category"
                        dataKey={(row: BallisticSimDataPoint) => (row.Distance)}
                        interval={intInterval}
                        unit={"m"}
                    />
                    <XAxis
                        xAxisId={"time"}
                        type="category"
                        dataKey={(row: BallisticSimDataPoint) => (row.TimeOfFlight).toFixed(2)}
                        interval={intInterval}
                        unit={"s"}
                    />
                    <YAxis
                        domain={[0, damageOrPenetrationMax]}
                    />

                    <Line
                        name="Penetration"
                        type="linear"
                        dataKey={(row: BallisticSimDataPoint) => (row.Penetration).toFixed(2)}
                        stroke="#FAB005"
                        strokeWidth={2}
                        dot={false}
                    />
                    <Line
                        name="Damage"
                        type="linear"
                        dataKey={(row: BallisticSimDataPoint) => (row.Damage).toFixed(2)}
                        stroke="#E03131"
                        strokeWidth={2}
                        dot={false}
                    />

                    <YAxis
                        yAxisId="speed"
                        orientation="right"
                        stroke="#3BC9DB"
                        unit=" m/s"
                        domain={[0, "dataMax"]}
                    />
                    <Line
                        name="Speed"
                        yAxisId="speed"
                        type="linear"
                        dataKey={(row: BallisticSimDataPoint) => (row.Speed).toFixed(2)}
                        stroke="#3BC9DB"
                        strokeWidth={2}
                        unit=" m/s"
                        dot={false}
                    />

                    {/* <ReferenceLine yAxisId="speed" y={343} label={speedOfSoundLabel} stroke="yellow" position="start" /> */}

                    <Tooltip
                        allowEscapeViewBox={{ x: false, y: true }}
                        contentStyle={{ backgroundColor: "#1A1B1E" }}
                        label={{}}
                    />
                    <Legend
                        layout='horizontal'
                        verticalAlign="top"
                    />
                </ComposedChart>
            </ResponsiveContainer>
        </Box>

    )
}