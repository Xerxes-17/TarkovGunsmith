import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip } from "recharts";
import { BallisticSimResponse } from "../../../../Pages/BallisticsSimulator.tsx/api-requests";
import { BallisticSimulatorSingleShotGraphProps } from "./BallisticSimulatorSingleShotGraph";


export function BsSsBarChart({ chartData, mode }: BallisticSimulatorSingleShotGraphProps) {

    return (
        <ResponsiveContainer minHeight={400} >
            <BarChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
                style={{ paddingTop: 25 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="category"
                    tickFormatter={(value)=>{
                        return value + 1
                    }}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[0, 100]}
                    stroke="#22B8CF"
                    label={{ value: 'Percent %', position: 'top', angle: -90, offset: -120 }}
                />
                <YAxis
                    yAxisId="right"
                    stroke="#2F9E44"
                    orientation="right"
                    domain={[0, "max"]}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: "#1A1B1E" }}
                    label={{}}
                />
                <Legend
                    layout='horizontal'
                    verticalAlign="top"
                />
                <Bar
                    name="Penetration Chance"
                    yAxisId="left"
                    dataKey={(row: BallisticSimResponse) => (row.PenetrationChance * 100).toFixed(0)}
                    fill="#22B8CF"
                />
                <Bar
                    name="Penetration Damage"
                    yAxisId="right"
                    dataKey={(row: BallisticSimResponse) => (row.PenetrationDamage).toFixed(0)}
                    fill="#2F9E44"
                    stackId="a"
                />
                <Bar
                    name="Mitigated Damage"
                    yAxisId="right"
                    dataKey={(row: BallisticSimResponse) => (row.MitigatedDamage).toFixed(0)}
                    fill="#F03E3E"
                    stackId="a"
                />
                <Bar
                    name="Average Damage"
                    yAxisId="right"
                    dataKey={(row: BallisticSimResponse) => (row.AverageDamage).toFixed(0)}
                    fill="#F08C00"
                />
                <Bar
                    name="Blunt Damage"
                    yAxisId="right"
                    dataKey={(row: BallisticSimResponse) => (row.BluntDamage).toFixed(0)}
                    fill="#E8590C"
                />
                <Bar
                    name="Reduction Factor"
                    yAxisId="left"
                    dataKey={(row: BallisticSimResponse) => (row.ReductionFactor * 100).toFixed(0)}
                    fill="#B197FC"
                />

            </BarChart>
        </ResponsiveContainer>
    )
}