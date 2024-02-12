import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip, ComposedChart, Line } from "recharts";
import { BallisticSimResponse } from "../../../../Pages/BallisticsSimulator.tsx/api-requests";
import { BallisticSimulatorSingleShotGraphProps } from "../BallisticSimulatorSingleShotGraph";


export function BsSsLineChart({ chartData }: BallisticSimulatorSingleShotGraphProps) {


    return (
        <ResponsiveContainer minHeight={350} >
        <ComposedChart
            data={chartData}
            margin={{
                top: 0,
                right: -10,
                left: 10,
                bottom: 25,
            }}
            style={{ paddingTop: 25 }}
        >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
                dataKey="hitNum"
                // label={{ value: 'Layer ', position: 'bottom', offset: 0 }}
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
                allowEscapeViewBox={{ x: false, y: true }}
                contentStyle={{ backgroundColor: "#1A1B1E" }}
                label={{}}
            />
            <Legend
                layout='horizontal'
                verticalAlign="top"
            />

            {/* <Area
                                        name="Cumulative Chance of Kill %"
                                        yAxisId="left"
                                        type="linear"
                                        dataKey={(row: BallisticSimResponse) => (row.cumulativeChanceOfKill).toFixed(1)}
                                        stroke="#3BC9DB"
                                        fill="#1098AD"
                                        strokeWidth={2}
                                        legendType='square'
                                    />
                                    <Area
                                        name="Specific Chance of Kill %"
                                        yAxisId="left"
                                        type="linear"
                                        dataKey={(row: BallisticSimResponse) => (row.specificChanceOfKill).toFixed(1)}
                                        stroke="#82C91E"
                                        fill="#5C940D"
                                        strokeWidth={2}
                                        legendType='square'
                                    /> */}

            {/* <Line
                                        name="Durability %"
                                        yAxisId="left"
                                        type="linear"
                                        dataKey={(row: BallisticSimResponse) => ((row.durabilityBeforeHit / chartData[0].durabilityBeforeHit) * 100).toFixed(0)}
                                        stroke="#F76707"
                                        strokeWidth={2}
                                    /> */}
            <Line
                name="Penetration Chance"
                yAxisId="left"
                type="linear"
                dataKey={(row: BallisticSimResponse) => (row.PenetrationChance * 100).toFixed(0)}
                stroke="#22B8CF"
                strokeWidth={2}
            />
            <Line
                name="Penetration Damage"
                yAxisId="right"
                type="linear"
                dataKey={(row: BallisticSimResponse) => (row.PenetrationDamage).toFixed(0)}
                stroke="#2F9E44"
                strokeWidth={2}
            />
            <Line
                name="Mitigated Damage"
                yAxisId="right"
                type="linear"
                dataKey={(row: BallisticSimResponse) => (row.MitigatedDamage).toFixed(0)}
                stroke="#F03E3E"
                strokeWidth={2}
            />
            <Line
                name="Average Damage"
                yAxisId="right"
                type="linear"
                dataKey={(row: BallisticSimResponse) => (row.AverageDamage).toFixed(0)}
                stroke="#F08C00"
                strokeWidth={2}
            />
            <Line
                name="Blunt Damage"
                yAxisId="right"
                type="linear"
                dataKey={(row: BallisticSimResponse) => (row.BluntDamage).toFixed(0)}
                stroke="#E8590C"
                strokeWidth={2}
            />
            <Line
                name="Reduction Factor"
                yAxisId="left"
                type="linear"
                dataKey={(row: BallisticSimResponse) => (row.ReductionFactor*100).toFixed(0)}
                stroke="#B197FC"
                strokeWidth={2}
            />
        </ComposedChart>
    </ResponsiveContainer>
    )
}