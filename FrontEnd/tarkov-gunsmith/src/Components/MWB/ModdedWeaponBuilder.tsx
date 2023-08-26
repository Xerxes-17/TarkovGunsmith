import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Stack, Modal, Card, Spinner, ToggleButtonGroup, ToggleButton, Alert, Container } from "react-bootstrap";
import Select from 'react-select'
import { requestWeaponBuild, requestWeaponDataCurve } from "../../Context/Requests";
import { API_URL } from "../../Util/util";
import FilterRangeSelector from "../Forms/FilterRangeSelector";
import Mod from "./Mod";
import { Fitting } from './WeaponData';
import ImageWithDefaultFallback from '../Common/ImageWithFallBack';

enum OfferType {
    None,
    Sell,
    Cash,
    Barter,
    Flea
}

enum fitPriority
{
    MetaRecoil = "MetaRecoil",
    Recoil = "Recoil",
    MetaErgonomics = "MetaErgonomics",
    Ergonomics= "Ergonomics"
}

enum MuzzleType
{
    Loud,
    Quiet,
    Any
}

export default function ModdedWeaponBuilder(props: any) {
    

    interface WeaponOption {
        ergonomics: number;
        recoilForceUp: number;
        recoilAngle: number;
        recoilDispersion: number;
        convergence: number;
        ammoCaliber: string;
        bFirerate: number;
        traderLevel: number;
        requiredPlayerLevel: number;
        value: string;
        readonly label: string;
        readonly imageLink: string;
        offerType: OfferType;
        priceRUB: number;
    }

    interface CurveDataPoint {
        level: number,
        recoil: number,
        ergo: number,
        price: number,
        penetration: number,
        damage: number,
        invalid: Boolean
    };

    const [playerLevel, setPlayerLevel] = useState(15); // Need to make these values be drawn from something rather than magic numbers
    const [WeaponOptions, setWeaponOptions] = useState<WeaponOption[]>([]);

    const [PurchaseOfferTypes, setPurchaseOfferTypes] = useState([OfferType.Cash])
    const handlePOTChange = (val: any) => setPurchaseOfferTypes(val);

    const [checkedFlea, setCheckedFlea] = useState(false);


    // This useEffect will update the WeaponOptions with the result from the async API call
    useEffect(() => {
        weapons();
    }, [])

    // This useEffect will watch for a change to WeaponOptions or playerLevel, then update the filteredStockWeaponOptions
    useEffect(() => {
        const result = WeaponOptions.filter(item =>
            item.requiredPlayerLevel <= playerLevel
            && PurchaseOfferTypes.includes(item.offerType)

        )
        setFilteredStockWeaponOptions(result)

    }, [WeaponOptions, playerLevel, PurchaseOfferTypes])

    useEffect(() => {
        updateTraderLevels(playerLevel)
    }, [playerLevel])

    const weapons = async () => {
        const response = await fetch(API_URL + '/GetWeaponOptionsList');
        // // console.log(response)
        setWeaponOptions(await response.json())
    }

    function filterStockWeaponOptions(playerLevel: number) {
        const result = WeaponOptions.filter(item =>
            item.requiredPlayerLevel <= playerLevel
        )
        // Expand on this later.
        return result;
    }

    const [filteredStockWeaponOptions, setFilteredStockWeaponOptions] = useState(filterStockWeaponOptions(playerLevel));

    const [chosenGun, setChosenGun] = useState<any>(null);

    const [result, setResult] = useState<Fitting>();

    function handlePlayerLevelChange(input: number) {
        setPlayerLevel(input);
        setFilteredStockWeaponOptions(filterStockWeaponOptions(input));

        if (!filterStockWeaponOptions(input).includes(chosenGun)) {
            setChosenGun(null);
        }
    }

    const [praporLevel, setPraporLevel] = useState(1);
    const [skierLevel, setSkierLevel] = useState(1);
    const [mechanicLevel, setMechanicLevel] = useState(1);
    const [peacekeeperLevel, setPeacekeeperLevel] = useState(1);
    const [jaegerLevel, setJaegerLevel] = useState(1);
    

    function updateTraderLevels(playerLevel: number) {
        let prapor = 1;
        let skier = 1;
        let mechanic = 1;
        let peacekeeper = 1;
        let jaeger = 1;

        if (playerLevel >= 14) {
            peacekeeper = 2;
        }
        if (playerLevel >= 15) {
            prapor = 2;
            skier = 2;
            jaeger = 2;
        }
        if (playerLevel >= 20) {
            mechanic = 2;
        }

        // level 3 traders
        if (playerLevel >= 22) {
            jaeger = 3;
        }
        if (playerLevel >= 23) {
            peacekeeper = 3;
        }
        if (playerLevel >= 26) {
            prapor = 3;
        }
        if (playerLevel >= 28) {
            skier = 3;
        }
        if (playerLevel >= 30) {
            mechanic = 3;
        }

        // level 4 traders
        if (playerLevel >= 33) {
            jaeger = 4;
        }
        if (playerLevel >= 36) {
            prapor = 4;
        }
        if (playerLevel >= 37) {
            peacekeeper = 4;
        }
        if (playerLevel >= 38) {
            skier = 4;
        }
        if (playerLevel >= 40) {
            mechanic = 4;
        }

        setPraporLevel(prapor);
        setSkierLevel(skier);
        setMechanicLevel(mechanic);
        setPeacekeeperLevel(peacekeeper);
        setJaegerLevel(jaeger);
    }
    const [MuzzleModeToggle, setMuzzleModeToggle] = useState(1);
    const handleMDMChange = (val: any) => setMuzzleModeToggle(val);

    const [FittingPriority, setFittingPriority] = useState<"MetaRecoil" | "Recoil" | "MetaErgonomics" | "Ergonomics">("Recoil");
    const handleFPChange = (val: any) => setFittingPriority(val);

    const [fittingCurve, setFittingCurve] = useState<CurveDataPoint[]>();
    const [waitingForCurve, setWaitingForCurve] = useState(false);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const parsed = fitPriority[FittingPriority];

        const requestDetails = {
            level: playerLevel,
            priority: parsed,
            muzzleMode: MuzzleModeToggle-1,
            presetId: chosenGun.value,
            flea: checkedFlea
        }
        requestWeaponBuild(requestDetails).then(response => {
            // // console.log(response)
            setResult(response);
        }).catch(error => {
            alert(`The error was: ${error}`);
            // // console.log(error);
        });

        // const curveRequestDetails = {
        //     presetID: chosenGun.value,
        //     mode: FittingPriority,
        //     muzzleMode: MuzzleModeToggle,
        //     purchaseType: chosenGun.offerType
        // }
        // setWaitingForCurve(true);
        // requestWeaponDataCurve(curveRequestDetails).then(response => {
        //     setWaitingForCurve(false);
        //     setFittingCurve(response);
        //     // // console.log(response);
        // }).catch(error => {
        //     alert(`The error was: ${error}`);
        //     setWaitingForCurve(false);
        // });


    }

    const handleWeaponSelectionChange = (selectedOption: any) => {
        //// console.log(selectedOption);

        if (selectedOption !== undefined || selectedOption !== null) {
            setChosenGun(selectedOption)
            // // console.log(`Option selected:`, selectedOption);
        }
        else {
            setChosenGun(undefined)
        }
    }

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    
    let ModalInfo = (
        <>
            <Button variant="info" onClick={handleShow}>
                Info
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Information - MWB</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>This tool will automatically build your selected weapon according to the selected parameters.</p>
                    <p>If you change the player level to one where the current weapon isn't available, it will be deselected.</p>
                    <p>You can search through the gun options by typing with the select input focused.</p>
                    <p>At the moment, weapons and modules are only available by Cash Offer from traders, this means no flea-market or barters.</p>
                    <p>
                        At the moment, you can select either a recoil or an ergo priority, and the other variable will be ignored.
                        The exception for this is muzzle breaks, which will always prioritize recoil for obvious reasons.
                        The cheapest option for the max effectiveness will also be chosen.
                    </p>
                    <p>You can select for a loud, silenced or either build. However do check if there is a silencer, as with certain level and weapon combos one might not be available.</p>
                    <p>If a mod has a cost of -1, it can only be bought as part of the default stock build/gun, for example, the AKS-74U hand guard or ADAR charging handle.</p>
                    <p>Optics, magazines and tactical devices aren't included as they are down to personal preference.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

    let SelectSingleWeapon = (
        <>
            <div className='black-text'>
                <Row>
                    <Select
                        value={chosenGun}
                        placeholder="Select your weapon..."
                        className="basic-single"
                        classNamePrefix="select"
                        required={true}
                        isClearable={true}
                        isSearchable={true}
                        name="SelectWeapon"
                        options={filteredStockWeaponOptions}
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value + option.offerType}
                        formatOptionLabel={option => (
                            <>
                                <Row>
                                    <Col auto={"true"}>{option.label}</Col>
                                </Row>
                                <Row>
                                    <Col xs={4}>{OfferType[option.offerType]} ₽{option.priceRUB.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</Col>
                                </Row>

                            </>
                        )}
                        onChange={handleWeaponSelectionChange}
                    />
                </Row>
            </div>
        </>
    )

    let TopSection = (
        <Col xl>
            <Card bg="dark" border="secondary" text="light" className="xl" >
                <Card.Header as="h2" >
                    <Stack direction="horizontal" gap={3}>
                        Modded Weapon Builder
                        <div className="ms-auto">
                            {ModalInfo}
                        </div>
                    </Stack>
                </Card.Header>
                <Card.Body style={{ height: "fit-content" }}>
                    <Form onSubmit={handleSubmit}>
                        <FilterRangeSelector
                            label={"Player Level - Changes access to purchase offers"}
                            value={playerLevel}
                            changeValue={handlePlayerLevelChange}
                            min={1}
                            max={40}
                        />


                        <Row>
                            <Col>
                                <Form.Text>Trader Levels</Form.Text><br />
                                <Stack direction="horizontal" gap={2} style={{ flexWrap: "wrap" }}>
                                    <Button disabled size="sm" variant="outline-info">
                                        <Stack direction="horizontal" gap={2} >
                                            {praporLevel}
                                            <div className="vr" />
                                            Prapor
                                        </Stack>
                                    </Button>
                                    <Button disabled size="sm" variant="outline-info">
                                        <Stack direction="horizontal" gap={2}>
                                            {skierLevel}
                                            <div className="vr" />
                                            Skier
                                        </Stack>
                                    </Button>
                                    <Button disabled size="sm" variant="outline-info">
                                        <Stack direction="horizontal" gap={2}>
                                            {mechanicLevel}
                                            <div className="vr" />
                                            Mechanic
                                        </Stack>
                                    </Button>
                                    <Button disabled size="sm" variant="outline-info">
                                        <Stack direction="horizontal" gap={2}>
                                            {peacekeeperLevel}
                                            <div className="vr" />
                                            Peacekeeper
                                        </Stack>
                                    </Button>
                                    <Button disabled size="sm" variant="outline-info">
                                        <Stack direction="horizontal" gap={2}>
                                            {jaegerLevel}
                                            <div className="vr" />
                                            Jaeger
                                        </Stack>
                                    </Button>
                                </Stack>

                                <br />
                                <Form.Label>Weapon Purchase Offer Filter</Form.Label><br />
                                <ToggleButtonGroup size="sm" type="checkbox" name="PurchaseOfferTypes" value={PurchaseOfferTypes} onChange={handlePOTChange} >
                                    <ToggleButton variant="outline-warning" id="tbg-radio-PO_Cash" value={OfferType.Cash}>
                                        Cash
                                    </ToggleButton>
                                    <ToggleButton variant="outline-warning" id="tbg-radio-PO_Barter" value={OfferType.Barter}>
                                        Barter
                                    </ToggleButton>
                                    <ToggleButton variant="outline-warning" id="tbg-radio-PO_Flea" value={OfferType.Flea}>
                                        Flea
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <br /><br />
                                
                            </Col>
                            <Col>
                                <Form.Label>Muzzle Device Mode</Form.Label><br />
                                <ToggleButtonGroup size="sm" type="radio" name="MuzzleDeviceMode" value={MuzzleModeToggle} onChange={handleMDMChange} >
                                    <ToggleButton variant="outline-primary" id="tbg-radio-MDM_Loud" value={1}>
                                        Loud
                                    </ToggleButton>
                                    <ToggleButton variant="outline-primary" id="tbg-radio-MDM_Silenced" value={2}>
                                        Silenced
                                    </ToggleButton>
                                    <ToggleButton variant="outline-primary" id="tbg-radio-MDM_Any" value={3}>
                                        Any
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <br /><br />

                                <Form.Label>Fitting Priority</Form.Label><br />
                                <ToggleButtonGroup size="sm" type="radio" name="FittingPriority" value={FittingPriority} onChange={handleFPChange}>
                                    <ToggleButton variant="outline-primary" id="tbg-radio-FP_recoil" value={"Recoil"}>
                                        Recoil
                                    </ToggleButton>
                                    <ToggleButton variant="outline-primary" id="tbg-radio-FP_MetaRecoil" value={"MetaRecoil"}>
                                        Meta Recoil
                                    </ToggleButton>
                                    <ToggleButton variant="outline-danger" id="tbg-radio-FP_Ergonomics" value={"Ergonomics"}>
                                        Ergonomics
                                    </ToggleButton>
                                    <ToggleButton variant="outline-danger" id="tbg-radio-FP_MetaErgonomics" value={"MetaErgonomics"}>
                                        Meta Ergonomics
                                    </ToggleButton>
                                </ToggleButtonGroup>
                                <br />
                                {/* <br />
                                <FormControlLabel control={<Switch checked={checkedFlea} onChange={(event) => setCheckedFlea(event.currentTarget.checked)} />} label="Allow Flea Market Mods?" /> */}
                            </Col>
                        </Row>
                        {WeaponOptions.length === 0 && (
                            <>
                                <br />
                                <div className="d-grid gap-2">
                                    <Button size="lg" variant="secondary" disabled>
                                        <Stack direction="horizontal" gap={2}>
                                            <Spinner animation="border" role="status">
                                            </Spinner>
                                            <div className="vr" />
                                            Getting weapon options...
                                        </Stack>
                                    </Button>
                                </div>
                                <br />
                            </>
                        )}
                        {WeaponOptions.length > 0 && (
                            <>
                                <br />
                                <strong>Available Choices:</strong> {filteredStockWeaponOptions.length} <br />
                                {SelectSingleWeapon}
                                <br />
                            </>
                        )}


                        <div className="d-grid gap-2">
                            <Button variant="success" type="submit" className='form-btn'>
                                Build!
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Col>
    )

    let ResultsSection;

    if (result !== undefined) {

        ResultsSection = (
            <Col xl>
                <Card bg="secondary" border="dark" text="light" className="xl">
                    <Card.Header as="h2">
                        <Stack direction="horizontal" gap={3}>
                            {result.BasePreset!.Weapon!.Name}
                            <div className="ms-auto">
                                <Button variant="outline-secondary" disabled id="YouCan'tSeeMe">
                                    .
                                </Button>
                            </div>
                        </Stack>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ textAlign: "center" }}>
                            {result.ValidityString !== '' &&
                                <>
                                    <Alert variant={"danger"}>
                                        Sorry, this build isn't valid! Please report it on the <a href="https://discord.gg/F7GZE4H7fq">discord</a>.
                                    </Alert>
                                </>}

                            <Row className="weapon-stats-box">
                                <Col>
                                    <ImageWithDefaultFallback src={`https://assets.tarkov.dev/${result.BasePreset!.Id.split("_")[0]}-grid-image.webp`} alt={result.BasePreset!.Weapon!.ShortName} className={"mod_img"} />
                                </Col>
                                <Col>
                                    <strong> Preset Price<br /> </strong>
                                    ₽ {result.BasePreset!.PurchaseOffer!.PriceRUB.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}<br />
                                </Col>

                                <Col>
                                    <strong> Purchased Mods Cost<br /> </strong>
                                    ₽ {result.PurchasedModsCost.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}<br />
                                </Col>
                                <Col>
                                    <strong> Preset Mods Refund<br /> </strong>
                                    ₽ -{result.PresetModsRefund.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}<br />
                                </Col>
                                <Col>
                                    <strong> Final Cost <br /> </strong>
                                    ₽ {result.TotalRubleCost.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}<br />
                                </Col>
                            </Row>
                            <Row>

                                <Col className="hidden-stats-box">
                                    <h5>Convergence</h5>
                                    🔽 {result.BasePreset!.Weapon!.Convergence.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} <br />
                                    <h5>Recoil Dispersion</h5>
                                    ◀▶ {result.BasePreset!.Weapon!.RecoilDispersion}
                                </Col>

                                <Col className="initial-stats-box">
                                    <h5>Base Ergonomics</h5>
                                    ✍ {result.BasePreset!.Ergonomics}
                                    <h5>Base Recoil</h5>
                                    ⏫ {result.BasePreset!.Recoil_Vertical}
                                </Col>

                                <Col className="final-stats-box">
                                    <h5>Final Ergonomics</h5>
                                    ✍ {result.Ergonomics}
                                    <h5>Final Recoil</h5>
                                    ⏫ {result.Recoil_Vertical}
                                </Col>
                            </Row>
                            <Row className="ammo-stats-box">
                                <Col>
                                    <strong> Rate of Fire <br /></strong>
                                    {result.BasePreset!.Weapon!.bFirerate} <br />
                                    <strong>Selected Round</strong><br />
                                    {result.PurchasedAmmo!.Ammo!.ShortName} <br />
                                </Col>
                                <Col>
                                    <strong>Damage</strong> <br />
                                    {result.PurchasedAmmo!.Ammo!.Damage}<br />
                                    <strong>Frag Chance</strong><br />
                                    {(result.PurchasedAmmo!.Ammo!.FragmentationChance * 100).toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })} %<br />
                                </Col>
                                <Col>
                                    <strong>Penetration</strong>  <br />
                                    {result.PurchasedAmmo!.Ammo!.PenetrationPower}<br />
                                    <strong> ArmorDam%</strong> <br />
                                    {result.PurchasedAmmo!.Ammo!.ArmorDamage}<br />
                                </Col>
                            </Row>
                        </div>
                        <Row className='modBoxes'>
                            {result.PurchasedMods!.List.map((item: any, i: number) => {
                                let itemKey = item.WeaponMod.Id.concat(i.toString())
                                return (
                                    <Mod key={itemKey} item={item} i={i} />
                                )
                            })}
                        </Row>

                    </Card.Body>
                </Card>
            </Col>
        )
    }
    else {
        ResultsSection = (
            <Col xl>
                <Card bg="secondary" border="light" text="light" className="xl">
                    <Card.Header as="h2">
                        <Stack direction="horizontal" gap={3}>
                            Result
                            <div className="ms-auto">
                                <Button variant="outline-secondary" disabled>
                                    .
                                </Button>
                            </div>
                        </Stack>
                    </Card.Header>
                    <Card.Body>
                        <Button variant="dark" disabled>
                            <Stack direction="horizontal" gap={2}>
                                <Spinner animation="grow" role="status" size="sm">

                                    <span className="visually-hidden">Awaiting build</span>
                                </Spinner>
                                <div className="vr" />
                                Awaiting build
                            </Stack>

                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    // let dataCurveSection = (
    //     <>
    //     </>
    // );
    // if (result !== undefined) {
    //     if (waitingForCurve === false) {
    //         // console.log(fittingCurve)
    //         dataCurveSection = (
    //             <Col xl>
    //                 <Card bg="dark" border="secondary" text="light" className="xl">

    //                     <Card.Header as="h3">
    //                         Stats curves of {result.ShortName} in mode "{FittingPriority}"
    //                     </Card.Header>
    //                     <Card.Body>
    //                         <div className='black-text'>
    //                             <ResponsiveContainer
    //                                 width="100%"
    //                                 height="100%"
    //                                 minWidth={200}
    //                                 minHeight={400}
    //                             >
    //                                 <ComposedChart
    //                                     width={800}
    //                                     height={400}
    //                                     data={fittingCurve}
    //                                     margin={{
    //                                         top: 5,
    //                                         right: 30,
    //                                         left: 20,
    //                                         bottom: 20,
    //                                     }}
    //                                 >
    //                                     <CartesianGrid strokeDasharray="7 7" />
    //                                     <XAxis
    //                                         dataKey={"level"}
    //                                         type="number"
    //                                         domain={[0, 40]}
    //                                     >
    //                                         <Label
    //                                             style={{
    //                                                 textAnchor: "middle",
    //                                                 fontSize: "100%",
    //                                                 fill: "white",
    //                                             }}
    //                                             position="bottom"
    //                                             value={"Player Level"} />
    //                                     </XAxis>
    //                                     <YAxis
    //                                         yAxisId="left"
    //                                         type="number"
    //                                     >
    //                                         <Label
    //                                             style={{
    //                                                 textAnchor: "middle",
    //                                                 fontSize: "100%",
    //                                                 fill: "white",
    //                                             }}
    //                                             angle={270}
    //                                             position="left"
    //                                             value={"Ergo / Recoil / Penetration"}
    //                                         />
    //                                     </YAxis>

    //                                     <YAxis
    //                                         yAxisId="right"
    //                                         orientation="right"
    //                                         dataKey="price"
    //                                         type="number"
    //                                         tickFormatter={(value: number) => value.toLocaleString("en-US")}
    //                                     >
    //                                         <Label
    //                                             style={{
    //                                                 textAnchor: "middle",
    //                                                 fontSize: "100%",
    //                                                 fill: "white",
    //                                             }}
    //                                             angle={270}
    //                                             position="right"
    //                                             value={"Price - ₽"}
    //                                             offset={15}
    //                                         />
    //                                     </YAxis>
    //                                     <YAxis
    //                                         domain={[1, 0]}
    //                                         yAxisId="BOOL"
    //                                         hide={true}
    //                                     />
    //                                     <Tooltip
    //                                         contentStyle={{ backgroundColor: "#dde9f0" }}
    //                                         formatter={function (value, name) {
    //                                             if (name === "price") {
    //                                                 return `${value.toLocaleString("en-US")} ₽`;
    //                                             }
    //                                             else {
    //                                                 return `${value}`;
    //                                             }

    //                                         }}
    //                                         labelFormatter={function (value) {
    //                                             return `level: ${value}`;
    //                                         }}

    //                                     />
    //                                     <Legend verticalAlign="top" />
    //                                     <Line yAxisId="right" type="monotone" dataKey="price" stroke="#faa107" activeDot={{ r: 8 }} />
    //                                     <Line yAxisId="left" type="monotone" dataKey="recoil" stroke="#239600" />
    //                                     <Line yAxisId="left" type="monotone" dataKey="ergo" stroke="#2667ff" />
    //                                     <Line yAxisId="left" type="monotone" dataKey="penetration" stroke="#7b26a3" />
    //                                     <Line yAxisId="left" type="monotone" dataKey="damage" stroke="#7bc9c9" />
    //                                     <Bar yAxisId="BOOL" dataKey="invalid" barSize={25} fill="red" />
    //                                 </ComposedChart >
    //                             </ResponsiveContainer>
    //                         </div>
    //                     </Card.Body>
    //                 </Card>
    //             </Col>
    //         )
    //     }

    //     else if (waitingForCurve === true) {
    //         dataCurveSection = (
    //             <Col xl>
    //                 <Card bg="dark" border="secondary" text="light" className="xl">

    //                     <Card.Header as="h3">
    //                         Stats curve of {result.ShortName} in mode "{FittingPriority}"
    //                     </Card.Header>
    //                     <Card.Body>
    //                         <Button variant="dark" disabled>
    //                             <Stack direction="horizontal" gap={2}>
    //                                 <Spinner animation="grow" role="status" size="sm">

    //                                     <span className="visually-hidden">Waiting for Stats Curve</span>
    //                                 </Spinner>
    //                                 <div className="vr" />
    //                                 Waiting for Stats Curve
    //                             </Stack>
    //                         </Button>
    //                     </Card.Body>
    //                 </Card>
    //             </Col>
    //         )
    //     }

    // }

    let content = (

        <Container className='main-app-container'>
            <div className="row gy-2">
                {TopSection}
            </div>
            <div className="row gy-2">
                {ResultsSection}
            </div>
            {/* <div className="row gy-2">
                {dataCurveSection}
            </div> */}
        </Container>
    );
    return (
        content
    );
}