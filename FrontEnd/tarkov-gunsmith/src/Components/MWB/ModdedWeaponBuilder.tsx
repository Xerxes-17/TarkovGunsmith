import { useEffect, useState } from "react";
import { Row, Col, Form, Button, Stack, Modal, Card, Spinner, ToggleButtonGroup, ToggleButton } from "react-bootstrap";
import Select from 'react-select'
import { requestWeaponBuild } from "../../Context/Requests";
import { API_URL } from "../../Util/util";
import FilterRangeSelector from "../Forms/FilterRangeSelector";
import Mod from "./Mod";
import { TransmissionWeaponBuildResult, TransmissionAttachedMod } from './WeaponData';

// Renders the home
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
    }

    const [playerLevel, setPlayerLevel] = useState(15); // Need to make these values be drawn from something rather than magic numbers
    const [WeaponOptions, setWeaponOptions] = useState<WeaponOption[]>([]);

    // This useEffect will update the WeaponOptions with the result from the async API call
    useEffect(() => {
        weapons();
    }, [])

    // This useEffect will watch for a change to WeaponOptions or playeLevel, then update the filteredStockWeaponOptions
    useEffect(() => {
        const result = WeaponOptions.filter(item =>
            item.requiredPlayerLevel <= playerLevel
        )
        setFilteredStockWeaponOptions(result)

    }, [WeaponOptions, playerLevel])

    useEffect(() => {
        updateTraderLevels(playerLevel)
    }, [playerLevel])

    const weapons = async () => {
        const response = await fetch(API_URL + '/GetWeaponOptionsList');
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

    const [result, setResult] = useState<TransmissionWeaponBuildResult>();

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

    const [FittingPriority, setFittingPriority] = useState("recoil");
    const handleFPChange = (val: any) => setFittingPriority(val);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const requestDetails = {
            level: playerLevel,
            mode: FittingPriority,
            muzzleMode: MuzzleModeToggle,
            searchString: chosenGun.value
        }
        requestWeaponBuild(requestDetails).then(response => {
            // console.log(response);
            setResult(response[0]);
        }).catch(error => {
            alert(`The error was: ${error}`);
            // console.log(error);
        });
    }

    const handleWeaponSelectionChange = (selectedOption: any) => {
        // console.log(selectedOption);

        if (selectedOption !== undefined || selectedOption !== null) {
            setChosenGun(selectedOption)
            // console.log(`Option selected:`, selectedOption);
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
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        formatOptionLabel={option => (
                            <>{option.label}
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
                            label={"Player Level - Changes access by trader level cash offer"}
                            value={playerLevel}
                            changeValue={handlePlayerLevelChange}
                            min={1}
                            max={40}
                        />

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
                            <ToggleButton variant="outline-primary" id="tbg-radio-FP_recoil" value={"recoil"}>
                                Recoil
                            </ToggleButton>
                            <ToggleButton variant="outline-primary" id="tbg-radio-FP_MetaRecoil" value={"MetaRecoil"}>
                                Meta Recoil
                            </ToggleButton>
                            <ToggleButton variant="outline-primary" id="tbg-radio-FP_Ergonomics" value={"ergo"}>
                                Ergonomics
                            </ToggleButton>
                            <ToggleButton variant="outline-primary" id="tbg-radio-FP_MetaErgonomics" value={"MetaErgonomics"}>
                                Meta Ergonomics
                            </ToggleButton>
                        </ToggleButtonGroup>
                        <br />

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
                                let itemKey = item.id.concat(i.toString())
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