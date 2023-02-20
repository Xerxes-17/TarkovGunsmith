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
                <img src={`https://assets.tarkov.dev/${props.item.Id}-grid-image.webp`} alt={props.item.ShortName} className={"mod_img"} />
            </Col>
            <Col className="mod-text-centered">
                {props.item.ShortName}
            </Col>
            <Col className="mod-text-centered">
                ✍<br/>
                {props.item.Ergo}
            </Col>
            <Col className="mod-text-centered">
                ⏬ <br/>
                {props.item.RecoilMod}
            </Col>
            <Col className="mod-text-centered">
                💸 <br/>
                ₽ {props.item.PriceRUB.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
            </Col>
        </Row>
    )
}