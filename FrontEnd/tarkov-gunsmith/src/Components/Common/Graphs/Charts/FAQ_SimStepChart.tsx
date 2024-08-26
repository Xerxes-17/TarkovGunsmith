import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ComposedChart, Line, ReferenceLine } from "recharts";
import { Box } from "@mantine/core";

interface SimStepChartExample {
  distance: number,
  damage: number,
  penetration: number,
  speed: number
}

export function FAQ_SimStepChart() {
  const chartData: SimStepChartExample[] = [
    {
      distance: 8,
      damage: 52,
      penetration: 32,
      speed: 825
    },
    {
      distance: 10,
      damage: 50,
      penetration: 30,
      speed: 800
    },
    {
      distance: 12,
      damage: 50,
      penetration: 30,
      speed: 800
    },
    {
      distance: 14,
      damage: 50,
      penetration: 30,
      speed: 800
    },
    {
      distance: 16,
      damage: 50,
      penetration: 30,
      speed: 800
    },
    {
      distance: 18,
      damage: 50,
      penetration: 30,
      speed: 800
    },
    {
      distance: 20,
      damage: 48,
      penetration: 28,
      speed: 780
    },
    {
      distance: 22,
      damage: 48,
      penetration: 28,
      speed: 780
    },
    {
      distance: 24,
      damage: 48,
      penetration: 28,
      speed: 780
    },
  ]

  const lengthOfArray = chartData.length;
  const intInterval = Math.floor(lengthOfArray / 4) - 1;

  const NstepCustomLabel = (props: {
    viewBox: { x: string | number | undefined; y: string | number | undefined; };
  }) => {
    return (
      <g>
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#ffffff" dy={140} dx={6}>
          Step N
        </text>
      </g>
    );
  };

  const N1stepCustomLabel = (props: {
    viewBox: { x: string | number | undefined; y: string | number | undefined; };
  }) => {
    return (
      <g>
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#ffffff" dy={140} dx={6}>
          Step N+1
        </text>
      </g>
    );
  };

  return (
    <Box maw={560} miw={250} w={550} mih={210}>
      <ResponsiveContainer minHeight={210} minWidth={250}>
        <ComposedChart
          data={chartData}
          margin={{
            top: 0,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          style={{ zIndex: 10, color: "white" }}

        >
          <CartesianGrid strokeDasharray={1} />
          <XAxis
            type="category"
            dataKey={(row: SimStepChartExample) => (row.distance)}
            interval={intInterval}
            unit={"m"}
          />
          <YAxis
          />
          <Line
            name="Damage"
            type="linear"
            dataKey={(row: SimStepChartExample) => (row.damage).toFixed(2)}
            stroke="#E03131"
            strokeWidth={2}
          />
          <Line
            name="Penetration"
            type="linear"
            dataKey={(row: SimStepChartExample) => (row.penetration).toFixed(2)}
            stroke="#FAB005"
            strokeWidth={2}
          />

          <YAxis
            yAxisId="speed"
            orientation="right"
            stroke="#3BC9DB"
            unit="m/s"
            domain={[700, 1000]}
          />
          <Line
            name="Speed"
            yAxisId="speed"
            type="linear"
            dataKey={(row: SimStepChartExample) => (row.speed).toFixed(2)}
            stroke="#3BC9DB"
            strokeWidth={2}
          />

          <ReferenceLine yAxisId="speed" x={10} label={NstepCustomLabel} stroke="red"/>
          <ReferenceLine yAxisId="speed" x={20} label={N1stepCustomLabel} stroke="red"/>

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