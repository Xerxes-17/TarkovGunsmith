import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { BallisticRating, OfferType, PurchaseOffer, TargetZoneDisplayAEC } from "./AEC_Interfaces";

export const MY_VIOLET = "#fc03f4";
export const MY_PURPLE = "#83048f";
export const MY_BLUE = "#027cbf";
export const MY_GREEN = "#118f2a";
export const MY_YELLOW_BRIGHT = "#f5a700";
export const MY_YELLOW = "#ad8200";
export const MY_ORANGE = "#c45200"
export const MY_RED = "#910d1d";


export function displaySelectedTargetZone(displayMode: TargetZoneDisplayAEC, input: BallisticRating) {
    switch (displayMode) {
        case TargetZoneDisplayAEC.Classic:
            return (
                <span>
                    {`${input.ThoraxHTK_avg}.`}
                    {`${input.HeadHTK_avg}.`}
                    {`${input.LegHTK_avg} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
        case TargetZoneDisplayAEC.Head:
            return (
                <span>
                    {`${input.HeadHTK_avg} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
        case TargetZoneDisplayAEC.Thorax:
            return (
                <span>
                    {`${input.ThoraxHTK_avg} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
        case TargetZoneDisplayAEC.Legs:
            return (
                <span>
                    {`${input.LegHTK_avg} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
        default:
            return (
                <span>
                    Something is wrong
                    {`${input.ThoraxHTK_avg}.`}
                    {`${input.HeadHTK_avg}.`}
                    {`${input.LegHTK_avg} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
    }
}

export function MultiProjToolTipContentSelector(displayMode: TargetZoneDisplayAEC, input: BallisticRating) {
    switch (displayMode) {
        case TargetZoneDisplayAEC.Classic:
            return (
                <>Num. pellets: {input.ThoraxHTK_avg.toFixed(0)}.{input.HeadHTK_avg.toFixed(0)}.{input.LegHTK_avg.toFixed(0)}</>
            )
        case TargetZoneDisplayAEC.Head:
            return (
                <>Num. pellets: {input.HeadHTK_avg.toFixed(0)}</>
            )
        case TargetZoneDisplayAEC.Thorax:
            return (
                <>Num. pellets: {input.ThoraxHTK_avg.toFixed(0)}</>
            )
        case TargetZoneDisplayAEC.Legs:
            return (
                <>Num. pellets: {input.LegHTK_avg.toFixed(0)}</>
            )
        default:
            return (
                <>Something wrong: {input.ThoraxHTK_avg.toFixed(0)}.{input.HeadHTK_avg.toFixed(0)}.{input.LegHTK_avg.toFixed(0)}</>
            )
    }
}

export function MultiProjToolMainSpanSelector(displayMode: TargetZoneDisplayAEC, input: BallisticRating, projectileCount: number) {
    switch (displayMode) {
        case TargetZoneDisplayAEC.Classic:
            return (
                <span>
                    {`${Math.max(1, Math.ceil(input.ThoraxHTK_avg / projectileCount)).toFixed(0)}.`}
                    {`${Math.max(1, Math.ceil(input.HeadHTK_avg / projectileCount)).toFixed(0)}.`}
                    {`${Math.max(1, Math.ceil(input.LegHTK_avg / projectileCount)).toFixed(0)} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
        case TargetZoneDisplayAEC.Head:
            return (
                <span>
                    {`${Math.max(1, Math.ceil(input.HeadHTK_avg / projectileCount)).toFixed(0)} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
        case TargetZoneDisplayAEC.Thorax:
            return (
                <span>
                    {`${Math.max(1, Math.ceil(input.ThoraxHTK_avg / projectileCount)).toFixed(0)} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
        case TargetZoneDisplayAEC.Legs:
            return (
                <span>
                    {`${Math.max(1, Math.ceil(input.LegHTK_avg / projectileCount)).toFixed(0)} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
        default:
            return (
                <span>
                    {`${Math.max(1, Math.ceil(input.ThoraxHTK_avg / projectileCount)).toFixed(0)}.`}
                    {`${Math.max(1, Math.ceil(input.HeadHTK_avg / projectileCount)).toFixed(0)}.`}
                    {`${Math.max(1, Math.ceil(input.LegHTK_avg / projectileCount)).toFixed(0)} | `}
                    {`${(input.FirstHitPenChance * 100).toFixed(0)}%`}
                </span>
            )
    }
}

export function dealWithMultiShotAmmo(displayMode: TargetZoneDisplayAEC, input: BallisticRating, rowOriginal: any, distanceIndex:number) {
    const projectileCount = rowOriginal.Ammo.ProjectileCount;
    const details = rowOriginal.Details[distanceIndex]
    const renderTooltipSingleShot = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            <>
                Damage if 1st hit penetrates<br />
                including armor mitigation: <br />
                {input.FirstHitPenetrationDamage.toFixed(2)} <br />
                Δ: {(input.FirstHitPenetrationDamage - details.Damage).toFixed(2)}<br />
            </>
        </Tooltip>
    );
    const renderTooltipMultiShot = (props: any) => (
        <Tooltip id="button-tooltip" {...props}>
            {MultiProjToolTipContentSelector(displayMode, input)}
        </Tooltip>
    );

    if (projectileCount === 1) {
        var content;
        if (input.FirstHitPenChance > 0) {
            content = (
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltipSingleShot}
                >
                    {displaySelectedTargetZone(displayMode, input)}
                </OverlayTrigger>
            )
        }
        else {
            content = (
                <>
                    {displaySelectedTargetZone(displayMode, input)}
                </>
            )
        }
        return (
            <>
                {content}
            </>
        )
    }
    else {
        return (
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltipMultiShot}
            >
                {MultiProjToolMainSpanSelector(displayMode, input, projectileCount)}
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


export function getEffectivenessColorCode(displayMode: TargetZoneDisplayAEC, input: any, projectileCount: number) {
    var selectedSTK = -1;
    switch (displayMode) {
        case TargetZoneDisplayAEC.Classic:
            selectedSTK = input.ThoraxHTK_avg;
            break;

        case TargetZoneDisplayAEC.Head:
            selectedSTK = input.HeadHTK_avg;
            break;

        case TargetZoneDisplayAEC.Thorax:
            selectedSTK = input.ThoraxHTK_avg;
            break;

        case TargetZoneDisplayAEC.Legs:
            selectedSTK = input.LegHTK_avg;
            break;

        default:
            selectedSTK = input.ThoraxHTK_avg;
            break;
    }

    if (projectileCount > 1) {
        selectedSTK = Math.ceil(selectedSTK / projectileCount)
    }

    if (selectedSTK === 1) {
        return MY_PURPLE
    }
    else if (selectedSTK === 2) {
        return MY_BLUE
    }
    else if (selectedSTK <= 4) {
        return MY_GREEN
    }
    else if (selectedSTK <= 6) {
        return MY_YELLOW
    }
    else if (selectedSTK <= 8) {
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