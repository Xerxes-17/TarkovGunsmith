import { Container, Row, Col } from "react-bootstrap";

export default function Shot(props: any) {
    return (
        <Container>
            <Row className="justify-content-md-center">
                <Col>
                    <h3>{props.num + 1}</h3>
                </Col>
                <Col>
                    <text>{props.shot.durability.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</text>
                </Col>
                <Col>
                    <text>{props.shot.durabilityPerc.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%</text>
                </Col>
                <Col>
                    <text>{props.shot.doneDamage.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</text>
                </Col>
                <Col>
                    <text>{props.shot.penetrationChance.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%</text>
                </Col>
            </Row>
        </Container>
    );
}