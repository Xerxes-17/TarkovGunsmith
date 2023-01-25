import { useState } from "react";
import { Row, Col, Form, Button, Stack, Container } from "react-bootstrap";
import { requestWeaponBuild } from "../../Context/Requests";
import FilterRangeSelector from "../Forms/FilterRangeSelector";
import Mod from "./Mod";
import SelectSingleWeapon from "./SelectSingleWeapon";
import { WeaponOption, filterStockWeaponOptions, StockWeaponOptions, TransmissionWeaponBuildResult, TransmissionAttachedMod, sortStockWeaponOptions } from './WeaponData';

// Renders the home
export default function ModdedWeaponBuilder(props: any) {
    
    const [selectedWeapon, setSelectedWeapon] = useState("")
    const [playerLevel, setPlayerLevel] = useState(15); // Need to make these values be drawn from something rather than magic numbers

    const [muzzleMode, setloudOrSilenced] = useState(1); // Need to make these values be drawn from something rather than magic numbers

    const [ergoOrRecoil, setErgoOrRecoil] = useState(2); // Need to make these values be drawn from something rather than magic numbers

    const [filteredStockWeaponOptions, setFilteredStockWeaponOptions] = useState(StockWeaponOptions);

    const [result, setResult] = useState<TransmissionWeaponBuildResult>();

    function handlePlayerLevelChange(input: number) {
        setPlayerLevel(input);
        setFilteredStockWeaponOptions(filterStockWeaponOptions(input));
    }

    function handleWeaponSelection(name: string) {
        setSelectedWeapon(name);
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
            searchString: selectedWeapon,
        }
        requestWeaponBuild(requestDetails).then(response => {
            console.log(response);
            setResult(response[0]);
        }).catch(error => {
            alert(`The error was: ${error}`);
            console.log(error);
        });
    }

    let content;
    if (result !== undefined) {
        content =
            <>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <br />
                        <section className="about container">
                            <div className="row gy-0">
                                <div className="col-lg d-flex flex-column justify-content-center">

                                    <div className="content">
                                        <h1 className="card-title">Modded Weapon Builder</h1>
                                        <p></p>
                                        <Form onSubmit={handleSubmit}>
                                            <h2>Build a weapon</h2>

                                            <FilterRangeSelector
                                                label={"Player Level - Filters Possible Weapons and Mods"}
                                                value={playerLevel}
                                                changeValue={handlePlayerLevelChange}
                                                min={1}
                                                max={50}
                                            />
                                            <Form.Text>Level 20 for LL 2 traders. Level 30 for LL3 Level 40 for LL4.</Form.Text>
                                            <br/><br/>

                                            <SelectSingleWeapon handleWeaponSelection={handleWeaponSelection} weaponOptions={filteredStockWeaponOptions} />
                                            <br/>

                                            <FilterRangeSelector
                                                label={"1-Loud, 2-silenced, 3-any."}
                                                value={muzzleMode}
                                                changeValue={setloudOrSilenced}
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
                                                Submit
                                            </Button>
                                        </Form>
                                        <br />
                                        <Container>
                                            <Row className="justify-content-md-center">
                                                <Col>
                                                    <img src={`https://assets.tarkov.dev/${result.id}-grid-image.jpg`} alt={result.shortName} className={"mod_img"} />
                                                    <h3>Weapon Price: ₽{result.priceRUB.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</h3>
                                                </Col>
                                                <Col>
                                                    <h3>{result.shortName}</h3>
                                                    Rate of Fire: {result.rateOfFire}
                                                </Col>
                                                <Col>
                                                    <h3>Base Ergo: ✍ {result.baseErgo}</h3>
                                                    <h3>Base Recoil: ⏫ {result.baseRecoil}</h3>
                                                </Col>
                                                <Col>
                                                    <h3>Final Ergo: ✍ {result.finalErgo}</h3>
                                                    <h3>Final Recoil: ⏫ {result.finalRecoil}</h3>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col></Col>
                                                <Col><h3>Hidden Stats:</h3></Col>
                                                <Col>Convergence: {result.convergence.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</Col>
                                                <Col>Recoil Dispersion: {result.recoilDispersion}</Col>
                                            </Row>
                                            <br/>
                                            <Row>
                                                <Col></Col>
                                                <Col><h3>Selected Round:</h3> {result.selectedPatron.shortName} </Col>
                                                <Col>Damage: {result.selectedPatron.damage}</Col>
                                                <Col>Penetration: {result.selectedPatron.penetration} ArmorDam%: {result.selectedPatron.armorDamagePerc}</Col>
                                            </Row>

                                            <Row>
                                                <Col className='modBoxes'>
                                                    {result.attachedModsFLat.map((item: TransmissionAttachedMod, i: number) => {
                                                        return (
                                                            <Mod key={JSON.stringify(item)} item={item} />
                                                        )
                                                    })}
                                                </Col>
                                            </Row>
                                        </Container>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </Col>
                </Row>
            </>
    } else {
        content =
            <>
                <Row className="justify-content-md-center">
                    <Col md="auto">
                        <br />
                        <section className="about container">
                            <div className="row gy-0">
                                <div className="col-lg d-flex flex-column justify-content-center">
                                    <div className="content">
                                        <h1 className="card-title">Modded Weapon Builder</h1>
                                        <p></p>
                                        <Form onSubmit={handleSubmit}>
                                            <h2>Build a weapon</h2>
                                            
                                            <FilterRangeSelector
                                                label={"Player Level - Filters Possible Weapons and Mods"}
                                                value={playerLevel}
                                                changeValue={handlePlayerLevelChange}
                                                min={1}
                                                max={50}
                                            />
                                            <Form.Text>Level 20 for LL 2 traders. Level 30 for LL3 Level 40 for LL4.</Form.Text>
                                            <br/><br/>

                                            <SelectSingleWeapon handleWeaponSelection={handleWeaponSelection} weaponOptions={filteredStockWeaponOptions} />
                                            <br/>
                                            <FilterRangeSelector
                                                label={"1-Loud, 2-silenced, 3-any."}
                                                value={muzzleMode}
                                                changeValue={setloudOrSilenced}
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
                                                Submit
                                            </Button>
                                        </Form>
                                        <br />

                                    </div>
                                </div>
                            </div>
                        </section>
                    </Col>
                </Row>
            </>
    }
    return (
        content
    );
}