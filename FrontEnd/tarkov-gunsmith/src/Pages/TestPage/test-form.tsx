import { Button, Divider, Grid, Group, NumberInput, Select, Stack } from "@mantine/core"
import { TestFormContextProvider, TestFormValues, testFormYupValidator, useTestForm } from "./test-form-context"
import { useEffect, useRef } from "react";


export function TestForm({ setResult }: { setResult: React.Dispatch<React.SetStateAction<TestFormValues | undefined>> }) {


    const testData = [
        {
            "Distance": 0,
            "Penetration": 43,
            "Damage": 80,
            "Speed": 966.2978,
            "Drop": -0.06853762,
            "TimeOfFlight": 0,
            "MilliradiansOfDrop": 0,
            "MaxDispersion": 0
        },
        {
            "Distance": 10,
            "Penetration": 42.580677,
            "Damage": 79.219864,
            "Speed": 947.4518,
            "Drop": -0.03379579,
            "TimeOfFlight": 0.020100001,
            "MilliradiansOfDrop": -3.379579,
            "MaxDispersion": 0.1957
        },
        {
            "Distance": 20,
            "Penetration": 42.37629,
            "Damage": 78.83961,
            "Speed": 938.26575,
            "Drop": -0.00013452768,
            "TimeOfFlight": 0.03015,
            "MilliradiansOfDrop": -0.006726384,
            "MaxDispersion": 0.3914
        },
        {
            "Distance": 25,
            "Penetration": 42.37629,
            "Damage": 78.83961,
            "Speed": 938.26575,
            "Drop": 0.016220808,
            "TimeOfFlight": 0.03015,
            "MilliradiansOfDrop": 0.64883232,
            "MaxDispersion": 0.48925
        },
        {
            "Distance": 30,
            "Penetration": 42.17582,
            "Damage": 78.466644,
            "Speed": 929.25586,
            "Drop": 0.032425396,
            "TimeOfFlight": 0.040200002,
            "MilliradiansOfDrop": 1.0808465333333335,
            "MaxDispersion": 0.5871000000000001
        },
        {
            "Distance": 40,
            "Penetration": 41.978115,
            "Damage": 78.098816,
            "Speed": 920.37006,
            "Drop": 0.06386301,
            "TimeOfFlight": 0.05025,
            "MilliradiansOfDrop": 1.59657525,
            "MaxDispersion": 0.7828
        },
        {
            "Distance": 50,
            "Penetration": 41.783787,
            "Damage": 77.73728,
            "Speed": 911.6362,
            "Drop": 0.09415722,
            "TimeOfFlight": 0.0603,
            "MilliradiansOfDrop": 1.8831444000000002,
            "MaxDispersion": 0.9785
        },
        {
            "Distance": 60,
            "Penetration": 41.592094,
            "Damage": 77.380646,
            "Speed": 903.0208,
            "Drop": 0.123286724,
            "TimeOfFlight": 0.07035,
            "MilliradiansOfDrop": 2.0547787333333334,
            "MaxDispersion": 1.1742000000000001
        },
        {
            "Distance": 70,
            "Penetration": 41.40395,
            "Damage": 77.0306,
            "Speed": 894.56476,
            "Drop": 0.1512301,
            "TimeOfFlight": 0.0804,
            "MilliradiansOfDrop": 2.1604300000000003,
            "MaxDispersion": 1.3699000000000001
        },
        {
            "Distance": 75,
            "Penetration": 41.21829,
            "Damage": 76.68519,
            "Speed": 886.2205,
            "Drop": 0.16483879,
            "TimeOfFlight": 0.09045,
            "MilliradiansOfDrop": 2.1978505333333334,
            "MaxDispersion": 1.46775
        },
        {
            "Distance": 80,
            "Penetration": 41.21829,
            "Damage": 76.68519,
            "Speed": 886.2205,
            "Drop": 0.17796575,
            "TimeOfFlight": 0.09045,
            "MilliradiansOfDrop": 2.224571875,
            "MaxDispersion": 1.5656
        },
        {
            "Distance": 90,
            "Penetration": 41.036003,
            "Damage": 76.346054,
            "Speed": 878.0278,
            "Drop": 0.2034719,
            "TimeOfFlight": 0.100499995,
            "MilliradiansOfDrop": 2.260798888888889,
            "MaxDispersion": 1.7613
        },
        {
            "Distance": 100,
            "Penetration": 40.85607,
            "Damage": 76.01129,
            "Speed": 869.94086,
            "Drop": 0.22772673,
            "TimeOfFlight": 0.110549994,
            "MilliradiansOfDrop": 2.2772672999999997,
            "MaxDispersion": 1.957
        },
        {
            "Distance": 110,
            "Penetration": 40.5043,
            "Damage": 75.356834,
            "Speed": 854.13074,
            "Drop": 0.25065064,
            "TimeOfFlight": 0.13064998,
            "MilliradiansOfDrop": 2.278642181818182,
            "MaxDispersion": 2.1527000000000003
        },
        {
            "Distance": 120,
            "Penetration": 40.332916,
            "Damage": 75.03799,
            "Speed": 846.42816,
            "Drop": 0.2721721,
            "TimeOfFlight": 0.1407,
            "MilliradiansOfDrop": 2.268100833333333,
            "MaxDispersion": 2.3484000000000003
        },
        {
            "Distance": 125,
            "Penetration": 40.332916,
            "Damage": 75.03799,
            "Speed": 846.42816,
            "Drop": 0.28246683,
            "TimeOfFlight": 0.1407,
            "MilliradiansOfDrop": 2.25973464,
            "MaxDispersion": 2.44625
        },
        {
            "Distance": 130,
            "Penetration": 40.16365,
            "Damage": 74.72307,
            "Speed": 838.82074,
            "Drop": 0.29236346,
            "TimeOfFlight": 0.15075,
            "MilliradiansOfDrop": 2.2489496923076926,
            "MaxDispersion": 2.5441000000000003
        },
        {
            "Distance": 140,
            "Penetration": 39.997047,
            "Damage": 74.41311,
            "Speed": 831.3327,
            "Drop": 0.31120217,
            "TimeOfFlight": 0.1608,
            "MilliradiansOfDrop": 2.222872642857143,
            "MaxDispersion": 2.7398000000000002
        },
        {
            "Distance": 150,
            "Penetration": 39.83247,
            "Damage": 74.10692,
            "Speed": 823.9361,
            "Drop": 0.32866535,
            "TimeOfFlight": 0.17085,
            "MilliradiansOfDrop": 2.1911023333333333,
            "MaxDispersion": 2.9355
        },
        {
            "Distance": 160,
            "Penetration": 39.509354,
            "Damage": 73.505775,
            "Speed": 809.4139,
            "Drop": 0.34471032,
            "TimeOfFlight": 0.19094999,
            "MilliradiansOfDrop": 2.1544395,
            "MaxDispersion": 3.1312
        },
        {
            "Distance": 170,
            "Penetration": 39.35077,
            "Damage": 73.21074,
            "Speed": 802.28656,
            "Drop": 0.35912547,
            "TimeOfFlight": 0.20099999,
            "MilliradiansOfDrop": 2.1125027647058827,
            "MaxDispersion": 3.3269
        },
        {
            "Distance": 180,
            "Penetration": 39.19415,
            "Damage": 72.91935,
            "Speed": 795.2473,
            "Drop": 0.37208262,
            "TimeOfFlight": 0.21104999,
            "MilliradiansOfDrop": 2.0671256666666666,
            "MaxDispersion": 3.5226
        },
        {
            "Distance": 190,
            "Penetration": 39.039463,
            "Damage": 72.63156,
            "Speed": 788.29517,
            "Drop": 0.38355803,
            "TimeOfFlight": 0.22109999,
            "MilliradiansOfDrop": 2.0187264736842105,
            "MaxDispersion": 3.7183
        },
        {
            "Distance": 200,
            "Penetration": 38.735836,
            "Damage": 72.066666,
            "Speed": 774.6488,
            "Drop": 0.3934998,
            "TimeOfFlight": 0.24119999,
            "MilliradiansOfDrop": 1.967499,
            "MaxDispersion": 3.914
        },
        {
            "Distance": 210,
            "Penetration": 38.58685,
            "Damage": 71.78948,
            "Speed": 767.9527,
            "Drop": 0.40165684,
            "TimeOfFlight": 0.25125,
            "MilliradiansOfDrop": 1.912651619047619,
            "MaxDispersion": 4.1097
        },
        {
            "Distance": 220,
            "Penetration": 38.439945,
            "Damage": 71.51618,
            "Speed": 761.3504,
            "Drop": 0.40824583,
            "TimeOfFlight": 0.2613,
            "MilliradiansOfDrop": 1.8556628636363635,
            "MaxDispersion": 4.305400000000001
        },
        {
            "Distance": 230,
            "Penetration": 38.294865,
            "Damage": 71.24626,
            "Speed": 754.8299,
            "Drop": 0.4132421,
            "TimeOfFlight": 0.27135,
            "MilliradiansOfDrop": 1.7967047826086957,
            "MaxDispersion": 4.5011
        },
        {
            "Distance": 240,
            "Penetration": 38.009438,
            "Damage": 70.71523,
            "Speed": 742.0015,
            "Drop": 0.4163595,
            "TimeOfFlight": 0.29145,
            "MilliradiansOfDrop": 1.73483125,
            "MaxDispersion": 4.6968000000000005
        },
        {
            "Distance": 250,
            "Penetration": 37.869095,
            "Damage": 70.45413,
            "Speed": 735.6939,
            "Drop": 0.41775465,
            "TimeOfFlight": 0.3015,
            "MilliradiansOfDrop": 1.6710185999999998,
            "MaxDispersion": 4.8925
        },
        {
            "Distance": 260,
            "Penetration": 37.73032,
            "Damage": 70.19594,
            "Speed": 729.4568,
            "Drop": 0.41746715,
            "TimeOfFlight": 0.31155,
            "MilliradiansOfDrop": 1.6056428846153847,
            "MaxDispersion": 5.0882000000000005
        },
        {
            "Distance": 270,
            "Penetration": 37.458065,
            "Damage": 69.68942,
            "Speed": 717.2207,
            "Drop": 0.41512337,
            "TimeOfFlight": 0.33165,
            "MilliradiansOfDrop": 1.5374939629629631,
            "MaxDispersion": 5.2839
        },
        {
            "Distance": 280,
            "Penetration": 37.323536,
            "Damage": 69.43913,
            "Speed": 711.1743,
            "Drop": 0.41100568,
            "TimeOfFlight": 0.3417,
            "MilliradiansOfDrop": 1.4678774285714284,
            "MaxDispersion": 5.4796000000000005
        },
        {
            "Distance": 290,
            "Penetration": 37.059772,
            "Damage": 68.94841,
            "Speed": 699.3196,
            "Drop": 0.40495482,
            "TimeOfFlight": 0.3618,
            "MilliradiansOfDrop": 1.396395931034483,
            "MaxDispersion": 5.6753
        },
        {
            "Distance": 300,
            "Penetration": 36.929146,
            "Damage": 68.70538,
            "Speed": 693.4488,
            "Drop": 0.3968382,
            "TimeOfFlight": 0.37184998,
            "MilliradiansOfDrop": 1.3227939999999998,
            "MaxDispersion": 5.871
        },
        {
            "Distance": 310,
            "Penetration": 36.673233,
            "Damage": 68.22927,
            "Speed": 681.947,
            "Drop": 0.38684294,
            "TimeOfFlight": 0.39194998,
            "MilliradiansOfDrop": 1.2478804516129032,
            "MaxDispersion": 6.0667
        },
        {
            "Distance": 320,
            "Penetration": 36.546253,
            "Damage": 67.99303,
            "Speed": 676.24005,
            "Drop": 0.3745534,
            "TimeOfFlight": 0.40199998,
            "MilliradiansOfDrop": 1.170479375,
            "MaxDispersion": 6.2624
        },
        {
            "Distance": 330,
            "Penetration": 36.421085,
            "Damage": 67.760155,
            "Speed": 670.6145,
            "Drop": 0.36034763,
            "TimeOfFlight": 0.41204998,
            "MilliradiansOfDrop": 1.091962515151515,
            "MaxDispersion": 6.4581
        },
        {
            "Distance": 340,
            "Penetration": 36.17415,
            "Damage": 67.300735,
            "Speed": 659.5162,
            "Drop": 0.34372577,
            "TimeOfFlight": 0.43214998,
            "MilliradiansOfDrop": 1.0109581470588236,
            "MaxDispersion": 6.6538
        },
        {
            "Distance": 350,
            "Penetration": 36.052444,
            "Damage": 67.07432,
            "Speed": 654.04626,
            "Drop": 0.3250941,
            "TimeOfFlight": 0.44219998,
            "MilliradiansOfDrop": 0.9288402857142858,
            "MaxDispersion": 6.8495
        },
        {
            "Distance": 360,
            "Penetration": 35.811768,
            "Damage": 66.62654,
            "Speed": 643.22925,
            "Drop": 0.30391523,
            "TimeOfFlight": 0.46229997,
            "MilliradiansOfDrop": 0.8442089722222222,
            "MaxDispersion": 7.0452
        },
        {
            "Distance": 370,
            "Penetration": 35.575893,
            "Damage": 66.187706,
            "Speed": 632.6281,
            "Drop": 0.280575,
            "TimeOfFlight": 0.48239997,
            "MilliradiansOfDrop": 0.7583108108108109,
            "MaxDispersion": 7.2409
        },
        {
            "Distance": 380,
            "Penetration": 35.457226,
            "Damage": 65.966934,
            "Speed": 627.2948,
            "Drop": 0.25466543,
            "TimeOfFlight": 0.49244997,
            "MilliradiansOfDrop": 0.6701721842105264,
            "MaxDispersion": 7.4366
        },
        {
            "Distance": 390,
            "Penetration": 35.225887,
            "Damage": 65.53654,
            "Speed": 616.89746,
            "Drop": 0.22634017,
            "TimeOfFlight": 0.51255,
            "MilliradiansOfDrop": 0.5803594102564102,
            "MaxDispersion": 7.6323
        },
        {
            "Distance": 400,
            "Penetration": 35.108856,
            "Damage": 65.3188,
            "Speed": 611.63763,
            "Drop": 0.19550124,
            "TimeOfFlight": 0.5226,
            "MilliradiansOfDrop": 0.4887531,
            "MaxDispersion": 7.828
        },
        {
            "Distance": 410,
            "Penetration": 34.881187,
            "Damage": 64.89523,
            "Speed": 601.40515,
            "Drop": 0.16190252,
            "TimeOfFlight": 0.5427,
            "MilliradiansOfDrop": 0.3948841951219512,
            "MaxDispersion": 8.0237
        },
        {
            "Distance": 420,
            "Penetration": 34.656216,
            "Damage": 64.476685,
            "Speed": 591.29407,
            "Drop": 0.12571791,
            "TimeOfFlight": 0.5628,
            "MilliradiansOfDrop": 0.2993283571428571,
            "MaxDispersion": 8.2194
        },
        {
            "Distance": 430,
            "Penetration": 34.544296,
            "Damage": 64.268456,
            "Speed": 586.26385,
            "Drop": 0.086752385,
            "TimeOfFlight": 0.57285,
            "MilliradiansOfDrop": 0.20174973255813955,
            "MaxDispersion": 8.4151
        },
        {
            "Distance": 440,
            "Penetration": 34.319798,
            "Damage": 63.850784,
            "Speed": 576.1741,
            "Drop": 0.044812858,
            "TimeOfFlight": 0.59295,
            "MilliradiansOfDrop": 0.10184740454545453,
            "MaxDispersion": 8.610800000000001
        },
        {
            "Distance": 450,
            "Penetration": 34.097878,
            "Damage": 63.437912,
            "Speed": 566.2,
            "Drop": 0,
            "TimeOfFlight": 0.61305,
            "MilliradiansOfDrop": 0,
            "MaxDispersion": 8.8065
        },
        {
            "Distance": 460,
            "Penetration": 33.87612,
            "Damage": 63.02534,
            "Speed": 556.2334,
            "Drop": -0.047797598,
            "TimeOfFlight": 0.63315,
            "MilliradiansOfDrop": -0.10390782173913043,
            "MaxDispersion": 9.0022
        },
        {
            "Distance": 470,
            "Penetration": 33.764606,
            "Damage": 62.81787,
            "Speed": 551.2214,
            "Drop": -0.098762356,
            "TimeOfFlight": 0.6432,
            "MilliradiansOfDrop": -0.2101326723404255,
            "MaxDispersion": 9.1979
        },
        {
            "Distance": 480,
            "Penetration": 33.54114,
            "Damage": 62.402122,
            "Speed": 541.17816,
            "Drop": -0.15305063,
            "TimeOfFlight": 0.6633,
            "MilliradiansOfDrop": -0.3188554791666666,
            "MaxDispersion": 9.393600000000001
        },
        {
            "Distance": 490,
            "Penetration": 33.32122,
            "Damage": 61.99297,
            "Speed": 531.29395,
            "Drop": -0.21065663,
            "TimeOfFlight": 0.6834,
            "MilliradiansOfDrop": -0.42991148979591837,
            "MaxDispersion": 9.5893
        },
        {
            "Distance": 500,
            "Penetration": 33.099995,
            "Damage": 61.581387,
            "Speed": 521.3512,
            "Drop": -0.27171147,
            "TimeOfFlight": 0.7035,
            "MilliradiansOfDrop": -0.54342294,
            "MaxDispersion": 9.785
        },
        {
            "Distance": 510,
            "Penetration": 32.89155,
            "Damage": 61.19358,
            "Speed": 511.98276,
            "Drop": -0.3363509,
            "TimeOfFlight": 0.7236,
            "MilliradiansOfDrop": -0.659511568627451,
            "MaxDispersion": 9.9807
        },
        {
            "Distance": 520,
            "Penetration": 32.68203,
            "Damage": 60.803776,
            "Speed": 502.566,
            "Drop": -0.40471157,
            "TimeOfFlight": 0.74369997,
            "MilliradiansOfDrop": -0.7782914807692308,
            "MaxDispersion": 10.176400000000001
        },
        {
            "Distance": 530,
            "Penetration": 32.485027,
            "Damage": 60.43726,
            "Speed": 493.71198,
            "Drop": -0.47693393,
            "TimeOfFlight": 0.76379997,
            "MilliradiansOfDrop": -0.8998753396226415,
            "MaxDispersion": 10.3721
        },
        {
            "Distance": 540,
            "Penetration": 32.286,
            "Damage": 60.06698,
            "Speed": 484.7668,
            "Drop": -0.5531596,
            "TimeOfFlight": 0.78389996,
            "MilliradiansOfDrop": -1.0243696296296296,
            "MaxDispersion": 10.5678
        },
        {
            "Distance": 550,
            "Penetration": 32.099358,
            "Damage": 59.719734,
            "Speed": 476.37845,
            "Drop": -0.6335354,
            "TimeOfFlight": 0.80399996,
            "MilliradiansOfDrop": -1.1518825454545454,
            "MaxDispersion": 10.7635
        },
        {
            "Distance": 560,
            "Penetration": 31.913115,
            "Damage": 59.373238,
            "Speed": 468.00784,
            "Drop": -0.7182082,
            "TimeOfFlight": 0.82409996,
            "MilliradiansOfDrop": -1.2825146428571428,
            "MaxDispersion": 10.959200000000001
        },
        {
            "Distance": 570,
            "Penetration": 31.738684,
            "Damage": 59.048714,
            "Speed": 460.16827,
            "Drop": -0.8073273,
            "TimeOfFlight": 0.84419996,
            "MilliradiansOfDrop": -1.4163636842105263,
            "MaxDispersion": 11.1549
        },
        {
            "Distance": 580,
            "Penetration": 31.565725,
            "Damage": 58.72693,
            "Speed": 452.39474,
            "Drop": -0.9010426,
            "TimeOfFlight": 0.86429995,
            "MilliradiansOfDrop": -1.5535217241379309,
            "MaxDispersion": 11.3506
        },
        {
            "Distance": 590,
            "Penetration": 31.323933,
            "Damage": 58.277084,
            "Speed": 441.52765,
            "Drop": -0.9996792,
            "TimeOfFlight": 0.89444995,
            "MilliradiansOfDrop": -1.6943715254237286,
            "MaxDispersion": 11.5463
        },
        {
            "Distance": 600,
            "Penetration": 31.17176,
            "Damage": 57.993973,
            "Speed": 434.68845,
            "Drop": -1.1033049,
            "TimeOfFlight": 0.91454995,
            "MilliradiansOfDrop": -1.8388415,
            "MaxDispersion": 11.742
        },
        {
            "Distance": 610,
            "Penetration": 31.028893,
            "Damage": 57.728172,
            "Speed": 428.26733,
            "Drop": -1.2120161,
            "TimeOfFlight": 0.93464994,
            "MilliradiansOfDrop": -1.9869116393442623,
            "MaxDispersion": 11.9377
        },
        {
            "Distance": 620,
            "Penetration": 30.828377,
            "Damage": 57.355118,
            "Speed": 419.25525,
            "Drop": -1.3260659,
            "TimeOfFlight": 0.96479994,
            "MilliradiansOfDrop": -2.138815967741935,
            "MaxDispersion": 12.1334
        },
        {
            "Distance": 630,
            "Penetration": 30.704157,
            "Damage": 57.124016,
            "Speed": 413.6725,
            "Drop": -1.4457641,
            "TimeOfFlight": 0.98489994,
            "MilliradiansOfDrop": -2.294863650793651,
            "MaxDispersion": 12.3291
        },
        {
            "Distance": 640,
            "Penetration": 30.587776,
            "Damage": 56.907494,
            "Speed": 408.44177,
            "Drop": -1.571009,
            "TimeOfFlight": 1.0049999,
            "MilliradiansOfDrop": -2.4547015625000004,
            "MaxDispersion": 12.5248
        },
        {
            "Distance": 650,
            "Penetration": 30.425837,
            "Damage": 56.60621,
            "Speed": 401.16348,
            "Drop": -1.7023216,
            "TimeOfFlight": 1.03515,
            "MilliradiansOfDrop": -2.618956307692308,
            "MaxDispersion": 12.720500000000001
        },
        {
            "Distance": 660,
            "Penetration": 30.324495,
            "Damage": 56.417664,
            "Speed": 396.60895,
            "Drop": -1.839548,
            "TimeOfFlight": 1.0552502,
            "MilliradiansOfDrop": -2.7871939393939393,
            "MaxDispersion": 12.9162
        },
        {
            "Distance": 670,
            "Penetration": 30.183279,
            "Damage": 56.154938,
            "Speed": 390.26202,
            "Drop": -1.9831659,
            "TimeOfFlight": 1.0854003,
            "MilliradiansOfDrop": -2.959949104477612,
            "MaxDispersion": 13.1119
        },
        {
            "Distance": 680,
            "Penetration": 30.054817,
            "Damage": 55.91594,
            "Speed": 384.48828,
            "Drop": -2.1330087,
            "TimeOfFlight": 1.1155505,
            "MilliradiansOfDrop": -3.1367775,
            "MaxDispersion": 13.3076
        },
        {
            "Distance": 690,
            "Penetration": 29.973564,
            "Damage": 55.76477,
            "Speed": 380.83664,
            "Drop": -2.289672,
            "TimeOfFlight": 1.1356506,
            "MilliradiansOfDrop": -3.318365217391304,
            "MaxDispersion": 13.503300000000001
        },
        {
            "Distance": 700,
            "Penetration": 29.857721,
            "Damage": 55.549248,
            "Speed": 375.63022,
            "Drop": -2.4529467,
            "TimeOfFlight": 1.1658008,
            "MilliradiansOfDrop": -3.5042095714285715,
            "MaxDispersion": 13.699
        },
        {
            "Distance": 710,
            "Penetration": 29.78805,
            "Damage": 55.419624,
            "Speed": 372.49878,
            "Drop": -2.6231146,
            "TimeOfFlight": 1.1859009,
            "MilliradiansOfDrop": -3.694527605633803,
            "MaxDispersion": 13.8947
        },
        {
            "Distance": 720,
            "Penetration": 29.687979,
            "Damage": 55.23345,
            "Speed": 368.00125,
            "Drop": -2.8004918,
            "TimeOfFlight": 1.2160511,
            "MilliradiansOfDrop": -3.889571944444445,
            "MaxDispersion": 14.0904
        },
        {
            "Distance": 730,
            "Penetration": 29.592861,
            "Damage": 55.056488,
            "Speed": 363.7262,
            "Drop": -2.9850183,
            "TimeOfFlight": 1.2462013,
            "MilliradiansOfDrop": -4.089066164383563,
            "MaxDispersion": 14.286100000000001
        },
        {
            "Distance": 740,
            "Penetration": 29.502306,
            "Damage": 54.88801,
            "Speed": 359.65634,
            "Drop": -3.1768713,
            "TimeOfFlight": 1.2763515,
            "MilliradiansOfDrop": -4.293069324324325,
            "MaxDispersion": 14.4818
        },
        {
            "Distance": 750,
            "Penetration": 29.44775,
            "Damage": 54.78651,
            "Speed": 357.20438,
            "Drop": -3.376346,
            "TimeOfFlight": 1.2964516,
            "MilliradiansOfDrop": -4.501794666666666,
            "MaxDispersion": 14.6775
        },
        {
            "Distance": 760,
            "Penetration": 29.36869,
            "Damage": 54.639427,
            "Speed": 353.65118,
            "Drop": -3.5835574,
            "TimeOfFlight": 1.3266017,
            "MilliradiansOfDrop": -4.715207105263159,
            "MaxDispersion": 14.8732
        },
        {
            "Distance": 770,
            "Penetration": 29.292774,
            "Damage": 54.498184,
            "Speed": 350.2391,
            "Drop": -3.7985704,
            "TimeOfFlight": 1.3567519,
            "MilliradiansOfDrop": -4.933208311688311,
            "MaxDispersion": 15.068900000000001
        },
        {
            "Distance": 780,
            "Penetration": 29.219799,
            "Damage": 54.362415,
            "Speed": 346.9593,
            "Drop": -4.0215445,
            "TimeOfFlight": 1.3869021,
            "MilliradiansOfDrop": -5.155826282051282,
            "MaxDispersion": 15.2646
        },
        {
            "Distance": 790,
            "Penetration": 29.149586,
            "Damage": 54.23179,
            "Speed": 343.8036,
            "Drop": -4.252632,
            "TimeOfFlight": 1.4170523,
            "MilliradiansOfDrop": -5.383078481012658,
            "MaxDispersion": 15.4603
        },
        {
            "Distance": 800,
            "Penetration": 29.084427,
            "Damage": 54.11056,
            "Speed": 340.8751,
            "Drop": -4.491987,
            "TimeOfFlight": 1.4472024,
            "MilliradiansOfDrop": -5.6149837499999995,
            "MaxDispersion": 15.656
        }
    ]

    const distances = testData.map(x => {
        return {
            value: `${x.Distance}`,
            label: `${x.Distance}m`
        }
    }).sort()

    const form = useTestForm({
        initialValues: {
            stringField: "springField",
            selectedDistance: "100",
            distance: 100,
            dispersionCm: 11.5,
            dropCm: 7.14,
            zoom: 1,
            milsMultiplier: 1,
            reticleType: "Mil Lines"
        },
        validate: testFormYupValidator
    })

    function onClickSubmitForm() {
        const validation = form.validate();
        if (validation.hasErrors) {
            return
        }
        setResult(form.values)
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {

        const dispersionRadiusCm = form.values.dispersionCm;
        const distanceM = form.values.distance;
        const zoom = form.values.zoom;
        const milsMultiplier = form.values.milsMultiplier;

        const dropCM = form.values.dropCm

        const paddingLeft = 40 * zoom
        const paddingTop = 100 * zoom

        const milAt100mInCm = 2.909;

        const ruleOfThumb = 600 * (100 / distanceM);
        const distanceVisMult = ruleOfThumb / 600

        const scaledCenterlineOffset = 146 * (100 / distanceM);
        const leftPadding2 = (146 - scaledCenterlineOffset) * zoom;

        const scaledHorizontalLineOffset = 58 * (100 / distanceM);
        const paddingTop2 = (58 - scaledHorizontalLineOffset) * zoom;

        const centerLine = (146 * zoom) + paddingLeft;
        const centerOfFaceY = (58 * zoom) + paddingTop;

        const centerOfMassX = 137 + paddingLeft;
        const centerOfMassY = 160 + paddingTop;

        const crosshairLength = 10; // Half-length of each line (so total 20px long)

        const lengthCm = 16;
        const pixels = 45;
        const pixelsPerCm = pixels / lengthCm;

        const dispersionRadiusPx = pixelsPerCm * dispersionRadiusCm;

        //? What do we need to know?
        // 0 - the drop data of a calibrated weapon
        // 1 - the distance to the target
        // 2 - how many pixels to the mil at that distance
        // 3 - 

        //! Gonna declare 1cm = 2px at 100m, for development

        const CANVAS_CENTERLINE_X = 300;
        const CANVAS_CENTERLINE_Y = 300;

        const REFERENCE_DISTANCE = 100;
        const PIXELS_PER_CM_AT_100M = 2;
        const CM_PER_MIL_AT_100M = 2.909;

        const pixelsPerCmAtCurrentDistanceAndZoom = PIXELS_PER_CM_AT_100M * (REFERENCE_DISTANCE / distanceM) * zoom;
        console.log("pixelsPerCmAtCurrentDistanceAndZoom", pixelsPerCmAtCurrentDistanceAndZoom)

        const cmPerMilAtCurrentDistance = ((distanceM / REFERENCE_DISTANCE) * CM_PER_MIL_AT_100M);
        console.log("cmPerMilAtCurrentDistance", cmPerMilAtCurrentDistance)

        const pixelsPerMilAtCurrentDistanceAndZoom = (cmPerMilAtCurrentDistance * pixelsPerCmAtCurrentDistanceAndZoom);
        console.log("pixelsPerMilAtCurrentDistanceAndZoom", pixelsPerMilAtCurrentDistanceAndZoom)

        const superElevationYPx = CANVAS_CENTERLINE_Y + (dropCM * pixelsPerCmAtCurrentDistanceAndZoom);

        function drawReferenceHeadBox(ctx: CanvasRenderingContext2D) {
            const sizeInCm = 16; // 16cm a side for the head box
            const apparentSizePx = (sizeInCm * pixelsPerCmAtCurrentDistanceAndZoom)

            const centerlinePlacement = CANVAS_CENTERLINE_X - (apparentSizePx / 2);

            ctx.fillStyle = 'rgb(117, 167, 1)';
            ctx.fillRect(centerlinePlacement, centerlinePlacement, apparentSizePx, apparentSizePx)
        }

        function drawReferenceScale5cm(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string) {
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const minorCrosshatchSize = 5;
            const majorCrosshatchSize = 10;
            const fontSizePx = .75 * pixelsPerCmAtCurrentDistanceAndZoom;

            ctx.font = `${fontSizePx}px Arial`;

            const scaleLengthM = 100;
            const scaleLengthCm = scaleLengthM * 100;
            const divisions = 10

            const pixelLength = scaleLengthCm * pixelsPerCmAtCurrentDistanceAndZoom;

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - pixelLength, y);
            ctx.lineTo(x + pixelLength, y);
            ctx.stroke();

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - pixelLength);
            ctx.lineTo(x, y + pixelLength);
            ctx.stroke();

            // Crosshatching
            for (let i = 1; i <= scaleLengthCm / divisions; i++) {
                const crossHatchSize = i % 5 !== 0 ? minorCrosshatchSize : majorCrosshatchSize

                // Horizontal
                // Left
                ctx.beginPath();
                ctx.moveTo(x - (i * pixelsPerCmAtCurrentDistanceAndZoom), y - crossHatchSize);
                ctx.lineTo(x - (i * pixelsPerCmAtCurrentDistanceAndZoom), y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x - (i * pixelsPerCmAtCurrentDistanceAndZoom), y + ((crossHatchSize) * 2.5));
                }

                // Right
                ctx.beginPath();
                ctx.moveTo(x + (i * pixelsPerCmAtCurrentDistanceAndZoom), y - crossHatchSize);
                ctx.lineTo(x + (i * pixelsPerCmAtCurrentDistanceAndZoom), y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + (i * pixelsPerCmAtCurrentDistanceAndZoom), y + ((crossHatchSize) * 2.5));
                }

                // Vertical
                // Top
                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y - (i * pixelsPerCmAtCurrentDistanceAndZoom));
                ctx.lineTo(x + crossHatchSize, y - (i * pixelsPerCmAtCurrentDistanceAndZoom));
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + ((crossHatchSize) * 1.5), y - (i * pixelsPerCmAtCurrentDistanceAndZoom));
                }

                // Bottom
                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y + (i * pixelsPerCmAtCurrentDistanceAndZoom));
                ctx.lineTo(x + crossHatchSize, y + (i * pixelsPerCmAtCurrentDistanceAndZoom));
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + ((crossHatchSize) * 1.5), y + (i * pixelsPerCmAtCurrentDistanceAndZoom));
                }
            }

        }

        function drawDispersionCircle(ctx: CanvasRenderingContext2D, x: number, y: number, dispersionRadiusCm: number, fillStyle: string) {
            const pxRadius = dispersionRadiusCm * pixelsPerCmAtCurrentDistanceAndZoom;

            ctx.beginPath();
            ctx.arc(x, y, pxRadius, 0, 2 * Math.PI);
            ctx.fillStyle = fillStyle;
            ctx.fill();

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        function new_drawMilCrosshatchCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, multiplier: number) {
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const localPixelsPerMilAtCurrentDistanceAndZoom = pixelsPerMilAtCurrentDistanceAndZoom * multiplier;

            const milsCount = 15;
            const lengthCrosshairs = localPixelsPerMilAtCurrentDistanceAndZoom * milsCount;

            const minorCrosshatchSize = .25 * localPixelsPerMilAtCurrentDistanceAndZoom;
            const majorCrosshatchSize = .5 * localPixelsPerMilAtCurrentDistanceAndZoom;
            const fontSizePx = .75 * localPixelsPerMilAtCurrentDistanceAndZoom;

            ctx.font = `${fontSizePx}px Arial`;

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - lengthCrosshairs, y);
            ctx.lineTo(x + lengthCrosshairs, y);
            ctx.stroke();

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - lengthCrosshairs);
            ctx.lineTo(x, y + lengthCrosshairs);
            ctx.stroke();

            // Crosshatching
            for (let i = 1; i <= milsCount; i++) {
                const crossHatchSize = i % 5 !== 0 ? minorCrosshatchSize : majorCrosshatchSize;
                const iterationPixels = i * localPixelsPerMilAtCurrentDistanceAndZoom;

                // Horizontal
                // Left
                ctx.beginPath();
                ctx.moveTo(x - iterationPixels, y - crossHatchSize);
                ctx.lineTo(x - iterationPixels, y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x - iterationPixels, y + ((crossHatchSize) * 2.5));
                }

                // Right
                ctx.beginPath();
                ctx.moveTo(x + iterationPixels, y - crossHatchSize);
                ctx.lineTo(x + iterationPixels, y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + iterationPixels, y + ((crossHatchSize) * 2.5));
                }

                // Vertical
                // Top
                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y - iterationPixels);
                ctx.lineTo(x + crossHatchSize, y - iterationPixels);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + ((crossHatchSize) * 1.5), y - iterationPixels);
                }

                // Bottom
                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y + iterationPixels);
                ctx.lineTo(x + crossHatchSize, y + iterationPixels);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + ((crossHatchSize) * 1.5), y + iterationPixels);
                }
            }
        }


        function drawMilCrosshatchCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, multiplier: number) {
            const pixelsPerMil = (REFERENCE_DISTANCE / distanceM) * CM_PER_MIL_AT_100M * PIXELS_PER_CM_AT_100M * zoom;


            const milsCount = 15;

            const milSpacing = milAt100mInCm * pixelsPerCm * zoom * multiplier
            const crosshairLength = milAt100mInCm * pixelsPerCm * milsCount * zoom * multiplier;
            const offset = 2 * zoom;

            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const fontSize = 15 + (zoom * 1.5);
            ctx.font = `${fontSize}px Arial`;        // Set font and size

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - crosshairLength, y);
            ctx.lineTo(x + crosshairLength, y);
            ctx.stroke();

            for (let i = 1; i <= milsCount; i++) {

                const crossHatchSize = i % 5 !== 0 ? offset : offset * 2

                ctx.beginPath();
                ctx.moveTo(x - (i * milSpacing), y - crossHatchSize);
                ctx.lineTo(x - (i * milSpacing), y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x - (i * milSpacing), y + crossHatchSize * 3);
                }

                ctx.beginPath();
                ctx.moveTo(x + (i * milSpacing), y - crossHatchSize);
                ctx.lineTo(x + (i * milSpacing), y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + (i * milSpacing), y + crossHatchSize * 3.5);
                }
            }

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - crosshairLength);
            ctx.lineTo(x, y + crosshairLength);
            ctx.stroke();

            for (let i = 1; i <= milsCount; i++) {

                const crossHatchSize = i % 5 !== 0 ? offset : offset * 2

                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y - (i * milSpacing));
                ctx.lineTo(x + crossHatchSize, y - (i * milSpacing));
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + crossHatchSize, y - (i * milSpacing));
                }

                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y + (i * milSpacing));
                ctx.lineTo(x + crossHatchSize, y + (i * milSpacing));
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + crossHatchSize, y + (i * milSpacing));
                }
            }
        }

        function drawMilDotCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, multiplier: number) {
            const milsCount = 4;

            const milSpacing = milAt100mInCm * pixelsPerCm * zoom * multiplier
            const crosshairLength = milAt100mInCm * pixelsPerCm * (milsCount + 1) * zoom * multiplier;

            const offset = 1.8 * zoom;
            const recBarSize = 7.5 * zoom

            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - crosshairLength, y);
            ctx.lineTo(x + crosshairLength, y);
            ctx.stroke();

            for (let i = 1; i <= milsCount; i++) {
                ctx.beginPath();
                ctx.arc(x - (i * milSpacing), y, offset, 0, 2 * Math.PI);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x + (i * milSpacing), y, offset, 0, 2 * Math.PI);
                ctx.fill();
            }

            ctx.fillRect(x - (5 * milSpacing), y - (recBarSize / 2), - 300, recBarSize);
            ctx.fillRect(x + (5 * milSpacing), y - (recBarSize / 2), 300, recBarSize);

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - crosshairLength);
            ctx.lineTo(x, y + crosshairLength);
            ctx.stroke();

            for (let i = 1; i <= milsCount; i++) {
                ctx.beginPath();
                ctx.arc(x, y - (i * milSpacing), offset, 0, 2 * Math.PI);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y + (i * milSpacing), offset, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.fillRect(x - (recBarSize / 2), y + (5 * milSpacing), recBarSize, 300);
            ctx.fillRect(x - (recBarSize / 2), y - (5 * milSpacing), recBarSize, -300);
            // ctx.fillRect(x + (5 * milSpacing), y - (recBarSize / 2), 300, recBarSize);

        }

        function drawUnfilledMilDotCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyleInner: string, multiplier: number) {
            const milsCount = 4;

            const milSpacing = milAt100mInCm * pixelsPerCm * zoom * multiplier

            const offset = 1.4 * zoom;
            const recBarSize = 7.5 * zoom

            ctx.strokeStyle = strokeStyleInner;

            for (let i = 0; i <= milsCount; i++) {
                // first mil dot steps
                if (i === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x - (i * milSpacing), y);
                    ctx.lineTo(x - ((i + 1) * milSpacing) + offset, y);
                    ctx.stroke();

                    // Right
                    ctx.beginPath();
                    ctx.moveTo(x + (i * milSpacing), y);
                    ctx.lineTo(x + ((i + 1) * milSpacing) - offset, y);
                    ctx.stroke();
                }
                // middile mildot steps
                else if (i > 0 && i < milsCount) {
                    ctx.beginPath();
                    ctx.moveTo(x - (i * milSpacing) - offset, y);
                    ctx.lineTo(x - ((i + 1) * milSpacing) + offset, y);
                    ctx.stroke();

                    // Right
                    ctx.beginPath();
                    ctx.moveTo(x + (i * milSpacing) + offset, y);
                    ctx.lineTo(x + ((i + 1) * milSpacing) - offset, y);
                    ctx.stroke();
                }
                else if (i === milsCount) {
                    ctx.beginPath();
                    ctx.moveTo(x - (i * milSpacing) - offset, y);
                    ctx.lineTo(x - ((i + 1) * milSpacing), y);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x + (i * milSpacing) + offset, y);
                    ctx.lineTo(x + ((i + 1) * milSpacing), y);
                    ctx.stroke();
                }
                if (i > 0) {
                    ctx.beginPath();
                    ctx.arc(x - (i * milSpacing), y, offset, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(x + (i * milSpacing), y, offset, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }



            // Vertical line
            ctx.strokeStyle = strokeStyleInner;
            for (let i = 0; i <= milsCount; i++) {
                if (i === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x, y - (i * milSpacing));
                    ctx.lineTo(x, y - ((i + 1) * milSpacing) + offset);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x, y + (i * milSpacing));
                    ctx.lineTo(x, y + ((i + 1) * milSpacing) - offset);
                    ctx.stroke();
                }
                else if (i > 0 && i < milsCount) {
                    ctx.beginPath();
                    ctx.moveTo(x, y - (i * milSpacing) - offset);
                    ctx.lineTo(x, y - ((i + 1) * milSpacing) + offset);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x, y + (i * milSpacing) + offset);
                    ctx.lineTo(x, y + ((i + 1) * milSpacing) - offset);
                    ctx.stroke();
                }
                else if (i === milsCount) {
                    ctx.beginPath();
                    ctx.moveTo(x, y - (i * milSpacing) - offset);
                    ctx.lineTo(x, y - ((i + 1) * milSpacing));
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x, y + (i * milSpacing) + offset);
                    ctx.lineTo(x, y + ((i + 1) * milSpacing));
                    ctx.stroke();
                }
                if (i > 0) {
                    ctx.beginPath();
                    ctx.arc(x, y - (i * milSpacing), offset, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(x, y + (i * milSpacing), offset, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }


            ctx.strokeStyle = "black"
            ctx.beginPath();
            ctx.rect(x - (5 * milSpacing), y - (recBarSize / 2), - 300, recBarSize);
            ctx.stroke();

            ctx.rect(x + (5 * milSpacing), y - (recBarSize / 2), 300, recBarSize);
            ctx.stroke();

            ctx.rect(x - (recBarSize / 2), y + (5 * milSpacing), recBarSize, 300);
            ctx.stroke();

            ctx.rect(x - (recBarSize / 2), y - (5 * milSpacing), recBarSize, -300);
            ctx.stroke();

        }

        function drawDropCircle(ctx: CanvasRenderingContext2D, droppedY: number, dispersionRadiusCm: number, fillStyle: string) {

            const dispersionRadiusPx = pixelsPerCm * dispersionRadiusCm;

            ctx.beginPath();
            ctx.arc(centerLine, droppedY, dispersionRadiusPx * zoom, 0, 2 * Math.PI);      // x=100, y=75, radius=50
            ctx.fillStyle = fillStyle;                                       // Set fill color
            ctx.fill();                                                                     // Fill the circle

            ctx.strokeStyle = 'white';                                                      // Outline color
            ctx.lineWidth = 1;                                                              // Optional: line thickness
            ctx.stroke();
        }


        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const image = new Image();
        image.src = '/scav_acc_template.png';


        // const dropCM = form.values.dropCm * 100 * zoom;
        const dispersionCm = form.values.dispersionCm;

        image.onload = () => {
            ctx.fillStyle = 'rgb(20, 26, 34)';
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            console.log(ruleOfThumb)
            // ctx.drawImage(
            //     image,
            //     0 + paddingLeft + leftPadding2,
            //     0 + paddingTop + paddingTop2,
            //     canvas.width * zoom * distanceVisMult,
            //     canvas.height * zoom * distanceVisMult
            // ); // Draw the image to fill the canvas

            drawReferenceHeadBox(ctx);
            console.log("dispersionRadiusCm", dispersionRadiusCm)
            drawDispersionCircle(ctx, CANVAS_CENTERLINE_X, CANVAS_CENTERLINE_Y, dispersionRadiusCm, 'rgba(0, 110, 255, 0.90)');



            // ctx.fillStyle = 'rgb(117, 167, 1)';
            // const rectangleSide = 32
            // const centeredPlacement = CANVAS_CENTERLINE_X - (rectangleSide / 2);
            // ctx.fillRect(centeredPlacement, centeredPlacement, rectangleSide, rectangleSide)

            // So either we apply the drop to the bullseye, or we apply it to the crosshairs

            // Bullseye
            // const droppedY = centerOfFaceY - (dropCM * pixelsPerCm)

            // Crosshairs
            const droppedY = (centerOfFaceY * (pixelsPerCm * (100 / distanceM))) + (dropCM * (pixelsPerCm * (100 / distanceM)))

            console.log("distanceM", distanceM)
            console.log("dropCM", dropCM)
            console.log("droppedY", droppedY)


            // const droppedY_200m = centerOfFaceY - (data200m.Drop * 100 * pixelsPerCm)

            // drawDropCircle(ctx, centerOfFaceY, dispersionCm, 'rgba(0, 110, 255, 0.10)')

            // drawDropCircle(ctx, centerOfFaceY, dispersionCm * .75, 'rgba(9, 255, 0, 0.25)')

            // drawDropCircle(ctx, centerOfFaceY, dispersionCm * .5, 'rgba(255, 0, 0, 0.5)')

            // drawDropCircle(ctx, centerOfFaceY, dispersionCm * .25, 'rgba(255, 251, 0, .75)')

            // drawDropCircle(ctx, centerOfFaceY, dispersionCm * .10, 'rgba(0, 0, 0, 0.8)')


            ctx.lineWidth = 2;
            // // Horizontal line
            // ctx.beginPath();
            // ctx.moveTo(centerOfFaceX - crosshairLength, centerOfFaceY);
            // ctx.lineTo(centerOfFaceX + crosshairLength, centerOfFaceY);
            // ctx.stroke();

            // // Vertical line
            // ctx.beginPath();
            // ctx.moveTo(centerOfFaceX, centerOfFaceY - crosshairLength);
            // ctx.lineTo(centerOfFaceX, centerOfFaceY + crosshairLength);
            // ctx.stroke();

            drawReferenceScale5cm(ctx, CANVAS_CENTERLINE_X, superElevationYPx, "purple")

            new_drawMilCrosshatchCrosshair(ctx, CANVAS_CENTERLINE_X, superElevationYPx, 'rgba(255, 0, 221, 0.25)', 1)

            // drawMilCrosshatchCrosshair(ctx, centerLine, droppedY, 'rgba(255, 0, 221, 0.25)', 1);
            if (form.values.reticleType === "Mil Lines") {
                new_drawMilCrosshatchCrosshair(ctx, CANVAS_CENTERLINE_X, superElevationYPx, 'rgba(255, 255, 255, 1)', milsMultiplier)
            }
            else if (form.values.reticleType === "Mil Dots") {
                drawMilDotCrosshair(ctx, centerLine, droppedY, 'rgba(255, 255, 255, 1)', milsMultiplier);
            }
            else if (form.values.reticleType === "Unfilled Mil Dots") {
                drawUnfilledMilDotCrosshair(ctx, centerLine, droppedY, 'rgb(255, 0, 0)', milsMultiplier);
            }

            ctx.fillStyle = 'white';        // Set text color to white
            ctx.font = '18px Arial';        // Set font and size
            // ctx.fillText('Distance: NUMBER', 250, 210);
            // ctx.fillText(`Distance: ${distanceM}m`, 250, 210);
            // ctx.fillText(`Dispersion Radius: ${dispersionRadiusCm}cm`, 250, 230);

            // // ctx.fillText('Tarkov MOA: NUMBER', 250, 230); // Draw text at (x=50, y=100)
            // ctx.fillText('Real Mils: NUMBER', 250, 250); // Draw text at (x=50, y=100)
            // ctx.fillText('Real MOA: NUMBER', 250, 270); // Draw text at (x=50, y=100)
            // ctx.fillText('www.tarkovgunsmith.com/optic_simulator', 50, 500); // Draw text at (x=50, y=100)
        };
    }, [form])

    console.log(form.values)

    return (
        <>
            <TestFormContextProvider form={form}>
                <Grid>
                    <Grid.Col span={3}>
                        <Stack spacing={"xs"}>
                            <Divider label="The Form!" labelPosition="center" />
                            <Select
                                label="Select Distance"
                                data={distances}
                                {...form.getInputProps("selectedDistance")}
                                onChange={(value) => {
                                    if (!value) {
                                        return
                                    }
                                    const asNumber = parseInt(value)
                                    form.setFieldValue('distance', asNumber)

                                    const foo = testData.find(x => x.Distance === asNumber)
                                    if (!foo) {
                                        return
                                    }
                                    form.setFieldValue('dispersionCm', foo.MaxDispersion)
                                    form.setFieldValue('dropCm', foo.Drop * 100)

                                    form.setFieldValue('selectedDistance', value)
                                }}
                            />
                            <Group>
                                <NumberInput
                                    label="Drop cm"
                                    disabled
                                    precision={2}
                                    {...form.getInputProps("dropCm")}
                                />
                                <NumberInput
                                    label="Dispersion cm"
                                    disabled
                                    precision={2}
                                    {...form.getInputProps("dispersionCm")}
                                />
                            </Group>
                            <NumberInput
                                label="Zoom"
                                precision={2}
                                step={.1}
                                {...form.getInputProps("zoom")}
                            />
                            <NumberInput
                                label="Scope Mils Multiplier"
                                precision={2}
                                step={.01}
                                {...form.getInputProps("milsMultiplier")}
                            />

                            <Select
                                data={["Mil Lines", "Mil Dots", "Unfilled Mil Dots"]}
                                {...form.getInputProps("reticleType")}
                            />
                            {/* <Button
                        onClick={onClickSubmitForm}
                    >
                        Submit Form
                    </Button> */}
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={4}>
                        <canvas ref={canvasRef} width={600} height={600} style={{ border: '1px solid black' }} />
                    </Grid.Col>

                </Grid>


            </TestFormContextProvider>


        </>
    )
}