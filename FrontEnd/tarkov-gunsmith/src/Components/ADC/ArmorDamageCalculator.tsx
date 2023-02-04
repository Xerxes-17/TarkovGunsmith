import { SetStateAction, useCallback, useState } from 'react';
import { Row, Col, Form, Button, Stack, Container, Card, Modal, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { TransmissionArmorTestResult } from '../../Context/ArmorTestsContext';
import { requestArmorTestSerires } from "../../Context/Requests";

import Shot from './Shot';
import SelectArmor from './SelectArmor';
import SelectAmmo from './SelectAmmo';
import FilterRangeSelector from '../Forms/FilterRangeSelector';
import { armorOptions, ARMOR_CLASSES, ARMOR_TYPES, filterArmorOptions, MATERIALS } from './ArmorData';
import { ammoOptions, AMMO_CALIBERS, filterAmmoOptions } from './AmmoData';
import CardHeader from 'react-bootstrap/esm/CardHeader';

export default function ArmorDamageCalculator(props: any) {
    const [armorName, setArmorName] = useState("6B3TM-01M armored rig");
    const [armorDurabilityMax, setArmorDurabilityMax] = useState(40);
    const [armorDurabilityNum, setArmorDurabilityNum] = useState(40);
    const [armorDurabilityPerc, setArmorDurabilityPerc] = useState(100);

    const [ammoName, setAmmoName] = useState("5.45x39mm PS gs");

    const [result, setResult] = useState<TransmissionArmorTestResult>();

    const [armorTypes, setArmorTypes] = useState([true, true, false]);

    const [armorVestBool, setArmorVestBool] = useState(true);
    const [chestRigBool, setChestRigtBool] = useState(true);
    const [helmetBool, setHelmetBool] = useState(false);

    const [armorClasses, setArmorClasses] = useState([true, true, true, true, true]);
    const [selectedArmorClasses, setSelectedArmorClasses] = useState([2, 3, 4, 5, 6]);

    const [selectedArmorMaterials, setSelectedArmorMaterials] = useState([0, 1, 2, 3, 4, 5, 6, 7]);

    const [filteredArmorOptions, setFilteredArmorOptions] = useState(armorOptions);

    // Is this working correctly??
    // Yes it is, but it's a rather jank way of doing it and should be refactored
    function handdleArmorClassClick(index: number) {

        const nextList = armorClasses.map((ac, i) => {
            if (i === index) {
                //flip the boolean
                return !ac
            }
            else {
                //change nothing
                return ac;
            }
        });
        setArmorClasses(nextList);

        const selectionsAC = nextList.map((b, i) => {
            if (b === true) {
                return 6 - i;
            }
            else {
                return -1;
            }
        });
        setSelectedArmorClasses(selectionsAC);

        setFilteredArmorOptions(filterArmorOptions(selectionsAC, selectedArmorMaterials));
    }

    const [armorMaterials, setArmorMaterials] = useState([true, true, true, true, true, true, true, true]);
    // Is this working correctly??
    function handdleArmorMaterialClick(index: number) {
        const nextList = armorMaterials.map((am, i) => {
            if (i === index) {
                //flip the boolean
                return !am
            }
            else {
                //change nothing
                return am;
            }
        });
        setArmorMaterials(nextList);
        console.log(armorMaterials);

        var newMaterials = selectedArmorMaterials
        if (newMaterials[index] === index) {
            newMaterials[index] = -1;
        }
        else {
            newMaterials[index] = index;
        }
        setSelectedArmorMaterials(newMaterials);

        setFilteredArmorOptions(filterArmorOptions(selectedArmorClasses, newMaterials));
    }

    function handleArmorSelection(name: string, maxDurability: number) {
        setArmorName(name);
        setArmorDurabilityMax(maxDurability);
        setArmorDurabilityNum(maxDurability);
    }

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

    const [caliberBools, setCaliberBools] = useState([
        true,
        true,
        true,
        true,

        true,
        true,
        true,
        true,
        true,
        true,

        true,
        true,
        true,
        true,

        true,
        true,
        true,
        true,

        true,
        true
    ])
    function changeCaliberBools(index: number) {
        const nextList = caliberBools.map((cb, i) => {
            if (i === index) {
                //flip the boolean
                return !cb
            }
            else {
                //change nothing
                return cb;
            }
        });
        setCaliberBools(nextList);
    }


    function handleCaliberChange(input: string, index: number) {
        var temp = calibers;
        if (temp.includes(input)) {
            temp = temp.filter(item => item !== input)
        }
        else {
            temp.push(input)
        }
        const result = temp;
        setCalibers(result);
        changeCaliberBools(index);

        setFilteredAmmoOptions(filterAmmoOptions(minDamage, minPenPower, minArmorDamPerc, traderLevel, result))
    }

    function handleMinDamageChange(input: number) {
        setMinDamage(input);
        setFilteredAmmoOptions(filterAmmoOptions(input, minPenPower, minArmorDamPerc, traderLevel, calibers));
    }
    function handleMinPenPowerChange(input: number) {
        setMinPenPower(input);
        setFilteredAmmoOptions(filterAmmoOptions(minDamage, input, minArmorDamPerc, traderLevel, calibers));
    }
    function handleMinArmorDamPercChange(input: number) {
        setArmorDamPerc(input);
        setFilteredAmmoOptions(filterAmmoOptions(minDamage, minPenPower, input, traderLevel, calibers));
    }
    function handleTraderLevelChange(input: number) {
        setTraderLevel(input);
        setFilteredAmmoOptions(filterAmmoOptions(minDamage, minPenPower, minArmorDamPerc, input, calibers));
    }

    const [filteredAmmoOptions, setFilteredAmmoOptions] = useState(ammoOptions);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const requestDetails = {
            armorName: armorName,
            armorDurability: (armorDurabilityNum / armorDurabilityMax * 100),
            ammoName: ammoName,
        }
        requestArmorTestSerires(requestDetails).then(response => {
            setResult(response);
        }).catch(error => {
            alert(`The error was: ${error}`);
            console.log(error);
        });
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
                    <Modal.Title>Information - ADC</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Press butan, reeciv bacon </p>
                    <p>Currently doesn't include rounds with less than 20 penetration because either you're doing leg meta or don't know what you're doing.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )

    const [newArmorTypes, setNewArmorTypes] = useState(ARMOR_TYPES);
    const handleNewArmorTypesTBG = (val: SetStateAction<string[]>) => setNewArmorTypes(val);

    const [newArmorClasses, setNewArmorClasses] = useState(ARMOR_CLASSES);
    const handleNewArmorClassesTBG = (val: SetStateAction<number[]>) => {
        if (val.length > 0) {
            setNewArmorClasses(val);
        }
    }

    const [newMaterials, setNewMaterials] = useState(MATERIALS);
    const handleNewMaterialsTBG = (val: SetStateAction<string[]>) => {
        if (val.length > 0) {
            setNewMaterials(val);
        }
    }

    const FULL_POWER = ["Caliber86x70", "Caliber127x55", "Caliber762x54R", "Caliber762x51"];
    const FULL_POWER_DISPLAY = ["338 Lapua Mag", "12.7x55mm", "7.62x54mmR", "7.62x51mm"];
    const [fullPower, setFullPower] = useState(FULL_POWER);
    const handleNewFullpower = (val: SetStateAction<string[]>) => {
        setFullPower(val);
    }

    const INTERMEDIATE = ["Caliber762x39", "Caliber545x39", "Caliber556x45NATO", "Caliber762x35", "Caliber366TKM", "Caliber9x39"];
    const INTERMEDIATE_DISPLAY = ["7.62x39", "5.45x39", "5.56x45", ".300 Blackout", ".366 TKM", "9x39"];
    const [intermediate, setIntermediate] = useState(INTERMEDIATE);
    const handleNewIntermediate = (val: SetStateAction<string[]>) => {
        setIntermediate(val);
    }

    const PISTOL = ["Caliber46x30", "Caliber9x21", "Caliber57x28", "Caliber1143x23ACP", "Caliber9x19PARA", "Caliber9x18PM", "Caliber762x25TT", "Caliber9x33R"];
    const PISTOL_DISPLAY = ["4.6x30", "9x21", "5.7x28", ".45 ACP", "9x19", "9x18", "7.62 TT", ".357"];
    const [pistol, setPistol] = useState(PISTOL);
    const handleNewPistol = (val: SetStateAction<string[]>) => {
        setPistol(val);
    }

    const SHOTGUN = ["Caliber12g", "Caliber23x75"];
    const SHOTGUN_DISPLAY = ["12g", "23mm"];
    const [shotgun, setShotgun] = useState(SHOTGUN);
    const handleNewShotgun = (val: SetStateAction<string[]>) => {
        setShotgun(val);
    }

    const AMMO_CALIBERS = [
        ["Full Rifle", fullPower, setFullPower, FULL_POWER, FULL_POWER_DISPLAY, handleNewFullpower],
        ["Intermediate Rifle", intermediate, setIntermediate, INTERMEDIATE, INTERMEDIATE_DISPLAY, handleNewIntermediate],
        ["PDW / Pistol", pistol, setPistol, PISTOL, PISTOL_DISPLAY, handleNewPistol],
        ["Shotgun", shotgun, setShotgun, SHOTGUN, SHOTGUN_DISPLAY, handleNewShotgun],
    ] //     0        1         2          3         4                     5

    // assume that a <div className="row gy-2"> is around the cards

    let topCard = (
        <Col xl>
            <Card bg="dark" border="secondary" text="light" className="xl" >
                <Card.Header as="h2" >
                    <Stack direction="horizontal" gap={3}>
                        Armor Damage Calculator
                        <div className="ms-auto">
                            {ModalInfo}
                        </div>
                    </Stack>
                </Card.Header>
                <Form>
                    <Row>
                        <Col xl>
                            <Card.Header as="h4">🛡 Armor filters and selection</Card.Header>
                            <Card.Body>
                                Armor Type <br />
                                <Button disabled size="sm" variant="outline-warning" onClick={(e) => setNewArmorTypes(["ArmorVest", "ChestRig", "Helmet"])}> All</Button>{' '}
                                <ToggleButtonGroup size="sm" type="checkbox" value={newArmorTypes} onChange={handleNewArmorTypesTBG}>
                                    {ARMOR_TYPES.map((item: any, i: number) => {
                                        return (
                                            <ToggleButton disabled key={JSON.stringify(item)} variant='outline-primary' id={`tbg-btn-${item}`} value={item}>
                                                {item}
                                            </ToggleButton>
                                        )
                                    })}
                                </ToggleButtonGroup>

                                <br />
                                Armor Class <br />
                                <Button size="sm" variant="outline-warning" onClick={(e) => setNewArmorClasses(ARMOR_CLASSES)}>All</Button>{' '}
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
                                <Button size="sm" variant="outline-warning" onClick={(e) => setNewMaterials(MATERIALS)}>All</Button>{' '}
                                <ToggleButtonGroup size="sm" type="checkbox" value={newMaterials} onChange={handleNewMaterialsTBG} style={{ flexWrap: "wrap" }}>
                                    {MATERIALS.map((item: string, i: number) => {
                                        return (
                                            <ToggleButton key={JSON.stringify(item)} variant='outline-primary' id={`tbg-btn-${item}`} value={item}>
                                                {item}
                                            </ToggleButton>
                                        )
                                    })}
                                </ToggleButtonGroup>

                                <br /><br />
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
                                            <Form.Control value={armorDurabilityNum} onChange={(e) => { setArmorDurabilityNum(parseInt(e.target.value)) }} />
                                        </Col>
                                        <Col style={{ maxWidth: "110px" }}>
                                            <Form.Label>Percentage</Form.Label>
                                            <Form.Control disabled={true} value={(armorDurabilityNum / armorDurabilityMax * 100).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%"} onChange={(e) => { setArmorDurabilityPerc(parseInt(e.target.value)) }} />
                                        </Col>
                                    </Row>
                                </Form.Group>

                            </Card.Body>
                        </Col>
                        <Col xl>
                            <Card.Header as="h4">⚔ Ammo filters and selection</Card.Header>
                            <Card.Body>
                                <>
                                    {
                                        AMMO_CALIBERS.map((caliber: any, i: number) => {
                                            return (
                                                <>
                                                    {caliber[0]}
                                                    <br />
                                                    <Button size="sm" variant="outline-success" onClick={(e) => caliber[2](caliber[3])}> All</Button>{' '}
                                                    <Button size="sm" variant="outline-danger" onClick={(e) => caliber[2](!caliber[3])}> All</Button>{' '}
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
                                                label={"TL 1-4, Tmax+Flea=5, Tmax+Flea+FIR=6"}
                                                value={traderLevel}
                                                changeValue={handleTraderLevelChange}
                                                min={smallestTraderLevel}
                                                max={biggestTraderLevel}
                                            />
                                        </Col>
                                    </Row>
                                    <Form.Text>You can search by the name by selecting this box and typing.</Form.Text>
                                        <SelectAmmo handleAmmoSelection={setAmmoName} ammoOptions={filteredAmmoOptions} />

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

    let topSection = (
        <>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <br />
                    <section className="about container">
                        <div className="row gy-0">
                            <div className="col-lg d-flex flex-column justify-content-center">

                                <div className="content">
                                    <h1 className="card-title">Armor Damage Calculator</h1>
                                    <br />
                                    <Form onSubmit={handleSubmit}>
                                        <h2>Armor Filters and selection</h2>
                                        <h6>Type</h6>
                                        <Stack direction="horizontal" gap={2}>
                                            <Form.Check disabled checked={armorVestBool} type={'checkbox'} id={"Armor Vest"} label={`Armor Vest`} onChange={(e) => setArmorVestBool(!armorVestBool)} inline />
                                            <Form.Check disabled checked={chestRigBool} type={'checkbox'} id={"Chest Rig"} label={`Chest Rig`} onChange={(e) => setChestRigtBool(!chestRigBool)} inline />
                                            <Form.Check disabled checked={helmetBool} type={'checkbox'} id={"Helmet"} label={`Helmet`} onChange={(e) => setHelmetBool(!helmetBool)} inline />
                                        </Stack>
                                        <h6>Class</h6>
                                        <Stack direction="horizontal" gap={2}>
                                            <Form.Check checked={armorClasses[4]} type={'checkbox'} id={"2"} label={`2`} onChange={(e) => handdleArmorClassClick(4)} inline />
                                            <Form.Check checked={armorClasses[3]} type={'checkbox'} id={"3"} label={`3`} onChange={(e) => handdleArmorClassClick(3)} inline />
                                            <Form.Check checked={armorClasses[2]} type={'checkbox'} id={"4"} label={`4`} onChange={(e) => handdleArmorClassClick(2)} inline />
                                            <Form.Check checked={armorClasses[1]} type={'checkbox'} id={"5"} label={`5`} onChange={(e) => handdleArmorClassClick(1)} inline />
                                            <Form.Check checked={armorClasses[0]} type={'checkbox'} id={"6"} label={`6`} onChange={(e) => handdleArmorClassClick(0)} inline />
                                        </Stack>
                                        <h6>Material</h6>
                                        <Stack direction="horizontal" gap={2}>
                                            <Form.Check checked={armorMaterials[0]} type={'checkbox'} id={"Aluminium"} label={`Aluminium`} onChange={(e) => handdleArmorMaterialClick(0)} inline />
                                            <Form.Check checked={armorMaterials[1]} type={'checkbox'} id={"Aramid"} label={`Aramid`} onChange={(e) => handdleArmorMaterialClick(1)} inline />
                                            <Form.Check checked={armorMaterials[2]} type={'checkbox'} id={"ArmoredSteel"} label={`ArmoredSteel`} onChange={(e) => handdleArmorMaterialClick(2)} inline />
                                            <Form.Check checked={armorMaterials[3]} type={'checkbox'} id={"Ceramic"} label={`Ceramic`} onChange={(e) => handdleArmorMaterialClick(3)} inline />
                                            <Form.Check checked={armorMaterials[4]} type={'checkbox'} id={"Combined"} label={`Combined`} onChange={(e) => handdleArmorMaterialClick(4)} inline />
                                            <Form.Check checked={armorMaterials[6]} type={'checkbox'} id={"Titan"} label={`Titan`} onChange={(e) => handdleArmorMaterialClick(6)} inline />
                                            <Form.Check checked={armorMaterials[7]} type={'checkbox'} id={"UHMWPE"} label={`UHMWPE`} onChange={(e) => handdleArmorMaterialClick(7)} inline />
                                        </Stack>
                                        <br />
                                        <Form.Text>You can search by the name by selecting this box and typing.</Form.Text>
                                        <SelectArmor handleArmorSelection={handleArmorSelection} armorOptions={filteredArmorOptions} />
                                        <br />

                                        <Form.Group className="mb-3">

                                            <Row>
                                                <Col xs="9">
                                                    <Form.Label>Armor Durability</Form.Label>
                                                    <Form.Range value={armorDurabilityNum} max={armorDurabilityMax} onChange={(e) => { setArmorDurabilityNum(parseInt(e.target.value)) }} />
                                                </Col>
                                                <Col xs="3">
                                                    <Form.Label>Number</Form.Label>
                                                    <Form.Control value={armorDurabilityNum} onChange={(e) => { setArmorDurabilityNum(parseInt(e.target.value)) }} />
                                                    <Form.Text>Percentage</Form.Text>
                                                    <Form.Control disabled={true} value={(armorDurabilityNum / armorDurabilityMax * 100).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }) + "%"} onChange={(e) => { setArmorDurabilityPerc(parseInt(e.target.value)) }} />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        <br />
                                        <h2>Ammo Filters and selection</h2>
                                        <h3>Calibers</h3>
                                        <Stack>
                                            <h6>Full Rifle</h6>
                                            <Stack direction="horizontal" gap={2}>
                                                <Form.Check checked={caliberBools[0]} type={'checkbox'} id={"Caliber86x70"} label={`.338 Lapua Mag`} onChange={(e) => handleCaliberChange(e.target.id, 0)} inline />
                                                <Form.Check checked={caliberBools[1]} type={'checkbox'} id={"Caliber127x55"} label={`12.7x55mm`} onChange={(e) => handleCaliberChange(e.target.id, 1)} inline />
                                                <Form.Check checked={caliberBools[2]} type={'checkbox'} id={"Caliber762x54R"} label={`7.62x54mmR`} onChange={(e) => handleCaliberChange(e.target.id, 2)} inline />
                                                <Form.Check checked={caliberBools[3]} type={'checkbox'} id={"Caliber762x51"} label={`7.62x51mm`} onChange={(e) => handleCaliberChange(e.target.id, 3)} inline />
                                            </Stack>
                                            <h6>Intermediate Rifle</h6>
                                            <Stack direction="horizontal" gap={2}>
                                                <Form.Check checked={caliberBools[4]} type={'checkbox'} id={"Caliber762x39"} label={`7.62x39mm`} onChange={(e) => handleCaliberChange(e.target.id, 4)} inline />
                                                <Form.Check checked={caliberBools[5]} type={'checkbox'} id={"Caliber545x39"} label={`5.45x39mm`} onChange={(e) => handleCaliberChange(e.target.id, 5)} inline />
                                                <Form.Check checked={caliberBools[6]} type={'checkbox'} id={"Caliber556x45NATO"} label={`5.56x45mm`} onChange={(e) => handleCaliberChange(e.target.id, 6)} inline />
                                                <Form.Check checked={caliberBools[7]} type={'checkbox'} id={"Caliber762x35"} label={`.300 Blackout`} onChange={(e) => handleCaliberChange(e.target.id, 7)} inline />
                                                <Form.Check checked={caliberBools[8]} type={'checkbox'} id={"Caliber366TKM"} label={`.366 TKM`} onChange={(e) => handleCaliberChange(e.target.id, 8)} inline />
                                                <Form.Check checked={caliberBools[9]} type={'checkbox'} id={"blaCaliber9x39h"} label={`9x39mm`} onChange={(e) => handleCaliberChange(e.target.id, 9)} inline />
                                            </Stack>

                                            <h6>PDW / Pistol</h6>
                                            <Stack direction="horizontal" gap={2}>
                                                <Form.Check checked={caliberBools[10]} type={'checkbox'} id={"Caliber46x30"} label={`4.6x30mm`} onChange={(e) => handleCaliberChange(e.target.id, 10)} inline />
                                                <Form.Check checked={caliberBools[11]} type={'checkbox'} id={"Caliber9x21"} label={`9x21mm`} onChange={(e) => handleCaliberChange(e.target.id, 11)} inline />
                                                <Form.Check checked={caliberBools[12]} type={'checkbox'} id={"Caliber57x28"} label={`5.7x28mm`} onChange={(e) => handleCaliberChange(e.target.id, 12)} inline />
                                                <Form.Check checked={caliberBools[13]} type={'checkbox'} id={"Caliber1143x23ACP"} label={`.45 ACP`} onChange={(e) => handleCaliberChange(e.target.id, 13)} inline />
                                                <Form.Check checked={caliberBools[14]} type={'checkbox'} id={"Caliber9x19PARA"} label={`9x19mm`} onChange={(e) => handleCaliberChange(e.target.id, 14)} inline />
                                                <Form.Check checked={caliberBools[15]} type={'checkbox'} id={"Caliber9x18PM"} label={`9x18mm`} onChange={(e) => handleCaliberChange(e.target.id, 15)} inline />
                                                <Form.Check checked={caliberBools[16]} type={'checkbox'} id={"Caliber762x25TT"} label={`7.62x25mm TT`} onChange={(e) => handleCaliberChange(e.target.id, 16)} inline />
                                                <Form.Check checked={caliberBools[17]} type={'checkbox'} id={"Caliber9x33R"} label={`.357`} onChange={(e) => handleCaliberChange(e.target.id, 17)} inline />
                                            </Stack>

                                            <h6>Shotgun</h6>
                                            <Stack direction="horizontal" gap={2}>
                                                <Form.Check checked={caliberBools[18]} type={'checkbox'} id={"Caliber12g"} label={`12g`} onChange={(e) => handleCaliberChange(e.target.id, 18)} inline />
                                                <Form.Check checked={caliberBools[19]} type={'checkbox'} id={"Caliber23x75"} label={`23mm`} onChange={(e) => handleCaliberChange(e.target.id, 19)} inline />
                                            </Stack>

                                        </Stack>

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
                                        <FilterRangeSelector
                                            label={"Minimum Armor Damage Percentage"}
                                            value={minArmorDamPerc}
                                            changeValue={handleMinArmorDamPercChange}
                                            min={smallestArmorDamPerc}
                                            max={biggestArmorDamPerc}
                                        />
                                        <FilterRangeSelector
                                            label={"Max Trader Level (1-4), TL4 + Flea = 5 , TL4 + Flea + FIR = 6"}
                                            value={traderLevel}
                                            changeValue={handleTraderLevelChange}
                                            min={smallestTraderLevel}
                                            max={biggestTraderLevel}
                                        />

                                        <Form.Text>You can search by the name by selecting this box and typing.</Form.Text>
                                        <SelectAmmo handleAmmoSelection={setAmmoName} ammoOptions={filteredAmmoOptions} />

                                        <Button variant="primary" type="submit" className='form-btn'>
                                            Submit
                                        </Button>
                                    </Form>

                                </div>
                            </div>
                        </div>
                    </section>
                </Col>
            </Row>
        </>
    )

    let content;
    if (result !== undefined) {
        content = (
            <>
                {topSection}

                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <br />
                        <section className="about container">
                            <div className="row gy-0">
                                <div className="col-lg d-flex flex-column justify-content-center">
                                    <div className="content">
                                        <h2 className="card-title">{result.testName}</h2>
                                        <Row className='centered-vertically'>
                                            <Col><img src={result.armorGridImage} className="img-fluid" alt='' /></Col>
                                            <Col><img src={result.ammoGridImage} className="img-fluid" alt='' /></Col>
                                        </Row>
                                        <p>Expected armor damage per shot: {result.armorDamagePerShot.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</p>
                                        <br />
                                        <Col className='shotBoxes'>
                                            <Container>
                                                <Row className="justify-content-md-center">
                                                    <Col>
                                                        <h3>Shot:</h3>
                                                    </Col>
                                                    <Col>
                                                        <h3>Armor Durability</h3>
                                                    </Col>
                                                    <Col>
                                                        <h3>Durability Percentage:</h3>
                                                    </Col>
                                                    <Col>
                                                        <h3>Done Armor Damage:</h3>
                                                    </Col>
                                                    <Col>
                                                        <h3>Penetration Chance:</h3>
                                                    </Col>
                                                </Row>
                                            </Container>
                                            {result.shots.map((item: any, i: number) => {
                                                return (

                                                    <Shot key={JSON.stringify(item)} shot={item} num={i}></Shot>

                                                )
                                            })}
                                        </Col>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Col>
                </Row>
            </>
        )
    }
    else {
        content = (
            <>
                {topCard}
                {topSection}
            </>
        )
    }

    return (
        content
    );

}