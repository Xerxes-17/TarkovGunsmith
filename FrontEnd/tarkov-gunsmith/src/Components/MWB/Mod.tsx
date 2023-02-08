import { Col, Row } from "react-bootstrap";

export default function Mod(props: any) {
    let rowClassString = "modRowEven";

    if (props.i % 2 === 0)
    {
        rowClassString = "modRowEven"
    }
    else{
        rowClassString = "modRowOdd"
    }

    return (
        <Row className={rowClassString}>
            <Col sm={4}>
                <img src={`https://assets.tarkov.dev/${props.item.id}-grid-image.jpg`} alt={props.item.shortName} className={"mod_img"} />
            </Col>
            <Col className="mod-text-centered">
                {props.item.shortName}
            </Col>
            <Col className="mod-text-centered">
                ✍<br/>
                {props.item.ergo}
            </Col>
            <Col className="mod-text-centered">
                ⏬ <br/>
                {props.item.recoilMod}
            </Col>
            <Col className="mod-text-centered">
                💸 <br/>
                ₽ {props.item.priceRUB.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
            </Col>
        </Row>
    )
}