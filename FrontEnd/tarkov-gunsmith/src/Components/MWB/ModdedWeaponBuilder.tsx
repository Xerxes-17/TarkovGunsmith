import { useState } from "react";
import { Row, Col, Form, Button, Stack, Container, Modal, Card, Spinner } from "react-bootstrap";
import Select from 'react-select'
import { requestWeaponBuild } from "../../Context/Requests";
import FilterRangeSelector from "../Forms/FilterRangeSelector";
import Mod from "./Mod";
import SelectSingleWeapon from "./SelectSingleWeapon";
import { WeaponOption, filterStockWeaponOptions, StockWeaponOptions, TransmissionWeaponBuildResult, TransmissionAttachedMod, sortStockWeaponOptions } from './WeaponData';

// Renders the home
export default function ModdedWeaponBuilder(props: any) {
    const [chosenGun, setChosenGun] = useState<any>(null);

    const [playerLevel, setPlayerLevel] = useState(15); // Need to make these values be drawn from something rather than magic numbers

    const [muzzleMode, setLoudOrSilenced] = useState(1); // Need to make these values be drawn from something rather than magic numbers

    const [ergoOrRecoil, setErgoOrRecoil] = useState(2); // Need to make these values be drawn from something rather than magic numbers

    const [filteredStockWeaponOptions, setFilteredStockWeaponOptions] = useState(filterStockWeaponOptions(15));

    const [result, setResult] = useState<TransmissionWeaponBuildResult>();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function handlePlayerLevelChange(input: number) {
        setPlayerLevel(input);
        setFilteredStockWeaponOptions(filterStockWeaponOptions(input));

        if (!filterStockWeaponOptions(input).includes(chosenGun)) {
            setChosenGun(null);
        }
    }

    const handleSubmit = (e: any) => {
        e.preventDefault();
        var temp = "";
        if (ergoOrRecoil === 1) {
            temp = "ergo"
        }
        else {
            temp = "recoil"
        }

        const requestDetails = {
            level: playerLevel,
            mode: temp,
            muzzleMode: muzzleMode,
            searchString: chosenGun.Value
        }
        requestWeaponBuild(requestDetails).then(response => {
            console.log(response);
            setResult(response[0]);
        }).catch(error => {
            alert(`The error was: ${error}`);
            console.log(error);
        });
    }

    const handleWeaponSelectionChange = (selectedOption: any) => {
        console.log(selectedOption);

        if (selectedOption !== undefined || selectedOption !== null) {
            setChosenGun(selectedOption)
            console.log(`Option selected:`, selectedOption);
        }
        else {
            setChosenGun(undefined)
        }
    }

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
                    <p>If a mod has a cost of 0, it can only be bought as part of the default stock build/gun, for example, the AKS-74U hand guard or ADAR charging handle.</p>
                    <p>Optics and tactical devices aren't included as they are down to personal preference.</p>
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
                        getOptionLabel={(option) => option.Label}
                        getOptionValue={(option) => option.Value}
                        formatOptionLabel={option => (
                            <>{option.Label}
                            </>
                        )}
                        onChange={handleWeaponSelectionChange}
                    />
                </Row>
            </div>
        </>
    )

    let TopSection = (
        <Col xl={5}>
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
                            label={"Player Level - Filters Possible Weapons and Mods"}
                            value={playerLevel}
                            changeValue={handlePlayerLevelChange}
                            min={1}
                            max={50}
                        />
                        <Form.Text style={{ color: "white" }}>Level 20 for LL 2 traders. Level 30 for LL3 Level 40 for LL4.</Form.Text>
                        <br /><br />

                        {SelectSingleWeapon}
                        <br />
                        <FilterRangeSelector
                            label={"1-Loud, 2-silenced, 3-any."}
                            value={muzzleMode}
                            changeValue={setLoudOrSilenced}
                            min={1}
                            max={3}
                        />
                        <FilterRangeSelector
                            label={"1-Ergo or 2-recoil priority?"}
                            value={ergoOrRecoil}
                            changeValue={setErgoOrRecoil}
                            min={1}
                            max={2}
                        />
                        <Button variant="primary" type="submit" className='form-btn'>
                            Build!
                        </Button>
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
                            {result.shortName}
                            <div className="ms-auto">
                                <Button variant="outline-secondary" disabled id="YouCan'tSeeMe">
                                    .
                                </Button>
                            </div>
                        </Stack>
                    </Card.Header>
                    <Card.Body>
                        <div style={{ textAlign: "center" }}>
                            <Row className="weapon-stats-box">
                                <Col>
                                    <img src={`https://assets.tarkov.dev/${result.id}-grid-image.jpg`} alt={result.shortName} className={"mod_img"} />
                                </Col>
                                <Col>
                                    <strong> Weapon Price<br /> </strong>
                                    ₽{result.priceRUB.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}<br />
                                </Col>
                                <Col>
                                    <strong> Rate of Fire <br /></strong>
                                    {result.rateOfFire}
                                </Col>
                            </Row>
                            <Row>

                                <Col className="hidden-stats-box">
                                    <h5>Convergence</h5>
                                    🔽 {result.convergence.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })} <br />
                                    <h5>Recoil Dispersion</h5>
                                    ◀▶ {result.recoilDispersion}
                                </Col>

                                <Col className="initial-stats-box">
                                    <h5>Base Ergonomics</h5>
                                    ✍ {result.baseErgo}
                                    <h5>Base Recoil</h5>
                                    ⏫ {result.baseRecoil}
                                </Col>

                                <Col className="final-stats-box">
                                    <h5>Final Ergonomics</h5>
                                    ✍ {result.finalErgo}
                                    <h5>Final Recoil</h5>
                                    ⏫ {result.finalRecoil}
                                </Col>
                            </Row>
                            <Row className="ammo-stats-box">
                                <Col>
                                    <h5>Selected Round</h5>
                                    <strong> {result.selectedPatron.shortName} </strong> <br />
                                </Col>
                                <Col>
                                    <strong>Damage</strong> <br />
                                    {result.selectedPatron.damage}<br />
                                    <strong>Frag Chance</strong><br />
                                </Col>
                                <Col>
                                    <strong>Penetration</strong>  <br />
                                    {result.selectedPatron.penetration}<br />
                                    <strong> ArmorDam%</strong> <br />
                                    {result.selectedPatron.armorDamagePerc}<br />
                                </Col>
                            </Row>
                        </div>
                        <Row className='modBoxes'>
                            {result.attachedModsFLat.map((item: TransmissionAttachedMod, i: number) => {
                                return (
                                    <Mod key={JSON.stringify(item)} item={item} i={i} />
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

                                    <span className="visually-hidden"> Waiting for build!</span>
                                </Spinner>
                                <div className="vr" />
                                Waiting for build!
                            </Stack>

                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    let content = (
        <>
            <div className="row gy-2">
                {TopSection}
                {ResultsSection}
            </div>
        </>
    );
    return (
        content
    );
}