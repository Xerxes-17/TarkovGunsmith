import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ComposedChart, Line} from "recharts";
import { BallisticSimDataPoint, BallisticSimOutput } from "../../../../Pages/BallisticCalculator/types";


export interface BallisticCalculatorGraphProps {
    resultData: BallisticSimOutput
}

export function BallisticEnergyChart({ resultData }: BallisticCalculatorGraphProps) {
    const chartData = resultData.DataPoints; // cut off the zero meter entry
    const damages = chartData.map(x=> x.Damage);
    const penetrations = chartData.map(x=> x.Penetration);
    const combinedArray = [...damages, ...penetrations];
    const damageOrPenetrationMax = Math.max(...combinedArray);

    const lengthOfArray = chartData.length;
    const intInterval = Math.floor(lengthOfArray/4)-1;

    return (
        <ResponsiveContainer >
            <ComposedChart
                data={chartData}
                margin={{
                    top: 0,
                    right: 10,
                    left: 0,
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
                />
                <Line
                    name="Damage"
                    type="linear"
                    dataKey={(row: BallisticSimDataPoint) => (row.Damage).toFixed(2)}
                    stroke="#E03131"
                    strokeWidth={2}
                />

                <YAxis
                    yAxisId="left-speed"
                    orientation="right"
                    stroke="#3BC9DB"
                    unit="m/s"
                    domain={[0, "dataMax"]}
                />
                <Line
                    name="Speed"
                    yAxisId="left-speed"
                    type="linear"
                    dataKey={(row: BallisticSimDataPoint) => (row.Speed).toFixed(2)}
                    stroke="#3BC9DB"
                    strokeWidth={2}
                />

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
    )
}