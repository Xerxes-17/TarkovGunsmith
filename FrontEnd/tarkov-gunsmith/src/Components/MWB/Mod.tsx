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

    var aPrice: number;
    if(props.item.PurchaseOffer!){
        aPrice = props.item.PurchaseOffer!.PriceRUB!;
    }
    
    var aText;
    if(aPrice!){
        aText = props.item.PurchaseOffer!.PriceRUB!.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 });}
    else{
        aText = "n/a";
    }

    return (
        <Row className={rowClassString}>
            <Col sm={4}>
                <img src={`https://assets.tarkov.dev/${props.item.WeaponMod.Id}-grid-image.webp`} alt={props.item.WeaponMod.ShortName} className={"mod_img"} />
            </Col>
            <Col className="mod-text-centered">
                {props.item.WeaponMod.Name}
            </Col>
            <Col className="mod-text-centered">
                ✍<br/>
                {props.item.WeaponMod.Ergonomics}
            </Col>
            <Col className="mod-text-centered">
                ⏬ <br/>
                {props.item.WeaponMod.Recoil}
            </Col>
            <Col className="mod-text-centered">
                💸 <br/>
                ₽ {aText}
            </Col>
        </Row>
    )
}