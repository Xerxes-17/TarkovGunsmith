import { Col, Container, Row, Stack } from "react-bootstrap";

export default function Mod(props: any) {
    return (
        <Container className="modRow">
            <Row className="justify-content-md-center">
                <Col md={2}>
                    <img src={`https://assets.tarkov.dev/${props.item.id}-grid-image.jpg`} alt={props.item.shortName} className={"mod_img"} />
                </Col>
                <Col md={4}>
                    <h3 >{props.item.shortName}</h3>
                </Col>
                <Col md={1}>
                    ✍ {props.item.ergo}
                </Col>
                <Col md={1}>
                    ⏬ {props.item.recoilMod}
                </Col>
                <Col md={2}>
                    ₽ {props.item.priceRUB.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
                </Col>
            </Row>
        </Container>
    )
}