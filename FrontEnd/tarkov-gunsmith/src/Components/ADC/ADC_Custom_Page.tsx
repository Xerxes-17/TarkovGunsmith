import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { TransmissionArmorTestResult } from "../../Context/ArmorTestsContext";
import { requestArmorTestSerires_Custom } from "../../Context/Requests";
import Shot from "./Shot";


export default function ArmorDamageCalculatorCustom(props: any) {
    const [armorClass, setArmorClass] = useState(4);
    const [armorMaterial, setArmorMaterial] = useState("Titan");
    const [armorDurabilityNum, setArmorDurabilityNum] = useState(40);
    const [armorDurabilityMax, setArmorDurabilityMax] = useState(40);

    const [penetration, setPenetration] = useState(35);
    const [armorDamagePerc, setArmorDamagePerc] = useState(52);

    const [result, setResult] = useState<TransmissionArmorTestResult>();

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const requestDetails = {
            armorClass: armorClass,
            armorMaterial: armorMaterial,
            armorDurabilityPerc: (armorDurabilityNum / armorDurabilityMax * 100),
            armorDurabilityMax: armorDurabilityMax,

            penetration: penetration,
            armorDamagePerc: armorDamagePerc
        }

        requestArmorTestSerires_Custom(requestDetails).then(response => {
            console.log(response);
            setResult(response);
        }).catch(error => {
            alert(`The error was: ${error}`);
            console.log(error);
        });
    }

    let ArmorCard = (
        <>

        </>
    )

    let topSection = (
        <>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <section className="about container">
                        <div className="content">
                            <Form onSubmit={handleSubmit}>
                                <Container>
                                    <h2>Custom Armor Details</h2>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Group className="md" controlId="ArmorClass">
                                                <Form.Label>Armor Class 🛡</Form.Label>
                                                <Form.Select aria-label="Default select example" defaultValue={armorClass} onChange={(e) => { setArmorClass(parseInt(e.target.value)) }}>
                                                    <option value={1}>1</option>
                                                    <option value={2}>2</option>
                                                    <option value={3}>3</option>
                                                    <option value={4}>4</option>
                                                    <option value={5}>5</option>
                                                    <option value={6}>6</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <br />

                                            <Form.Group className="md" controlId="ArmorClass">
                                                <Form.Label>Armor Material 🧱</Form.Label>
                                                <Form.Select aria-label="Default select example" value={armorMaterial} onChange={(e) => { setArmorMaterial(e.target.value) }}>
                                                    <option value={"Aramid"}>Aramid</option>
                                                    <option value={"UHMWPE"}>UHMWPE</option>
                                                    <option value={"Combined"}>Combined</option>
                                                    <option value={"Aluminium"}>Aluminium</option>
                                                    <option value={"Titan"}>Titan</option>
                                                    <option value={"ArmoredSteel"}>ArmoredSteel</option>
                                                    <option value={"Ceramic"}>Ceramic</option>
                                                    <option value={"Glass"}>Glass</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={7}>
                                            <Form.Group controlId="MaxDurability">
                                                <Form.Label>Armor Durability Max</Form.Label>
                                                <Form.Control type="MaxDurability" placeholder="Enter max durability as a number" defaultValue={armorDurabilityMax} onChange={(e) => { setArmorDurabilityMax(parseInt(e.target.value)) }} />
                                                <Form.Text className="text-muted">
                                                    Eg: "40" without quotes.
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group>
                                                <Row>
                                                    <Col md>
                                                        <Form.Label>Starting Armor Durability</Form.Label>
                                                        <Form.Range value={armorDurabilityNum} max={armorDurabilityMax} onChange={(e) => { setArmorDurabilityNum(parseInt(e.target.value)) }} />
                                                    </Col>
                                                    <Col md="3">
                                                        <Form.Label>Number</Form.Label>
                                                        <Form.Control value={armorDurabilityNum} onChange={(e) => { setArmorDurabilityNum(parseInt(e.target.value)) }} />

                                                    </Col>
                                                    <Col md="3">
                                                        <Form.Label>Percentage</Form.Label>
                                                        <Form.Control disabled={true} value={(armorDurabilityNum / armorDurabilityMax * 100).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%"} />
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Container>


                                <br />
                                <br />
                                <h2>Custom Ammo Stats</h2>
                                <Container>
                                    <Row>
                                        <Col md={3}>
                                            <Form.Group className="md" controlId="Penetration">
                                                <Form.Label>Penetration ✒</Form.Label>
                                                <Form.Control type="Penetration" placeholder="Enter penetration as a number" defaultValue={penetration} onChange={(e) => { setPenetration(parseInt(e.target.value)) }} />
                                                <Form.Text className="text-muted">
                                                    Eg: "35" without quotes.
                                                </Form.Text>
                                            </Form.Group>
                                        </Col>
                                        <Col md={7}>
                                            <Form.Group>
                                                <Row>
                                                    <Col md>
                                                        <Form.Label>Armor Damage Percentage 📐</Form.Label>
                                                        <Form.Range value={armorDamagePerc} max={100} min={1} onChange={(e) => { setArmorDamagePerc(parseInt(e.target.value)) }} />
                                                    </Col>
                                                    <Col md="3">
                                                        <Form.Text>ADP</Form.Text>
                                                        <Form.Control value={armorDamagePerc} onChange={(e) => { setArmorDamagePerc(parseInt(e.target.value)) }} />
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Container>
                                <br />
                                <Button variant="primary" type="submit" className='form-btn'>
                                    Simulate
                                </Button>
                            </Form>
                        </div>
                    </section>
                </Col>
            </Row>
        </>
    )

    let content;

    if (result !== undefined) {
        content = (
            <>
                {topSection}
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <br />
                        <section className="about container">
                            <div className="row gy-0">
                                <div className="col-lg d-flex flex-column justify-content-center">
                                    <div className="content">
                                        <h2 className="card-title">{result.testName}</h2>
                                        <Row className='centered-vertically'>
                                            <Col><img src={result.armorGridImage} className="img-fluid" alt='' /></Col>
                                            <Col><img src={result.ammoGridImage} className="img-fluid" alt='' /></Col>
                                        </Row>
                                        <p>Expected armor damage per shot: {result.armorDamagePerShot.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                                        <br />
                                        <Col className='shotBoxes'>
                                            <Container>
                                                <Row className="justify-content-md-center">
                                                    <Col>
                                                        <h3>Shot:</h3>
                                                    </Col>
                                                    <Col>
                                                        <h3>Armor Durability</h3>
                                                    </Col>
                                                    <Col>
                                                        <h3>Durability Percentage:</h3>
                                                    </Col>
                                                    <Col>
                                                        <h3>Done Armor Damage:</h3>
                                                    </Col>
                                                    <Col>
                                                        <h3>Penetration Chance:</h3>
                                                    </Col>
                                                </Row>
                                            </Container>
                                            {result.shots.map((item: any, i: number) => {
                                                return (

                                                    <Shot key={JSON.stringify(item)} shot={item} num={i}></Shot>

                                                )
                                            })}
                                        </Col>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Col>
                </Row>
            </>
        )
    }
    else {
        content = (
            <>
                {topSection}
            </>
        )
    }

    return (
        content
    )
}