import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BallisticRating, OfferType, PurchaseOffer } from "./AEC_Interfaces";

export const MY_VIOLET = "#fc03f4";
export const MY_PURPLE = "#83048f";
export const MY_BLUE = "#027cbf";
export const MY_GREEN = "#118f2a";
export const MY_YELLOW_BRIGHT = "#f5a700";
export const MY_YELLOW = "#ad8200";
export const MY_ORANGE = "#c45200"
export const MY_RED = "#910d1d";

export function dealWithMultiShotAmmo(input: BallisticRating, projectileCount: number) {
    if (projectileCount === 1) {
        return (
            <span>
                {`${Math.max(1, Math.ceil(input.ThoraxHTK_avg))}.`}

                {`${Math.max(1, Math.ceil(input.HeadHTK_avg))}.`}

                {`${Math.max(1, Math.ceil(input.LegHTK_avg))} | `}
                {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
            </span>
        )
    }
    else {
        const renderTooltip = (props: any) => (
            <Tooltip id="button-tooltip" {...props}>
                Num. pellets: {input.ThoraxHTK_avg.toFixed(0)}.{input.HeadHTK_avg.toFixed(0)}.{input.LegHTK_avg.toFixed(0)}
            </Tooltip>
        );

        return (
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
                <span>
                    {/* thorax shells */}
                    {`${Math.max(1, Math.ceil(input.ThoraxHTK_avg / projectileCount)).toFixed(0)}.`}

                    {/* head shells */}
                    {`${Math.max(1, Math.ceil(input.HeadHTK_avg / projectileCount)).toFixed(0)}.`}

                    {/* leg shells */}
                    {`${Math.max(1, Math.ceil(input.LegHTK_avg / projectileCount)).toFixed(0)} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            </OverlayTrigger>

        )
    }
}

export function deltaToolTip(current: number, initial: number, unit?: string) {
    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            Initial: {initial.toFixed(0)} {unit}<br />
            Δ: {(current - initial).toFixed(2)} {unit} <br />
            Current: {current.toFixed(2)} {unit}

        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <span>
                {current.toFixed(1)} {unit}
            </span>
        </OverlayTrigger>

    )
}
export function deltaToolTipElement(current: number, initial: number, element: JSX.Element) {
    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            Initial: {initial.toFixed(0)} <br />
            Δ: {(current - initial).toFixed(2)} <br />
            Current: {current.toFixed(2)}

        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <span>
                {element}
            </span>
        </OverlayTrigger>
    )
}

export function ArmorDamageToolTipElement(penetration: number, ArmorDamagePerc: number) {
    const renderTooltip = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            Penetration: {penetration.toFixed(2)}<br />
            × ArmorDamage: {(ArmorDamagePerc)}% <br />
            = Effective Durability Damage <br />
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 250, hide: 400 }}
            overlay={renderTooltip}
        >
            <span>
                {(penetration * (ArmorDamagePerc / 100)).toFixed(1)}
            </span>
        </OverlayTrigger>
    )
}

export function TraderToolTipElement(input: PurchaseOffer) {
    const renderTooltip = (props: PurchaseOffer) => (
        <Tooltip id="button-tooltip" {...props}>
            Trader: {props.Vendor} <br />
            Req Trader Level: {props.MinVendorLevel} <br />

            Req Player Level: {props.ReqPlayerLevel} <br />
            {(props.OfferType === OfferType.Cash && (
                <>
                    Currency: {props.Currency} <br />
                    Price: {(props.Price)} <br />
                </>
            ))}
            {(props.OfferType === OfferType.Barter && (
                <>
                    This is a barter offer.<br />
                </>
            ))}
            {(props.Currency !== "RUB" && (
                <>
                    ₽ equiv: {props.PriceRUB} <br />
                </>
            ))}
        </Tooltip>
    );

    var content;

    if (input !== null) {
        content = (
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip(input)}
            >
                <span>
                    {getTraderConditionalCell(input.MinVendorLevel)}
                </span>

            </OverlayTrigger>
        )
    }
    else {
        content = (
            <>n/a</>
        )
    }

    return (
        <>
            {content}
        </>

    )
}

export function getTraderConditionalCell(input: number) {
    if (input === 1) {
        return <span style={{ color: MY_ORANGE }}>{(input)}</span>
    }
    else if (input === 2) {
        return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input)}</span>
    }
    else if (input === 3) {
        return <span style={{ color: MY_GREEN }}>{(input)}</span>
    }
    else if (input === 4) {
        return <span style={{ color: MY_BLUE }}>{(input)}</span>
    }
    else {
        return <>n/a</>
    }
}


export function getEffectivenessColorCode(input: number, projectileCount: number) {
    var thoraxSTK = input;
    if (projectileCount > 1) {
        thoraxSTK = Math.ceil(thoraxSTK / projectileCount)
    }

    if (thoraxSTK === 1) {
        return MY_PURPLE
    }
    else if (thoraxSTK === 2) {
        return MY_BLUE
    }
    else if (thoraxSTK <= 4) {
        return MY_GREEN
    }
    else if (thoraxSTK <= 6) {
        return MY_YELLOW
    }
    else if (thoraxSTK <= 8) {
        return MY_ORANGE
    }
    else {
        return MY_RED
    }
}
export function getEffectivenessColorCodeString(input: string, projectileCount: number) {
    var thoraxSTK = Number.parseInt(input.split(".").at(0)!, 10);
    if (projectileCount > 1) {
        thoraxSTK = Math.ceil(thoraxSTK / projectileCount)
    }

    if (thoraxSTK === 1) {
        return MY_PURPLE
    }
    else if (thoraxSTK === 2) {
        return MY_BLUE
    }
    else if (thoraxSTK <= 4) {
        return MY_GREEN
    }
    else if (thoraxSTK <= 6) {
        return MY_YELLOW
    }
    else if (thoraxSTK <= 8) {
        return MY_ORANGE
    }
    else {
        return MY_RED
    }
}

export function damageConditionalColour(input: number) {
    if (input >= 146) {
        return <span style={{ color: MY_VIOLET }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    }
    else if (input >= 110) {
        return <span style={{ color: MY_BLUE }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
    }
    else if (input >= 73) {
        return <span style={{ color: MY_GREEN }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
    }
    else if (input >= 55) {
        return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
    }
    else if (input >= 43) {
        return <span style={{ color: MY_ORANGE }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
    }
    else {
        return <span style={{ color: "red" }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
    }
}

export function penetrationConditionalColour(input: number) {
    if (input >= 57) {
        return <span style={{ color: MY_VIOLET }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    }
    else if (input >= 47) {
        return <span style={{ color: MY_BLUE }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    }
    else if (input >= 37) {
        return <span style={{ color: "green" }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    }
    else if (input >= 27) {
        return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    }
    else if (input >= 17) {
        return <span style={{ color: MY_ORANGE }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    }
    else {
        return <span style={{ color: "red" }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
    }
}

export function fragmentationCutoff(input: number, penetration: number) {
    if (penetration >= 20) {
        return input;
    }
    else {
        return 0;
    }
}

export function fragmentationConditionalColour(input: number) {
    if (input > .59) {
        return <span style={{ color: MY_VIOLET }}>{(input * 100).toFixed(0)} %</span>
    }
    else if (input > .49) {
        return <span style={{ color: MY_BLUE }}>{(input * 100).toFixed(0)} %</span>
    }
    else if (input > .29) {
        return <span style={{ color: "green" }}>{(input * 100).toFixed(0)} %</span>
    }
    else if (input > .19) {
        return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input * 100).toFixed(0)} %</span>
    }
    else if (input > .09) {
        return <span style={{ color: MY_ORANGE }}>{(input * 100).toFixed(0)} %</span>
    }
    else if (input === 0) {
        return <></>
    }
    else {
        return <span style={{ color: "red" }}>{(input * 100).toFixed(0)} %</span>
    }
}
export function greenRedOrNothing(input: number) {
    if (input > 0) {
        return <span style={{ color: "green" }}>+{(input).toLocaleString()}</span>
    }
    else if (input < 0) {
        return <span style={{ color: "red" }}>{(input).toLocaleString()}</span>
    }
    else {
        return <></>
    }
}
export function negativeGreen_PositiveRed_OrNothing(input: number) {
    if (input < 0) {
        return <span style={{ color: "green" }}>{(input).toLocaleString()}</span>
    }
    else if (input > 0) {
        return <span style={{ color: "red" }}>+{(input).toLocaleString()}</span>
    }
    else {
        return <></>
    }
}

export function positiveGreenOrNothing_Percent(input: number) {
    if (input > 0) {
        return <span style={{ color: "green" }}>{(input * 100).toLocaleString()} %</span>
    }
    else {
        return <></>
    }
}

export function trimCaliber(input: string) {
    return input.substring(7);
}

// Unfortunately, MRT goes by the value, not what the displayed value is.
export function RenameCaliber(input: string) {
    switch (input) {
        case "Caliber545x39":
            return "5.45x39mm"

        case "Caliber762x54R":
            return "7.62x54mmR"

        case "Caliber556x45NATO":
            return "5.56x45mm"

        case "Caliber762x51":
            return "7.62x51mm"

        case "Caliber12g":
            return "12 Gauge"

        case "Caliber762x39":
            return "7.62x39mm"

        case "Caliber86x70":
            return ".338 Lapua"

        case "Caliber57x28":
            return "5.7x28mm"

        case "Caliber762x35":
            return ".300 Blk"

        case "Caliber46x30":
            return "4.6x30mm"

        case "Caliber9x18PM":
            return "9x18mm"

        case "Caliber9x19PARA":
            return "9x19mm"

        case "Caliber366TKM":
            return ".366 TKM"

        case "Caliber9x21":
            return "9x21mm"

        case "Caliber762x25TT":
            return "7.62x25mm"

        case "Caliber9x33R":
            return ".357 Mag"

        case "Caliber127x55":
            return "12.7x55mm"

        case "Caliber20g":
            return "20 Gauge"

        case "Caliber23x75":
            return "23x75mm"
        case "Caliber40x46":
            return "40x46mm"

        default:
            return input
    }
}