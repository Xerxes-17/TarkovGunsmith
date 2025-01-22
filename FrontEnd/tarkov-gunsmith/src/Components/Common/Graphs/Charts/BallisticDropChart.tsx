import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ComposedChart, Line, ReferenceLine } from "recharts";
import { BallisticSimDataPoint } from "../../../../Pages/BallisticCalculator/types";
import { Box, Checkbox, Group, NumberInput, RangeSlider, Text } from "@mantine/core";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

export interface BallisticCalculatorGraphProps {
  selectedCalibration: string;
  resultData: BallisticSimDataPoint[]
}

export function BallisticDropChart({ resultData: chartData, selectedCalibration }: BallisticCalculatorGraphProps) {

  const calibrationNumber = parseInt(selectedCalibration) ?? -1

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
  const distanceMax = chartData[chartData.length - 1].Distance;

  const [xAxisFilterMin, setXAxisFilterMin] = useState<number>(0);
  const [xAxisFilterMax, setXAxisFilterMax] = useState<number>(distanceMax);

  const filtered = chartData.filter(item => item.Distance >= xAxisFilterMin && item.Distance <= xAxisFilterMax)

  const dropMax = (chartData.reduce((max, item) => {
    return item.Drop > max.Drop ? item : max;
  }, filtered[0]).Drop * 100)

  const dropMin = chartData.reduce((min, item) => {
    return item.Drop < min.Drop ? item : min;
  }, filtered[0]).Drop * 100

  const [opened, { toggle }] = useDisclosure(false);
  const [yDomainMin, setYDomainMin] = useState<number>((Math.ceil(dropMin - 1)));
  const [yDomainMax, setYDomainMax] = useState<number>((Math.ceil(dropMax + 1)));

  return (
    <>
      <Group grow>
        <NumberInput
          label="Distance Min"
          size="xs"
          maw={80}
          value={xAxisFilterMin}
          min={0}
          max={xAxisFilterMax - 10}
          onChange={(value) => {
            if (value)
              setXAxisFilterMin(value)
          }}
          step={10}
          ml={40}
          icon={<Text>&gt;&#61;</Text>}
        />

        <NumberInput maw={80}
          label="Distance Max"
          size="xs"
          value={xAxisFilterMax}
          min={xAxisFilterMin + 10}
          max={distanceMax}
          onChange={(value) => {
            if (value)
              setXAxisFilterMax(value)
          }}
          step={10}
          icon={<Text>&lt;&#61;</Text>}
        />
        <RangeSlider
          label={(value) => `${value}m`}
          mt={25}
          title="Distance"
          maw={320}
          value={[xAxisFilterMin, xAxisFilterMax]}
          min={0}
          max={distanceMax}
          onChange={(value) => {
            if (value) {
              setXAxisFilterMin(value[0])
              setXAxisFilterMax(value[1])
            }
          }}
          step={10}
        />
      </Group>

      <Group>
        <NumberInput maw={80}
          ml={40}
          label="Drop Max"
          size="xs"
          value={yDomainMax}
          min={yDomainMin + 5}
          onChange={(value) => {
            if (value)
              setYDomainMax(value)
          }}
          step={1}
          icon={<Text>&lt;&#61;</Text>}
          stepHoldDelay={500}
          stepHoldInterval={10}
        />
        <NumberInput
          label="Drop Min"
          size="xs"
          maw={80}
          value={yDomainMin}
          max={yDomainMax - 5}
          onChange={(value) => {
            if (value)
              setYDomainMin(value)
          }}
          step={1}

          icon={<Text>&gt;&#61;</Text>}
          stepHoldDelay={500}
          stepHoldInterval={10}
        />
        <Checkbox
          mt={20}
          label="Manual Chart Y-Domain"
          checked={opened}
          onChange={() => toggle()}
        />
      </Group>
      <Box miw={200} maw={650} h={300} mih={210}>
        <ResponsiveContainer width={"100%"} >
          <ComposedChart
            data={filtered}
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
              type="number"
              dataKey={(row: BallisticSimDataPoint) => (row.Distance)}
              unit={"m"}
              allowDataOverflow={opened ? true : false}
              domain={['dataMin', 'dataMax']}
            />
            <XAxis
              xAxisId={"time"}
              type="number"
              dataKey={(row: BallisticSimDataPoint) => (row.TimeOfFlight).toFixed(2)}
              unit={"s"}
              allowDataOverflow={opened ? true : false}
              domain={['dataMin', 'dataMax']}
            />
            <YAxis
              yAxisId="left-drop"
              orientation="left"
              dataKey={(row: BallisticSimDataPoint) => (row.Drop * 100)}
              unit={"cm"}
              allowDataOverflow={opened ? true : false}
              domain={opened ? [yDomainMin, yDomainMax] : [0, 'auto']}
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
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </>
  )
}