import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ComposedChart, Line, ReferenceLine } from "recharts";
import { BallisticSimDataPoint } from "../../../../Pages/BallisticCalculator/types";
import { Box, Input } from "@mantine/core";

interface DropChartExampleShotty {
  distance: number,
  drop7mmBS: number,
  dropAP20: number,
  dropSlug: number,
}

export function FAQ_DropChartShotties() {
  const drop7mmBSData = [
    {
        "distance": 0,
        "drop7mmBS": -0.037812866
    },
    {
        "distance": 10,
        "drop7mmBS": 0.065900505
    },
    {
        "distance": 20,
        "drop7mmBS": 0.1600089
    },
    {
        "distance": 30,
        "drop7mmBS": 0.24051017
    },
    {
        "distance": 40,
        "drop7mmBS": 0.30356836
    },
    {
        "distance": 50,
        "drop7mmBS": 0.3451402
    },
    {
        "distance": 60,
        "drop7mmBS": 0.3599928
    },
    {
        "distance": 70,
        "drop7mmBS": 0.34183446
    },
    {
        "distance": 80,
        "drop7mmBS": 0.28274208
    },
    {
        "distance": 90,
        "drop7mmBS": 0.17302212
    },
    {
        "distance": 100,
        "drop7mmBS": 0
    },
    {
        "distance": 110,
        "drop7mmBS": -0.25207198
    },
    {
        "distance": 120,
        "drop7mmBS": -0.6037866
    },
    {
        "distance": 130,
        "drop7mmBS": -1.081099
    },
    {
        "distance": 140,
        "drop7mmBS": -1.7175387
    },
    {
        "distance": 150,
        "drop7mmBS": -2.5563223
    },
    {
        "distance": 160,
        "drop7mmBS": -3.6526742
    },
    {
        "distance": 170,
        "drop7mmBS": -5.0775714
    },
    {
        "distance": 180,
        "drop7mmBS": -6.922261
    },
    {
        "distance": 190,
        "drop7mmBS": -9.302395
    },
    {
        "distance": 200,
        "drop7mmBS": -12.363655
    }
]

  const dropAP20Data = [
    {
        "dropAP20": -0.037812866
    },
    {
        "dropAP20": 0.06782433
    },
    {
        "dropAP20": 0.1707725
    },
    {
        "dropAP20": 0.27094093
    },
    {
        "dropAP20": 0.36806127
    },
    {
        "dropAP20": 0.46215197
    },
    {
        "dropAP20": 0.55319685
    },
    {
        "dropAP20": 0.6410917
    },
    {
        "dropAP20": 0.7257298
    },
    {
        "dropAP20": 0.8068864
    },
    {
        "dropAP20": 0.8845678
    },
    {
        "dropAP20": 0.95867485
    },
    {
        "dropAP20": 1.0290885
    },
    {
        "dropAP20": 1.0956882
    },
    {
        "dropAP20": 1.1583505
    },
    {
        "dropAP20": 1.2169492
    },
    {
        "dropAP20": 1.2713554
    },
    {
        "dropAP20": 1.3214393
    },
    {
        "dropAP20": 1.3670089
    },
    {
        "dropAP20": 1.4078691
    },
    {
        "dropAP20": 1.4439764
    }
]

  const dropSlugData = [
    {
        "dropSlug": -0.037812866
    },
    {
        "dropSlug": 0.06650506
    },
    {
        "dropSlug": 0.16524711
    },
    {
        "dropSlug": 0.2576903
    },
    {
        "dropSlug": 0.34357068
    },
    {
        "dropSlug": 0.4220985
    },
    {
        "dropSlug": 0.49308679
    },
    {
        "dropSlug": 0.5560973
    },
    {
        "dropSlug": 0.6107032
    },
    {
        "dropSlug": 0.656509
    },
    {
        "dropSlug": 0.6931379
    },
    {
        "dropSlug": 0.7202333
    },
    {
        "dropSlug": 0.7374555
    },
    {
        "dropSlug": 0.74435306
    },
    {
        "dropSlug": 0.7405397
    },
    {
        "dropSlug": 0.72584677
    },
    {
        "dropSlug": 0.69974524
    },
    {
        "dropSlug": 0.66193455
    },
    {
        "dropSlug": 0.61208516
    },
    {
        "dropSlug": 0.5498198
    },
    {
        "dropSlug": 0.4747053
    }
]

  const chartData: DropChartExampleShotty[] = drop7mmBSData.map((data, index) => {
    return {
      ...data,
      dropAP20: dropAP20Data[index]?.dropAP20,
      dropSlug: dropSlugData[index]?.dropSlug
    };
  });

  const calibrationNumber = 100
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
    viewBox: { x: string | number | undefined; y: string | number | undefined; };
  }) => {
    return (
      <g>
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#ffffff" dy={-10} dx={160}>
          Line of Sight
        </text>
      </g>
    );
  };

  return (
    <Box w={550} h={200}>
      <ResponsiveContainer minHeight={200} >
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
            dataKey={(row: DropChartExampleShotty) => (row.distance)}
            interval={intInterval}
            unit={"m"}
          />
          <YAxis
            yAxisId="drop"
            orientation="left"
            dataKey={(row: DropChartExampleShotty) => (row.dropAP20 * 100)}
            unit={"cm"}
          />
          <Line
            name="7mmBS(defAmmo)"
            yAxisId="drop"
            type="linear"
            dataKey={(row: DropChartExampleShotty) => (row.drop7mmBS * 100).toFixed(2)}
            stroke="#1864ab"
            strokeWidth={2}
            unit={"cm"}
          />
          <Line
            name="Slug"
            yAxisId="drop"
            type="linear"
            dataKey={(row: DropChartExampleShotty) => (row.dropSlug * 100).toFixed(2)}
            stroke="#2F9E44"
            strokeWidth={2}
            unit={"cm"}
          />
          <Line
            name="AP20"
            yAxisId="drop"
            type="linear"
            dataKey={(row: DropChartExampleShotty) => (row.dropAP20 * 100).toFixed(2)}
            stroke="#B197FC"
            strokeWidth={2}
            unit={"cm"}
          />

          <ReferenceLine yAxisId="drop" y={0} label={lineOfSightCustomLabel} stroke="red" position="start" />
          <ReferenceLine yAxisId="drop" x={calibrationNumber} label={calibrationCustomLabel} stroke="red" position="end" />

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
      <Input.Description pb={4}>Why shotgun sniping is fucked. (MP153 750mm barrel)</Input.Description>
    </Box>

  )
}