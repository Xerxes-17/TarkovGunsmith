import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Legend, Tooltip, ComposedChart, Line, ReferenceLine } from "recharts";
import { Box, Input } from "@mantine/core";

interface DropChartExample {
  distance: number,
  dropBCP: number,
  dropM993: number,
  dropM62: number,
}

export function FAQ_DropChart() {
  const dropBCPData = [
    {
      "distance": 0,
      "dropBCP": -0.038060606
    },
    {
      "distance": 10,
      "dropBCP": -0.004537247
    },
    {
      "distance": 20,
      "dropBCP": 0.027859211
    },
    {
      "distance": 30,
      "dropBCP": 0.059111163
    },
    {
      "distance": 40,
      "dropBCP": 0.08920094
    },
    {
      "distance": 50,
      "dropBCP": 0.11811072
    },
    {
      "distance": 60,
      "dropBCP": 0.14582257
    },
    {
      "distance": 70,
      "dropBCP": 0.1723185
    },
    {
      "distance": 80,
      "dropBCP": 0.19758041
    },
    {
      "distance": 90,
      "dropBCP": 0.22159007
    },
    {
      "distance": 100,
      "dropBCP": 0.24424809
    },
    {
      "distance": 110,
      "dropBCP": 0.26553825
    },
    {
      "distance": 120,
      "dropBCP": 0.28551072
    },
    {
      "distance": 130,
      "dropBCP": 0.30414683
    },
    {
      "distance": 140,
      "dropBCP": 0.32142758
    },
    {
      "distance": 150,
      "dropBCP": 0.337334
    },
    {
      "distance": 160,
      "dropBCP": 0.35163504
    },
    {
      "distance": 170,
      "dropBCP": 0.3645129
    },
    {
      "distance": 180,
      "dropBCP": 0.3759481
    },
    {
      "distance": 190,
      "dropBCP": 0.38592097
    },
    {
      "distance": 200,
      "dropBCP": 0.39422423
    },
    {
      "distance": 210,
      "dropBCP": 0.40094516
    },
    {
      "distance": 220,
      "dropBCP": 0.4061327
    },
    {
      "distance": 230,
      "dropBCP": 0.4097233
    },
    {
      "distance": 240,
      "dropBCP": 0.4114795
    },
    {
      "distance": 250,
      "dropBCP": 0.41162944
    },
    {
      "distance": 260,
      "dropBCP": 0.41014487
    },
    {
      "distance": 270,
      "dropBCP": 0.40667874
    },
    {
      "distance": 280,
      "dropBCP": 0.40153128
    },
    {
      "distance": 290,
      "dropBCP": 0.394596
    },
    {
      "distance": 300,
      "dropBCP": 0.3856418
    },
    {
      "distance": 310,
      "dropBCP": 0.37492907
    },
    {
      "distance": 320,
      "dropBCP": 0.36215398
    },
    {
      "distance": 330,
      "dropBCP": 0.3474376
    },
    {
      "distance": 340,
      "dropBCP": 0.33072886
    },
    {
      "distance": 350,
      "dropBCP": 0.31186417
    },
    {
      "distance": 360,
      "dropBCP": 0.2910178
    },
    {
      "distance": 370,
      "dropBCP": 0.2678561
    },
    {
      "distance": 380,
      "dropBCP": 0.24266165
    },
    {
      "distance": 390,
      "dropBCP": 0.21505037
    },
    {
      "distance": 400,
      "dropBCP": 0.18529126
    },
    {
      "distance": 410,
      "dropBCP": 0.15307368
    },
    {
      "distance": 420,
      "dropBCP": 0.11852695
    },
    {
      "distance": 430,
      "dropBCP": 0.081542075
    },
    {
      "distance": 440,
      "dropBCP": 0.041976944
    },
    {
      "distance": 450,
      "dropBCP": 0
    },
    {
      "distance": 460,
      "dropBCP": -0.04476376
    },
    {
      "distance": 470,
      "dropBCP": -0.09213953
    },
    {
      "distance": 480,
      "dropBCP": -0.14215086
    },
    {
      "distance": 490,
      "dropBCP": -0.1951434
    },
    {
      "distance": 500,
      "dropBCP": -0.25095946
    },
    {
      "distance": 510,
      "dropBCP": -0.30965218
    },
    {
      "distance": 520,
      "dropBCP": -0.37135398
    },
    {
      "distance": 530,
      "dropBCP": -0.4362907
    },
    {
      "distance": 540,
      "dropBCP": -0.50436926
    },
    {
      "distance": 550,
      "dropBCP": -0.57569045
    },
    {
      "distance": 560,
      "dropBCP": -0.6503611
    },
    {
      "distance": 570,
      "dropBCP": -0.72849166
    },
    {
      "distance": 580,
      "dropBCP": -0.81019235
    },
    {
      "distance": 590,
      "dropBCP": -0.8955784
    },
    {
      "distance": 600,
      "dropBCP": -0.98477846
    }
  ]

  const dropM993Data = [
    {
      "dropM993": -0.038060606
    },
    {
      "dropM993": -0.0044335164
    },
    {
      "dropM993": 0.02823025
    },
    {
      "dropM993": 0.05990769
    },
    {
      "dropM993": 0.0905648
    },
    {
      "dropM993": 0.120167464
    },
    {
      "dropM993": 0.1487014
    },
    {
      "dropM993": 0.17614266
    },
    {
      "dropM993": 0.20246717
    },
    {
      "dropM993": 0.22765067
    },
    {
      "dropM993": 0.25166866
    },
    {
      "dropM993": 0.27449638
    },
    {
      "dropM993": 0.29610884
    },
    {
      "dropM993": 0.31648102
    },
    {
      "dropM993": 0.33558756
    },
    {
      "dropM993": 0.35332507
    },
    {
      "dropM993": 0.3696472
    },
    {
      "dropM993": 0.38461238
    },
    {
      "dropM993": 0.39819425
    },
    {
      "dropM993": 0.41036618
    },
    {
      "dropM993": 0.42097986
    },
    {
      "dropM993": 0.4300001
    },
    {
      "dropM993": 0.43751368
    },
    {
      "dropM993": 0.44349265
    },
    {
      "dropM993": 0.44767076
    },
    {
      "dropM993": 0.45017985
    },
    {
      "dropM993": 0.4510528
    },
    {
      "dropM993": 0.450005
    },
    {
      "dropM993": 0.44714925
    },
    {
      "dropM993": 0.44252336
    },
    {
      "dropM993": 0.4357472
    },
    {
      "dropM993": 0.42715043
    },
    {
      "dropM993": 0.41637903
    },
    {
      "dropM993": 0.4035819
    },
    {
      "dropM993": 0.38855812
    },
    {
      "dropM993": 0.3713518
    },
    {
      "dropM993": 0.35177845
    },
    {
      "dropM993": 0.32994673
    },
    {
      "dropM993": 0.30551392
    },
    {
      "dropM993": 0.27872282
    },
    {
      "dropM993": 0.24921522
    },
    {
      "dropM993": 0.21704406
    },
    {
      "dropM993": 0.18220317
    },
    {
      "dropM993": 0.1443942
    },
    {
      "dropM993": 0.103600174
    },
    {
      "dropM993": 0.05979023
    },
    {
      "dropM993": 0.012826372
    },
    {
      "dropM993": -0.03743505
    },
    {
      "dropM993": -0.09123854
    },
    {
      "dropM993": -0.14862372
    },
    {
      "dropM993": -0.20973252
    },
    {
      "dropM993": -0.27472776
    },
    {
      "dropM993": -0.34377646
    },
    {
      "dropM993": -0.41704893
    },
    {
      "dropM993": -0.49481496
    },
    {
      "dropM993": -0.5772368
    },
    {
      "dropM993": -0.66444737
    },
    {
      "dropM993": -0.75662
    },
    {
      "dropM993": -0.854062
    },
    {
      "dropM993": -0.95703495
    },
    {
      "dropM993": -1.0655105
    }
  ]

  const dropM62Data = [
    {
      "dropM62": -0.038060606
    },
    {
      "dropM62": -0.0045851655
    },
    {
      "dropM62": 0.027694985
    },
    {
      "dropM62": 0.05875761
    },
    {
      "dropM62": 0.088580266
    },
    {
      "dropM62": 0.11714038
    },
    {
      "dropM62": 0.14441521
    },
    {
      "dropM62": 0.1703818
    },
    {
      "dropM62": 0.19489329
    },
    {
      "dropM62": 0.21797943
    },
    {
      "dropM62": 0.2396748
    },
    {
      "dropM62": 0.2599556
    },
    {
      "dropM62": 0.27879778
    },
    {
      "dropM62": 0.2959304
    },
    {
      "dropM62": 0.31156012
    },
    {
      "dropM62": 0.32566413
    },
    {
      "dropM62": 0.33812305
    },
    {
      "dropM62": 0.34879383
    },
    {
      "dropM62": 0.3578488
    },
    {
      "dropM62": 0.36518615
    },
    {
      "dropM62": 0.3705788
    },
    {
      "dropM62": 0.37426218
    },
    {
      "dropM62": 0.37601018
    },
    {
      "dropM62": 0.3757933
    },
    {
      "dropM62": 0.3737337
    },
    {
      "dropM62": 0.36944094
    },
    {
      "dropM62": 0.36327025
    },
    {
      "dropM62": 0.35477582
    },
    {
      "dropM62": 0.3442731
    },
    {
      "dropM62": 0.33135238
    },
    {
      "dropM62": 0.31632733
    },
    {
      "dropM62": 0.29870862
    },
    {
      "dropM62": 0.27884167
    },
    {
      "dropM62": 0.25636414
    },
    {
      "dropM62": 0.23134741
    },
    {
      "dropM62": 0.2038164
    },
    {
      "dropM62": 0.17334978
    },
    {
      "dropM62": 0.14018533
    },
    {
      "dropM62": 0.1042178
    },
    {
      "dropM62": 0.06518342
    },
    {
      "dropM62": 0.023050565
    },
    {
      "dropM62": -0.022205373
    },
    {
      "dropM62": -0.07071006
    },
    {
      "dropM62": -0.12259533
    },
    {
      "dropM62": -0.17799741
    },
    {
      "dropM62": -0.23706453
    },
    {
      "dropM62": -0.29994464
    },
    {
      "dropM62": -0.36673266
    },
    {
      "dropM62": -0.4376141
    },
    {
      "dropM62": -0.5127595
    },
    {
      "dropM62": -0.5923065
    },
    {
      "dropM62": -0.67640984
    },
    {
      "dropM62": -0.7652258
    },
    {
      "dropM62": -0.85890883
    },
    {
      "dropM62": -0.9578208
    },
    {
      "dropM62": -1.0620327
    },
    {
      "dropM62": -1.1716022
    },
    {
      "dropM62": -1.2870216
    },
    {
      "dropM62": -1.4081821
    },
    {
      "dropM62": -1.535455
    },
    {
      "dropM62": -1.6688814
    }
  ]

  const chartData: DropChartExample[] = dropBCPData.map((data, index) => {
    return {
      ...data,
      dropM993: dropM993Data[index]?.dropM993,
      dropM62: dropM62Data[index]?.dropM62
    };
  });

  const calibrationNumber = 450
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
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#ffffff" dy={20} dx={-2}>
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
        <text x={props.viewBox.x} y={props.viewBox.y} fill="#ffffff" dy={20} dx={130}>
          Line of Sight
        </text>
      </g>
    );
  };

  return (
    <Box maw={560} miw={250} w={365} h={250} mih={210}>
      <ResponsiveContainer minHeight={210} >
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
            dataKey={(row: DropChartExample) => (row.distance)}
            interval={intInterval}
            unit={"m"}
          />
          <YAxis
            yAxisId="drop"
            orientation="left"
            dataKey={(row: DropChartExample) => (row.dropM62 * 100)}
            unit={"cm"}
          />

          <Line
            name="BCP(d)"
            yAxisId="drop"
            type="linear"
            dataKey={(row: DropChartExample) => (row.dropBCP * 100).toFixed(2)}
            stroke="#1864ab"
            strokeWidth={2}
            unit={"cm"}
          />
          <Line
            name="M62"
            yAxisId="drop"
            type="linear"
            dataKey={(row: DropChartExample) => (row.dropM62 * 100).toFixed(2)}
            stroke="#2F9E44"
            strokeWidth={2}
            unit={"cm"}
          />
          <Line
            name="M993"
            yAxisId="drop"
            type="linear"
            dataKey={(row: DropChartExample) => (row.dropM993 * 100).toFixed(2)}
            stroke="#B197FC"
            strokeWidth={2}
            unit={"cm"}
          />

          <ReferenceLine yAxisId="drop" y={0} label={lineOfSightCustomLabel} stroke="red"/>
          <ReferenceLine yAxisId="drop" x={calibrationNumber} label={calibrationCustomLabel} stroke="red" />

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
      <Input.Description pb={4}>7.62x51mm with 1.122 Velocity Modifier</Input.Description>
    </Box>

  )
}