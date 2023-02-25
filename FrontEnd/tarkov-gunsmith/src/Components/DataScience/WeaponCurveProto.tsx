import { useState } from "react";
import { Button, Card, Col } from "react-bootstrap";
import { CartesianGrid, Legend, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, Label, Bar, ComposedChart, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { requestWeaponDataCurve } from "../../Context/Requests";

export default function WeaponCurveProto(props: any) {
    interface CurveDataPoint {
        level: number,
        recoil: number,
        ergo: number,
        price: number,
        invalid: Boolean
    };

    const handleGetCurveData = () => {
        const requestDetails = {
            presetID: "584147ed2459775a77263501",
            mode: "Meta Recoil",
            muzzleMode: 1,
            purchaseType: 2
        }
        requestWeaponDataCurve(requestDetails).then(response => {
            setResult(response);
            console.log(response);
        }).catch(error => {
            alert(`The error was: ${error}`);
            // console.log(error);
        });
    }
    const [result, setResult] = useState<CurveDataPoint[]>();
    let resultCard;

    const CustomTooltip = ({ active, payload, label }: TooltipProps<ValueType, NameType>): JSX.Element => {
        if (active && payload && payload.length) {
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${label} : ${payload[0].value}`}</p>
                    <p className="label">{`${label} : ${payload[1].value}`}</p>
                    <p className="label">{`${label} : ${payload[2].value}`}</p>
                    <p className="label">{`${label} : ${payload[3].value}`}</p>
                    <p className="desc">Anything you want can be displayed here.</p>
                </div>
            );
        }
        return (
            <>
            </>
        )
    };

    if (result !== undefined) {
        resultCard = (
            <>
                <div className='black-text'>
                    <ResponsiveContainer width={850}
                        height={400}>
                        <ComposedChart
                            width={800}
                            height={400}
                            data={result}
                            margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid strokeDasharray="7 7" />
                            <XAxis
                                dataKey={"level"}
                                type="number"
                                domain={[0, 40]}
                            >
                                <Label
                                    style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "white",
                                    }}
                                    position="bottom"
                                    value={"Player Level"} />
                            </XAxis>
                            <YAxis
                                yAxisId="left"
                                type="number"
                            >
                                <Label
                                    style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "white",
                                    }}
                                    angle={270}
                                    position="left"
                                    value={"Ergo / Recoil"}
                                />
                            </YAxis>

                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                dataKey="price"
                                type="number"
                                tickFormatter={(value: number) => value.toLocaleString("en-US")}
                            >
                                <Label
                                    style={{
                                        textAnchor: "middle",
                                        fontSize: "100%",
                                        fill: "white",
                                    }}
                                    angle={270}
                                    position="right"
                                    value={"Price - ₽"}
                                    offset={15}
                                />
                            </YAxis>
                            <YAxis
                                domain={[1, 0]}
                                yAxisId="BOOL"
                                hide={true}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#dde9f0" }}
                                formatter={function (value, name) {
                                    if (name === "price") {
                                        return `${value.toLocaleString("en-US")} ₽`;
                                    }
                                    else {
                                        return `${value}`;
                                    }

                                }}
                                labelFormatter={function (value) {
                                    return `level: ${value}`;
                                }}

                            />
                            <Legend verticalAlign="top" />
                            <Line yAxisId="right" type="monotone" dataKey="price" stroke="#faa107" activeDot={{ r: 8 }} />
                            <Line yAxisId="left" type="monotone" dataKey="recoil" stroke="#239600" />
                            <Line yAxisId="left" type="monotone" dataKey="ergo" stroke="#2667ff" />
                            <Bar yAxisId="BOOL" dataKey="invalid" barSize={25} fill="red" />
                        </ComposedChart >
                    </ResponsiveContainer>
                </div>
            </>




        )
    }
    else {
        resultCard = (
            <>
            </>)
    }


    return (
        <>
            <Col xl>
                <Card bg="dark" border="secondary" text="light" className="xl">

                    <Card.Header as="h3">
                        Stats curve of Kalashnikov AKS-74UN 5.45x39 assault rifle
                    </Card.Header>
                    <Card.Body>
                        <Button variant="secondary" onClick={handleGetCurveData}>Get that bread</Button> <br />
                        {resultCard}
                    </Card.Body>
                </Card>
            </Col>
        </>
    )
}