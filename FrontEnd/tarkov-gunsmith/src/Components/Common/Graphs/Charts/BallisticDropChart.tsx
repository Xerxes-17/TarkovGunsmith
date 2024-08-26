import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ComposedChart, Line, ReferenceLine } from "recharts";
import { BallisticSimDataPoint } from "../../../../Pages/BallisticCalculator/types";
import { Box } from "@mantine/core";

export interface BallisticCalculatorGraphProps {
  selectedCalibration: string;
  resultData: BallisticSimDataPoint[]
}

export function BallisticDropChart({ resultData: chartData, selectedCalibration }: BallisticCalculatorGraphProps) {

  // const foo = chartData.map((x) => {
  //   return {
  //     // distance: x.Distance,
  //     dropSlug: x.Drop,
  //   }
  // })
  // console.log("foo", foo)

  const calibrationNumber = parseInt(selectedCalibration) ?? -1

  const lengthOfArray = chartData.length;
  const intInterval = Math.floor(lengthOfArray / 4) - 1;

  const calibrationCustomLabel = (props: {
    viewBox: { x: string | number | undefined; y: string | number | undefined; };
  }) => {
    return (
      <g>
        {/* <rect
              x={props.viewBox.x}
              y={props.viewBox.y}
              fill="#aaa"
              width={100}
              height={30}
            /> */}
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#ffffff" dy={20} dx={-82}>
          Calibration
        </text>
      </g>
    );
  };

  const lineOfSightCustomLabel = (props: {
    viewBox: { x: number | undefined; y: string | number | undefined; };
  }) => {
    return (
      <g>
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#ffffff" dy={-10} dx={(props.viewBox.x ?? 0) + 30}>
          Line of Sight
        </text>
      </g>
    );
  };

  return (
    <Box miw={200} maw={650} h={300} mih={210}>
      <ResponsiveContainer width={"100%"} >
        <ComposedChart
          data={chartData}
          margin={{
            top: 0,
            right: 90,
            left: 30,
            bottom: 0,
          }}
          style={{ zIndex: 10, color: "white" }}

        >
          <CartesianGrid strokeDasharray={1} />
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
            yAxisId="left-drop"
            orientation="left"
            dataKey={(row: BallisticSimDataPoint) => (row.Drop * 100)}
            unit={"cm"}
          />

          <ReferenceLine yAxisId="left-drop" y={0} label={lineOfSightCustomLabel} stroke="red" position="start" />
          <ReferenceLine yAxisId="left-drop" x={calibrationNumber} label={calibrationCustomLabel} stroke="red" position="end" />

          <Tooltip
            allowEscapeViewBox={{ x: false, y: true }}
            contentStyle={{ backgroundColor: "#1A1B1E" }}
            label={{}}
          />
          <Legend
            layout='horizontal'
            verticalAlign="top"
          />

          <Line
            name="Drop"
            yAxisId="left-drop"
            type="linear"
            dataKey={(row: BallisticSimDataPoint) => (row.Drop * 100).toFixed(2)}
            stroke="#1864ab"
            strokeWidth={2}
            unit={"cm"}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>

  )
}