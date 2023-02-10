import { SetStateAction, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Stack, Card, Modal, ToggleButton, ToggleButtonGroup, Table, Spinner, Accordion } from "react-bootstrap";
import { TransmissionArmorTestResult } from '../../Context/ArmorTestsContext';
import { requestArmorTestSerires, requestArmorTestSerires_Custom } from "../../Context/Requests";

import SelectArmor from './SelectArmor';
import SelectAmmo from './SelectAmmo';
import FilterRangeSelector from '../Forms/FilterRangeSelector';
import { ArmorOption, ARMOR_CLASSES, ARMOR_TYPES, filterArmorOptions, MATERIALS } from './ArmorData';
import { filterAmmoOptions, AmmoOption } from './AmmoData';
import { API_URL } from '../../Util/util';

export default function ArmorDamageCalculator(props: any) {
    // Info Modal
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
                    <Modal.Title>Information - ADC</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Currently doesn't include rounds with less than 20 penetration because because I haven't done my own testing with these yet, and at that range either you're doing leg meta and it doesn't matter or you don't know what you're doing.</p>
                    <p>Custom mode allows you to set the stats of the armor and ammo to whatever you want. The defaults are for RatRig vs 7.62x39 PS.</p>
                    <h5>Glossary:</h5>
                    <p><strong>🛡 Armor Class:</strong> How strong your armor can be.</p>
                    <p><strong>⛓ Max Durability:</strong> How tough your armor can be.</p>
                    <p><strong>⚖ Effective Durability:</strong> Durability divided by the armor material factor, allows you to compare armors of different materials directly.</p>
                    <p><strong>✒ Penetration:</strong> It's the *pen*, geddit? Hahahah</p>
                    <p><strong>📐 Armor Damage Percentage:</strong> The percentage of the penetration that is used in the armor damage formula, because flesh damage has nothing to do with it.</p>
                    <p><strong>💀 Damage:</strong> How much you will unalive someone on hits/penetrations (before armor flesh damage mitigation that is).</p>
                    <p><strong>👨‍🔧 Trader level:</strong> The trader level for a cash offer. 5 means it can be bought on flea market, 6 means found in raid only. <br/>Note: the app does not account for barters yet.</p> 
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

    //Armor Stuff
    const [ArmorOptions, setArmorOptions] = useState<ArmorOption[]>([]);

    const [armorId, setArmorId] = useState("");
    const [armorDurabilityMax, setArmorDurabilityMax] = useState(1);
    const [armorDurabilityNum, setArmorDurabilityNum] = useState(1);

    const [filteredArmorOptions, setFilteredArmorOptions] = useState(ArmorOptions);

    const [newArmorTypes, setNewArmorTypes] = useState(ARMOR_TYPES);
    const handleNewArmorTypesTBG = (val: SetStateAction<string[]>) => setNewArmorTypes(val);

    const [newArmorClasses, setNewArmorClasses] = useState(ARMOR_CLASSES);
    const [newMaterials, setNewMaterials] = useState(MATERIALS);

    

    const armors = async () => {
        const response = await fetch(API_URL + '/GetArmorOptionsList');
        setArmorOptions(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        armors();
        console.log("useEffect")
    }, [])
    // This useEffect will watch for a change to WeaponOptions or filter options, then update the filteredStockWeaponOptions
    useEffect(() => {
        setFilteredArmorOptions(filterArmorOptions(newArmorTypes, newArmorClasses, newMaterials, ArmorOptions));
    },[newArmorTypes, ArmorOptions, newArmorClasses, newMaterials])



    const handleNewArmorClassesTBG = (val: SetStateAction<number[]>) => {
        if (val.length > 0) {
            setNewArmorClasses(val);
        }
    }

    const handleNewMaterialsTBG = (val: SetStateAction<string[]>) => {
        if (val.length > 0) {
            setNewMaterials(val);
        }
    }

    function handleArmorSelection(armorId: string, maxDurability: number) {
        setArmorId(armorId);
        setArmorDurabilityMax(maxDurability);
        setArmorDurabilityNum(maxDurability);
    }

    // Ammo Stuff
    const [AmmoOptions, setAmmoOptions] = useState<AmmoOption[]>([]);

    const [ammoId, setAmmoId] = useState("");

    const [minDamage, setMinDamage] = useState(25); // Need to make these values be drawn from something rather than magic numbers
    const [smallestDamage] = useState(25);
    const [biggestDamage] = useState(192);

    const [minPenPower, setMinPenPower] = useState(20); // Need to make these values be drawn from something rather than magic numbers
    const [smallestPenPower] = useState(20);
    const [biggestPenPower] = useState(79);

    const [minArmorDamPerc, setArmorDamPerc] = useState(22); // Need to make these values be drawn from something rather than magic numbers
    const [smallestArmorDamPerc] = useState(22);
    const [biggestArmorDamPerc] = useState(89);

    const [traderLevel, setTraderLevel] = useState(5); // Need to make these values be drawn from something rather than magic numbers
    const [smallestTraderLevel] = useState(1);
    const [biggestTraderLevel] = useState(6); // 5 is for FLea market, 6 is for FIR


    const [filteredAmmoOptions, setFilteredAmmoOptions] = useState(AmmoOptions);

    const [calibers, setCalibers] = useState([
        "Caliber86x70",
        "Caliber127x55",
        "Caliber762x54R",
        "Caliber762x51",

        "Caliber762x39",
        "Caliber545x39",
        "Caliber556x45NATO",
        "Caliber762x35",
        "Caliber366TKM",
        "Caliber9x39",

        "Caliber46x30",
        "Caliber9x21",
        "Caliber57x28",
        "Caliber1143x23ACP",

        "Caliber9x19PARA",
        "Caliber9x18PM",
        "Caliber762x25TT",
        "Caliber9x33R",

        "Caliber12g",
        "Caliber23x75"
    ]);

    const FULL_POWER = ["Caliber86x70", "Caliber127x55", "Caliber762x54R", "Caliber762x51"];
    const FULL_POWER_DISPLAY = ["338 Lapua Mag", "12.7x55mm", "7.62x54mmR", "7.62x51mm"];
    const [fullPower, setFullPower] = useState(FULL_POWER);
    const handleNewFullpower = (val: SetStateAction<string[]>) => {
        setFullPower(val);

        const arr: any = [val, intermediate, pistol, shotgun].flat();
        setCalibers(arr)
    }

    const INTERMEDIATE = ["Caliber762x39", "Caliber545x39", "Caliber556x45NATO", "Caliber762x35", "Caliber366TKM", "Caliber9x39"];
    const INTERMEDIATE_DISPLAY = ["7.62x39", "5.45x39", "5.56x45", ".300 Blackout", ".366 TKM", "9x39"];
    const [intermediate, setIntermediate] = useState(INTERMEDIATE);
    const handleNewIntermediate = (val: SetStateAction<string[]>) => {
        setIntermediate(val);

        const arr: any = [fullPower, val, pistol, shotgun].flat();
        setCalibers(arr)
    }

    const PISTOL = ["Caliber46x30", "Caliber9x21", "Caliber57x28", "Caliber1143x23ACP", "Caliber9x19PARA", "Caliber9x18PM", "Caliber762x25TT", "Caliber9x33R"];
    const PISTOL_DISPLAY = ["4.6x30", "9x21", "5.7x28", ".45 ACP", "9x19", "9x18", "7.62 TT", ".357"];
    const [pistol, setPistol] = useState(PISTOL);
    const handleNewPistol = (val: SetStateAction<string[]>) => {
        setPistol(val);

        const arr: any = [fullPower, intermediate, val, shotgun].flat();
        setCalibers(arr)
    }

    const SHOTGUN = ["Caliber12g", "Caliber23x75"];
    const SHOTGUN_DISPLAY = ["12g", "23mm"];
    const [shotgun, setShotgun] = useState(SHOTGUN);
    const handleNewShotgun = (val: SetStateAction<string[]>) => {
        setShotgun(val);

        const arr: any = [fullPower, intermediate, pistol, val].flat();
        setCalibers(arr)
    }

    // Look at replacing item 2 with item 5 as you may not need item 2 in practice.
    //! Now that you know how to use useEffect, p[robs need to redo this whole area with it in mind.]
    const AMMO_CALIBERS = [
        ["Full Rifle", fullPower, setFullPower, FULL_POWER, FULL_POWER_DISPLAY, handleNewFullpower],
        ["Intermediate Rifle", intermediate, setIntermediate, INTERMEDIATE, INTERMEDIATE_DISPLAY, handleNewIntermediate],
        ["PDW / Pistol", pistol, setPistol, PISTOL, PISTOL_DISPLAY, handleNewPistol],
        ["Shotgun", shotgun, setShotgun, SHOTGUN, SHOTGUN_DISPLAY, handleNewShotgun],
    ] //     0        1         2          3         4                     5

    function handleMinDamageChange(input: number) {
        setMinDamage(input);
    }
    function handleMinPenPowerChange(input: number) {
        setMinPenPower(input);
    }
    function handleMinArmorDamPercChange(input: number) {
        setArmorDamPerc(input);
    }
    function handleTraderLevelChange(input: number) {
        setTraderLevel(input);
    }

    const ammos = async () => {
        const response = await fetch(API_URL + '/GetAmmoOptionsList');
        setAmmoOptions(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        ammos();
        console.log("useEffect AMMO")
    }, [])
    // This useEffect will watch for a change to WeaponOptions or filter options, then update the filteredStockWeaponOptions
    useEffect(() => {
        setFilteredAmmoOptions(filterAmmoOptions(AmmoOptions, minDamage, minPenPower, minArmorDamPerc, traderLevel, calibers));
    },[AmmoOptions, minDamage, minPenPower, minArmorDamPerc, traderLevel, calibers])

    // Submit / Result
    const handleSubmit = (e: any) => {
        e.preventDefault();

        const requestDetails = {
            armorId: armorId,
            armorDurability: (armorDurabilityNum / armorDurabilityMax * 100),
            ammoId: ammoId,
        }
        requestArmorTestSerires(requestDetails).then(response => {
            setResult(response);
        }).catch(error => {
            alert(`The error was: ${error}`);
            // console.log(error);
        });
    }

    const [result, setResult] = useState<TransmissionArmorTestResult>();

    //Custom Mode
    const [customCalculation, setCustomCalculation] = useState(false);
    const handleEnableCustomCal = () => setCustomCalculation(true);
    const handleDisableCustomCal = () => setCustomCalculation(false);

    const [armorClass, setArmorClass] = useState(4);
    const [armorMaterial, setArmorMaterial] = useState("Titan");
    const [armorDurabilityNum_Custom, setArmorDurabilityNum_Custom] = useState(40);
    const [armorDurabilityMax_Custom, setArmorDurabilityMax_Custom] = useState(40);

    const [penetration, setPenetration] = useState(35);
    const [armorDamagePerc, setArmorDamagePerc] = useState(52);

    const [errorPenetration, setErrorPenetration] = useState("");

    const handleCustomSubmit = (e: any) => {
        e.preventDefault();

        if (penetration < 20) {
            setErrorPenetration("Sorry, value must be above 20 for now.")
        }
        else if (penetration > 79) {
            setErrorPenetration("Sorry, value must be below 80 for now.")
        }
        else {
            setErrorPenetration("")
            const requestDetails = {
                armorClass: armorClass,
                armorMaterial: armorMaterial,
                armorDurabilityPerc: (armorDurabilityNum_Custom / armorDurabilityMax_Custom * 100),
                armorDurabilityMax: armorDurabilityMax_Custom,

                penetration: penetration,
                armorDamagePerc: armorDamagePerc
            }

            requestArmorTestSerires_Custom(requestDetails).then(response => {
                // console.log(response);
                setResult(response);
            }).catch(error => {
                alert(`The error was: ${error}`);
                // console.log(error);
            });
        }
    }


    // assume that a <div className="row gy-2"> is around the cards

    let topCard = (
        <Col xl>
            <Card bg="dark" border="secondary" text="light" className="xl" >

                <Card.Header as="h2" >
                    <Stack direction="horizontal" gap={3}>
                        Armor Damage Calculator - Presets
                        <div className="ms-auto">
                            <Stack direction='horizontal' gap={2}>
                                <Button variant="secondary" onClick={handleEnableCustomCal}>Change mode to Custom</Button>
                                {ModalInfo}
                            </Stack>
                        </div>
                    </Stack>
                </Card.Header>

                <Form onSubmit={handleSubmit}>
                    <Row>
                        <Col xl>
                            <Card.Header as="h4">🛡 Armor Selection</Card.Header>
                            <Accordion flush>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header><strong>Armor Filters</strong></Accordion.Header>
                                    <Accordion.Body>
                                        Armor Type <br />
                                        <Button size="sm" variant="outline-warning" onClick={(e) => handleNewArmorTypesTBG(["ArmorVest", "ChestRig", "Helmet"])}> All</Button>{' '}
                                        <ToggleButtonGroup size="sm" type="checkbox" value={newArmorTypes} onChange={handleNewArmorTypesTBG}>
                                            {ARMOR_TYPES.map((item: any, i: number) => {
                                                return (
                                                    <ToggleButton key={JSON.stringify(item)} variant='outline-primary' id={`tbg-btn-${item}`} value={item}>
                                                        {item}
                                                    </ToggleButton>
                                                )
                                            })}
                                        </ToggleButtonGroup>

                                        <br />
                                        Armor Class <br />
                                        <Button size="sm" variant="outline-warning" onClick={(e) => handleNewArmorClassesTBG(ARMOR_CLASSES)}>All</Button>{' '}
                                        <ToggleButtonGroup size="sm" type="checkbox" value={newArmorClasses} onChange={handleNewArmorClassesTBG}>
                                            {ARMOR_CLASSES.map((item: any, i: number) => {
                                                return (
                                                    <ToggleButton key={JSON.stringify(item)} variant='outline-primary' id={`tbg-btn-ac${item}`} value={item}>
                                                        {item}
                                                    </ToggleButton>
                                                )
                                            })}
                                        </ToggleButtonGroup>

                                        <br />
                                        Armor Material <br />
                                        <Button size="sm" variant="outline-warning" onClick={(e) => handleNewMaterialsTBG(MATERIALS)}>All</Button>{' '}
                                        <ToggleButtonGroup size="sm" type="checkbox" value={newMaterials} onChange={handleNewMaterialsTBG} style={{ flexWrap: "wrap" }}>
                                            {MATERIALS.map((item: string, i: number) => {
                                                return (
                                                    <ToggleButton key={JSON.stringify(item)} variant='outline-primary' id={`tbg-btn-${item}`} value={item}>
                                                        {item}
                                                    </ToggleButton>
                                                )
                                            })}
                                        </ToggleButtonGroup>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                            <Card.Body style={{ paddingTop: "1px" }}>
                                <strong>Available Choices:</strong> {filteredArmorOptions.length} <br />
                                <Form.Text>You can search by the name by selecting this box and typing.</Form.Text>
                                <SelectArmor handleArmorSelection={handleArmorSelection} armorOptions={filteredArmorOptions} />

                                <br />

                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col>
                                            <Form.Label>Armor Durability</Form.Label>
                                            <Form.Range value={armorDurabilityNum} max={armorDurabilityMax} onChange={(e) => { setArmorDurabilityNum(parseInt(e.target.value)) }} />
                                        </Col>
                                        <Col style={{ maxWidth: "90px" }}>
                                            <Form.Label>Number</Form.Label>
                                            <Form.Control disabled value={armorDurabilityNum} onChange={(e) => { setArmorDurabilityNum(parseInt(e.target.value)) }} />
                                        </Col>
                                        <Col style={{ maxWidth: "110px" }}>
                                            <Form.Label>Percentage</Form.Label>
                                            <Form.Control disabled={true} value={(armorDurabilityNum / armorDurabilityMax * 100).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%"} />
                                        </Col>
                                    </Row>
                                </Form.Group>

                            </Card.Body>
                        </Col>

                        <Col xl>
                            <Card.Header as="h4">⚔ Ammo Selection</Card.Header>
                            <Accordion flush>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header><strong>Ammo Filters</strong></Accordion.Header>
                                    <Accordion.Body>
                                        {
                                            AMMO_CALIBERS.map((caliber: any, i: number) => {
                                                return (
                                                    <>
                                                        {caliber[0]}
                                                        <br />
                                                        <Button size="sm" variant="outline-success" onClick={(e) => caliber[5](caliber[3])}> All</Button>{' '}
                                                        <Button size="sm" variant="outline-danger" onClick={(e) => caliber[5](!caliber[3])}> All</Button>{' '}
                                                        <ToggleButtonGroup size="sm" type="checkbox" value={caliber[1]} onChange={caliber[5]} style={{ flexWrap: "wrap" }}>
                                                            {caliber[4].map((value: any, i: number) => {
                                                                return (
                                                                    <ToggleButton key={JSON.stringify(caliber[3][i])} variant='outline-primary' id={`tbg-btn-${caliber[3][i]}`} value={caliber[3][i]}>
                                                                        {value}
                                                                    </ToggleButton>
                                                                )
                                                            })}
                                                        </ToggleButtonGroup>
                                                        <br />
                                                    </>
                                                )
                                            })
                                        }
                                        <Row>
                                            <Col>
                                                <FilterRangeSelector
                                                    label={"Minimum Damage"}
                                                    value={minDamage}
                                                    changeValue={handleMinDamageChange}
                                                    min={smallestDamage}
                                                    max={biggestDamage}
                                                />
                                                <FilterRangeSelector
                                                    label={"Minimum Penetration Power"}
                                                    value={minPenPower}
                                                    changeValue={handleMinPenPowerChange}
                                                    min={smallestPenPower}
                                                    max={biggestPenPower}
                                                />
                                            </Col>
                                            <Col>
                                                <FilterRangeSelector
                                                    label={"Minimum Armor Damage %"}
                                                    value={minArmorDamPerc}
                                                    changeValue={handleMinArmorDamPercChange}
                                                    min={smallestArmorDamPerc}
                                                    max={biggestArmorDamPerc}
                                                />
                                                <FilterRangeSelector
                                                    label={"Trader 1-4, Flea=5, FIR=6"}
                                                    value={traderLevel}
                                                    changeValue={handleTraderLevelChange}
                                                    min={smallestTraderLevel}
                                                    max={biggestTraderLevel}
                                                />
                                            </Col>
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>

                            </Accordion>
                            <Card.Body style={{ paddingTop: "1px" }}>
                                <>

                                    <strong>Available Choices:</strong> {filteredAmmoOptions.length} <br />
                                    <Form.Text>You can search by the name by selecting this box and typing. </Form.Text>
                                    <SelectAmmo handleAmmoSelection={setAmmoId} ammoOptions={filteredAmmoOptions} />
                                </>
                            </Card.Body>
                        </Col>
                    </Row>
                    <Card.Footer>
                        <Button variant="primary" type="submit" className='form-btn'>
                            Calculate
                        </Button>
                    </Card.Footer>

                </Form>

            </Card>
        </Col>
    )

    if (customCalculation === true) {
        topCard = (
            <>
                <Card bg="dark" border="secondary" text="light" className="xl" >

                    <Card.Header as="h2" >
                        <Stack direction="horizontal" gap={3}>
                            Armor Damage Calculator - Custom
                            <div className="ms-auto">
                                <Stack direction='horizontal' gap={2}>
                                    <Button variant="secondary" onClick={handleDisableCustomCal}>Change mode to Presets</Button>
                                    {ModalInfo}
                                </Stack>
                            </div>
                        </Stack>
                    </Card.Header>
                    <Form onSubmit={handleCustomSubmit}>
                        <Row>
                            <Col xl>
                                <Card.Header as="h4">🛡 Armor settings</Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={4}>
                                            <Form.Group className="md" controlId="ArmorClass">
                                                <Form.Label>Armor Class 🛡</Form.Label>
                                                <Form.Select aria-label="Default select example" defaultValue={armorClass} onChange={(e) => { setArmorClass(parseInt(e.target.value)) }}>
                                                    <option value={2}>2</option>
                                                    <option value={3}>3</option>
                                                    <option value={4}>4</option>
                                                    <option value={5}>5</option>
                                                    <option value={6}>6</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <br />

                                            <Form.Group className="md" controlId="ArmorClass">
                                                <Form.Label>Armor Material 🧱</Form.Label>
                                                <Form.Select aria-label="Default select example" value={armorMaterial} onChange={(e) => { setArmorMaterial(e.target.value) }}>
                                                    <option value={"Aramid"}>Aramid</option>
                                                    <option value={"UHMWPE"}>UHMWPE</option>
                                                    <option value={"Combined"}>Combined</option>
                                                    <option value={"Aluminium"}>Aluminium</option>
                                                    <option value={"Titan"}>Titan</option>
                                                    <option value={"ArmoredSteel"}>ArmoredSteel</option>
                                                    <option value={"Ceramic"}>Ceramic</option>
                                                    <option value={"Glass"}>Glass</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </Col>

                                        <Col md={7}>
                                            <Form.Group controlId="MaxDurability">
                                                <Form.Label>Armor Durability Max</Form.Label>
                                                <Form.Control type="number" placeholder="Enter max durability as a number" defaultValue={armorDurabilityMax_Custom}
                                                    onChange={(e) => {
                                                        if (parseInt(e.target.value) < 1) {
                                                            e.target.value = "1"
                                                        } // It's jank, but it werks

                                                        setArmorDurabilityMax_Custom(parseInt(e.target.value))
                                                        setArmorDurabilityNum_Custom(parseInt(e.target.value))
                                                    }}
                                                />
                                                <Form.Text className="text-muted">
                                                    Eg: "40" without quotes.
                                                </Form.Text>
                                            </Form.Group>

                                            <Form.Group>
                                                <Row>
                                                    <Col md>
                                                        <Form.Label>Starting Armor Durability</Form.Label>
                                                        <Form.Range value={armorDurabilityNum_Custom} min={1} max={armorDurabilityMax_Custom} onChange={(e) => { setArmorDurabilityNum_Custom(parseInt(e.target.value)) }} />
                                                    </Col>
                                                    <Col md="3">
                                                        <Form.Label>Number</Form.Label>
                                                        <Form.Control disabled value={armorDurabilityNum_Custom} onChange={(e) => { setArmorDurabilityNum_Custom(parseInt(e.target.value)) }} />

                                                    </Col>
                                                    <Col md="4">
                                                        <Form.Label>Percentage</Form.Label>
                                                        <Form.Control disabled={true} value={(armorDurabilityNum_Custom / armorDurabilityMax_Custom * 100).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%"} />
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Col>
                            <Col xl>
                                <Card.Header as="h4">⚔ Ammo settings</Card.Header>
                                <Card.Body>

                                    <Row>
                                        <Col md={3}>
                                            <Form.Group className="md" controlId="Penetration">
                                                <Form.Label>Penetration ✒</Form.Label>
                                                {errorPenetration === "" &&
                                                    <>
                                                        <Form.Control type="number" placeholder="Enter penetration as a number" defaultValue={penetration}
                                                            onChange={(e) => {
                                                                if (parseInt(e.target.value) < 1) {
                                                                    e.target.value = "1"
                                                                } // It's jank, but it werks
                                                                setPenetration(parseInt(e.target.value))
                                                            }}
                                                        />
                                                    </>}
                                                {errorPenetration.includes("Sorry,") &&
                                                    <>
                                                        <Form.Control isInvalid type="number" placeholder="Enter penetration as a number" defaultValue={penetration} onChange={(e) => { setPenetration(parseInt(e.target.value)) }} />
                                                    </>}
                                                <Form.Text className="text-muted">
                                                    Eg: "35" without quotes.
                                                </Form.Text>
                                                <br />
                                                <Form.Text className="text-danger"> {errorPenetration}</Form.Text>

                                            </Form.Group>
                                        </Col>
                                        <Col md={7}>
                                            <Form.Group>
                                                <Row>
                                                    <Col md>
                                                        <Form.Label>Armor Damage Percentage 📐</Form.Label>
                                                        <Form.Range value={armorDamagePerc} max={100} min={1} onChange={(e) => { setArmorDamagePerc(parseInt(e.target.value)) }} />
                                                    </Col>
                                                    <Col md="3">
                                                        <Form.Text>ADP</Form.Text>
                                                        <Form.Control disabled value={armorDamagePerc} onChange={(e) => { setArmorDamagePerc(parseInt(e.target.value)) }} />
                                                    </Col>
                                                </Row>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Col>
                        </Row>
                        <Card.Footer>
                            <Button variant="primary" type="submit" className='form-btn'>
                                Calculate
                            </Button>
                        </Card.Footer>
                    </Form>
                </Card>
            </>
        )
    }

    let resultCard;
    if (result !== undefined) {
        resultCard = (
            <>
                <Col xl>
                    <Card bg="dark" border="secondary" text="light" className="xl" >
                        <Card.Header as="h4">📉 {result.testName}</Card.Header>
                        <Card.Body>
                            <p>Expected armor damage per shot: {result.armorDamagePerShot.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                            <Table striped bordered hover variant="dark" responsive="sm">
                                <thead>
                                    <tr>
                                        <th>Shot</th>
                                        <th>Armor Durability</th>
                                        <th>Durability Percentage</th>
                                        <th>Done Armor Damage</th>
                                        <th>Penetration Chance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.shots.map((item: any, i: number) => {
                                        return (
                                            <tr>
                                                <td>{i + 1}</td>
                                                <td>{item.durability.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
                                                <td>{item.durabilityPerc.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
                                                <td>{item.doneDamage.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</td>
                                                <td>{item.penetrationChance.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </>
        )
    }
    else {
        resultCard = (
            <Col xl>
                <Card bg="secondary" border="light" text="light" className="xl">
                    <Card.Body>
                        <Button variant="dark" disabled>
                            <Stack direction="horizontal" gap={2}>
                                <Spinner animation="grow" role="status" size="sm">
                                    <span className="visually-hidden"> Awaiting result</span>
                                </Spinner>
                                <div className="vr" />
                                Awaiting result
                            </Stack>
                        </Button>
                    </Card.Body>
                </Card>
            </Col>
        )
    }

    let content;
    if (result === undefined) {
        content = (
            <>
                <Stack gap={1}>
                    {topCard}
                    {resultCard}
                </Stack>
            </>
        )
    }
    else {
        content = (
            <>
                <Stack gap={1}>
                    {topCard}
                    {resultCard}
                </Stack>
            </>
        )
    }

    return (
        content
    );

}