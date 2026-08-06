import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { TtkRow } from "./ttk-types";

export interface TtkTopResultsChartProps {
    rows: TtkRow[];
    count?: number;
}

interface ChartDatum {
    label: string;
    ttkSeconds: number;
    htk: number | null;
    effectiveRpm: number;
}

export function TtkTopResultsChart({ rows, count = 15 }: TtkTopResultsChartProps) {
    const chartData: ChartDatum[] = rows
        .filter((row) => Number.isFinite(row.ttkSeconds))
        .slice(0, count)
        .map((row) => ({
            label: `${row.weaponShortName} / ${row.ammoShortName}`,
            ttkSeconds: Number(row.ttkSeconds.toFixed(3)),
            htk: row.htk,
            effectiveRpm: row.effectiveRpm,
        }));

    if (chartData.length === 0) {
        return null;
    }

    return (
        <ResponsiveContainer minHeight={40 + chartData.length * 28}>
            <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 40, left: 140, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, "dataMax"]} unit="s" />
                <YAxis type="category" dataKey="label" width={140} interval={0} tick={{ fontSize: 11 }} />
                <Tooltip
                    allowEscapeViewBox={{ x: false, y: true }}
                    contentStyle={{ backgroundColor: "#1A1B1E" }}
                    formatter={(value: any) => [`${value} s`, "Time to kill"]}
                />
                <Bar name="ttkSeconds" dataKey="ttkSeconds" fill="#1098AD">
                    {chartData.map((entry, index) => (
                        <Cell key={entry.label} fill={`hsl(187, 84%, ${38 + index * 2}%)`} />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}
