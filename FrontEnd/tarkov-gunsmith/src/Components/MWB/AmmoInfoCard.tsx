import { Card, CardContent } from '@mui/material';
import { useContext } from 'react';
import { MwbContext } from '../../Context/ContextMWB';

import { LinkContainer } from 'react-router-bootstrap';
import { LINKS } from '../../Util/links';
import { currencyStringToSymbol } from '../Common/helpers';
import { Button } from 'react-bootstrap';

export default function AmmoInfoCard() {
    const {
        result,
    } = useContext(MwbContext);

    if (result !== undefined)
    {
        let RoF = result.BasePreset?.Weapon.bFirerate;

        if (result.BasePreset?.Weapon.weapFireType.length === 1 && result.BasePreset?.Weapon.weapFireType[0].includes("Single")) {
            RoF = result.BasePreset?.Weapon.SingleFireRate;
        }
        return (
            <Card sx={{ marginTop: "5px" }}>
                <CardContent>
                    <table style={{ width: "100%" }}>
                        <tbody>
                            <tr >
                                <th colSpan={2} style={{ textAlign: "center" }} >Ammo: "{result.PurchasedAmmo.Ammo.Name}"</th>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Rate of Fire:</td>
                                <td style={{ textAlign: "center" }}> {RoF}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Damage:</td>
                                <td style={{ textAlign: "center" }}>{result.PurchasedAmmo.Ammo.Damage}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Penetration:</td>
                                <td style={{ textAlign: "center" }}> {result.PurchasedAmmo.Ammo.PenetrationPower}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Armor Damage %:</td>
                                <td style={{ textAlign: "center" }}>{result.PurchasedAmmo.Ammo.ArmorDamage}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>EAHP Damage:</td>
                                <td style={{ textAlign: "center" }}>{((result.PurchasedAmmo.Ammo.ArmorDamage / 100) * result.PurchasedAmmo.Ammo.PenetrationPower).toFixed(1)}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Frag Chance:</td>
                                <td style={{ textAlign: "center" }}>{(result.PurchasedAmmo.Ammo.FragmentationChance * 100).toFixed(0)}%</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Ammo Recoil:</td>
                                <td style={{ textAlign: "center" }}>{result.PurchasedAmmo.Ammo.ammoRec}</td>
                            </tr>
                            <tr style={{ borderBottom: "1px solid #ddd" }}>
                                <td>Trader:</td>
                                <td style={{ textAlign: "center" }}>{result.PurchasedAmmo?.PurchaseOffer?.Vendor} {result.PurchasedAmmo?.PurchaseOffer?.MinVendorLevel}</td>
                            </tr>
                            {result.PurchasedAmmo?.PurchaseOffer?.OfferType === 2 && (
                                <>
                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                        <td>Cost:</td>
                                        <td style={{ textAlign: "center" }}>
                                            {currencyStringToSymbol(result.PurchasedAmmo?.PurchaseOffer?.Currency)} {result.PurchasedAmmo?.PurchaseOffer?.Price.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                            {result.PurchasedAmmo?.PurchaseOffer?.Currency !== "RUB" && (
                                                <> (₽{result.PurchasedAmmo?.PurchaseOffer?.PriceRUB})</>
                                            )}
                                        </td>
                                    </tr>
                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                        <td>Mag of 30:</td>
                                        <td style={{ textAlign: "center" }}>
                                            {currencyStringToSymbol(result.PurchasedAmmo?.PurchaseOffer?.Currency)} {(result.PurchasedAmmo?.PurchaseOffer?.Price * 30).toLocaleString("en-US", { maximumFractionDigits: 0 })}
                                            {result.PurchasedAmmo?.PurchaseOffer?.Currency !== "RUB" && (
                                                <> (₽{(result.PurchasedAmmo?.PurchaseOffer?.PriceRUB * 30).toLocaleString("en-US", { maximumFractionDigits: 0 })})</>
                                            )}
                                        </td>
                                    </tr>
                                </>
                            )}
                            {result.PurchasedAmmo?.PurchaseOffer?.OfferType === 3 && (
                                <>
                                    <tr style={{ borderBottom: "1px solid #ddd" }}>
                                        <td>Barter in RUB equiv:</td>
                                        <td style={{ textAlign: "center" }}>
                                            <>₽{result.PurchasedAmmo?.PurchaseOffer?.PriceRUB.toLocaleString("en-US", { maximumFractionDigits: 0 })}</>
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                    <br />
                    {result.PurchasedAmmo !== undefined && (
                        <div className="d-grid gap-2">
                            <LinkContainer to={`${LINKS.AMMO_VS_ARMOR}/${result.PurchasedAmmo.Ammo.Id}`}>
                                <Button variant="outline-info" style={{ paddingTop: "5px", width: "100%" }}>
                                    See in Ammo vs Armor
                                </Button>
                            </LinkContainer>
                        </div>
                    )}

                </CardContent>
            </Card>
        )
    }
        
    else
        return <></>
}