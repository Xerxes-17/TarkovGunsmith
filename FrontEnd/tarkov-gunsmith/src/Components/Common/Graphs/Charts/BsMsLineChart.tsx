import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Legend, Bar, Tooltip, ComposedChart, Line, Area } from "recharts";
import { BallisticSimHitSummary, BallisticSimResponse, BallisticSimResultV2 } from "../../../../Pages/BallisticsSimulator/api-requests";

export interface BallisticSimulatorMultiShotGraphProps {
    resultData: BallisticSimResultV2
}

export function BsMsLineChart({ resultData }: BallisticSimulatorMultiShotGraphProps) {
    const simParameters = resultData.Inputs;
    const chartData = resultData.hitSummaries;

    const layers = simParameters.armorLayers.map((item, index) => {
        return (
            <>
                <Line
                    name={`Layer ${index + 1} Block Chance %`}
                    yAxisId="left"
                    type="linear"
                    dataKey={(row: BallisticSimHitSummary) => (row.layerHitResultDetails[index].prBlock * 100).toFixed(0)}
                    stroke={`hsl(222, 96%, ${50 + index * 10}%)`}
                    strokeWidth={2}
                />

                {/* <Area
                    name={`Layer ${index + 1} Mitigated Damage`}
                    yAxisId="right"
                    type="linear"
                    dataKey={(row: BallisticSimHitSummary) => (row.layerHitResultDetails[index].damageMitigated).toFixed(1)}
                    stroke="#82C91E"
                    fill=""
                    strokeWidth={2}
                    legendType='square'
                    stackId={1}
                /> */}
            </>

        )
    })

    return (
        <ResponsiveContainer minHeight={400} >
            <ComposedChart
                data={chartData}
                margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5,
                }}
                style={{zIndex:10}}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    type="category"
                    dataKey={(row: BallisticSimHitSummary) => (row.hitNum)}
                />
                <YAxis
                    yAxisId="left"
                    orientation="left"
                    domain={[0, 100]}
                    // stroke="#22B8CF"
                    label={{ value: 'Percent %', position: 'top', angle: -90, offset: -120 }}
                />
                <YAxis
                    yAxisId="right"
                    stroke="#E03131"
                    orientation="right"
                    domain={[0, simParameters.damage]}
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

                <Area
                    name="Cumulative Chance of Kill %"
                    yAxisId="left"
                    type="linear"
                    dataKey={(row: BallisticSimHitSummary) => (row.cumulativeChanceOfKill).toFixed(1)}
                    stroke="#3BC9DB"
                    fill="#1098AD"
                    strokeWidth={2}
                    legendType='square'
                />
                <Area
                    name="Specific Chance of Kill %"
                    yAxisId="left"
                    type="linear"
                    dataKey={(row: BallisticSimHitSummary) => (row.specificChanceOfKill).toFixed(1)}
                    stroke="#82C91E"
                    fill="#5C940D"
                    strokeWidth={2}
                    legendType='square'
                />

                {layers}

                <Line
                    name="Penetration Chance %"
                    yAxisId="left"
                    type="linear"
                    dataKey={(row: BallisticSimHitSummary) => (row.prPenetration * 100).toFixed(0)}
                    stroke="#FAB005"
                    strokeWidth={2}
                />

                <Line
                    name="Penetration Damage"
                    yAxisId="right"
                    type="linear"
                    dataKey={(row: BallisticSimHitSummary) => (row.damagePenetration).toFixed(0)}
                    stroke="#E03131"
                    strokeWidth={2}
                />
                {/* <Area
                    name="Penetration Damage"
                    yAxisId="right"
                    type="linear"
                    dataKey={(row: BallisticSimHitSummary) => (row.damagePenetration).toFixed(0)}
                    stroke="#82C91E"
                    fill=""
                    strokeWidth={2}
                    legendType='square'
                    stackId={1}
                /> */}



                {/* <Line
                    name="Remaining HP"
                    yAxisId="right"
                    type="linear"
                    dataKey={(row: BallisticSimHitSummary) => (row.averageRemainingHP).toFixed(0)}
                    stroke="#E8590C"
                    strokeWidth={2}
                /> */}

                {/* 
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
                    dataKey={(row: BallisticSimResponse) => (row.ReductionFactor * 100).toFixed(0)}
                    stroke="#B197FC"
                    strokeWidth={2}
                /> */}
            </ComposedChart>
        </ResponsiveContainer>
    )
}