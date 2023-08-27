import { Card, CardContent } from '@mui/material';
import { useContext } from 'react';
import { MwbContext } from '../../Context/ContextMWB';

export default function MarketInfoCard() {
    const {
        result,
    } = useContext(MwbContext);

    if (result !== undefined)
        return (
            <Card>
                <CardContent>
                    <table style={{ padding: "5px", width: "100%" }}>
                        <tbody>
                            <tr >
                                <th colSpan={2} style={{ textAlign: "center" }} >Market Info / Costs</th>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Final Cost:</td>
                                <td style={{ textAlign: "right" }}>₽{result.TotalRubleCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Preset Cost:</td>
                                <td style={{ textAlign: "right" }}>₽{result.BasePreset?.PurchaseOffer?.PriceRUB.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Purchased Mods Cost:</td>
                                <td style={{ textAlign: "right" }}>₽{result.PurchasedModsCost.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Preset Mods Refund:</td>
                                <td style={{ textAlign: "right" }}>₽{result.PresetModsRefund.toLocaleString("en-US", { maximumFractionDigits: 0 })}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Trader:</td>
                                <td style={{ textAlign: "right" }}>{result.BasePreset?.PurchaseOffer?.Vendor} {result.BasePreset?.PurchaseOffer?.MinVendorLevel}</td>
                            </tr>
                        </tbody>

                    </table>
                </CardContent>
            </Card>
        )
    else
        return <></>
}