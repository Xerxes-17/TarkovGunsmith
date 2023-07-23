import { Alert, Button, Card, Col, Form, Modal, Row, Spinner, Stack, ToggleButton, ToggleButtonGroup } from "react-bootstrap";

import {
    ActionIcon,
    Button as ManButton,
    Card as ManCard,
    Image as ManImage,
    Slider, Container,
    SimpleGrid, Group,
    Text, Badge, Divider, Title, Input, TextInput, Flex, NumberInput, SegmentedControl, Switch, Checkbox, Tooltip,
    Select as ManSelect,
    Avatar,
    Grid
} from '@mantine/core';

import { MwbContext } from "../../Context/ContextMWB";
import React, { forwardRef, useContext } from 'react';
import Mod from "./Mod";
import FilterRangeSelector from "../Forms/FilterRangeSelector";

import Select from 'react-select'
import { OfferType, PurchaseOffer } from '../AEC/AEC_Interfaces';

const marks = [
    { value: 15, label: '15' },
    { value: 20, label: '20' },
    { value: 30, label: '30' },
    { value: 40, label: '40' },
];

// Helper function to get the enum key based on its numerical value
function getEnumKeyByValue(enumObj: any, enumValue: number): string | undefined {
    return Object.keys(enumObj).find((key) => enumObj[key] === enumValue);
}

export const MwbPageContent = () => {
    interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
        imageLink: string;
        label: string;
        description: string;
        priceRUB: number;
        offerType: number
    }

    const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
        ({ imageLink, label, description, priceRUB, offerType, ...others }: ItemProps, ref) => (
            <div ref={ref} {...others}>
                <Group noWrap>
                    <Avatar src={imageLink} />

                    <div>
                        <Text size="sm">{label}</Text>
                        <Text size="xs" opacity={0.65}>
                            {getEnumKeyByValue(OfferType, offerType)} ₽ {priceRUB.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                        </Text>
                    </div>
                </Group>
            </div>
        )
    );
    const {
        searchValue,
        playerLevel,
        weaponOptions,
        purchaseOfferTypes,
        filteredWeaponOptions,
        chosenGun,
        result,
        praporLevel,
        skierLevel,
        mechanicLevel,
        peacekeeperLevel,
        jaegerLevel,
        muzzleModeToggle,
        fittingPriority,
        show,
        handleMDMChange,
        handleFPChange,
        handlePOTChange,
        handleSubmit,
        handlePlayerLevelChange,
        handleWeaponSelectionChange,
        handleClose,
        handleShow,
    } = useContext(MwbContext);


    let ModalInfo = (
        <>
            <Button variant="info" onClick={handleShow} style={{ marginBottom: "5px" }}>
                Info
            </Button>

            <Modal show={show} onHide={handleClose}>
                <div style={{ backgroundColor: "#2f3036" }} >
                    <Modal.Header closeButton>
                        <Modal.Title>Information - MWB</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
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
                </div>
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
                        options={filteredWeaponOptions}
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
                                <ToggleButtonGroup size="sm" type="checkbox" name="PurchaseOfferTypes" value={purchaseOfferTypes} onChange={(e) => {
                                    console.log("e", e)
                                    handlePOTChange(e)
                                }} >
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
                                <ToggleButtonGroup size="sm" type="radio" name="MuzzleDeviceMode" value={muzzleModeToggle} onChange={handleMDMChange} >
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
                                <ToggleButtonGroup size="sm" type="radio" name="FittingPriority" value={fittingPriority} onChange={handleFPChange}>
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
                        {weaponOptions.length === 0 && (
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
                        {weaponOptions.length > 0 && (
                            <>
                                <br />
                                <strong>Available Choices:</strong> {filteredWeaponOptions.length} <br />
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
                                    <img src={`https://assets.tarkov.dev/${result.BasePreset!.Id.split("_")[0]}-grid-image.jpg`} alt={result.BasePreset!.Weapon!.ShortName} className={"mod_img"} />
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

    let newContent = (

        <ManCard shadow="sm" padding="md" radius="md" withBorder bg={"#212529"} style={{overflow:"scroll"}}>
            <Form onSubmit={handleSubmit}>
                <Stack direction="horizontal" gap={3}>
                    <h2>Modded Weapon Builder</h2>
                    <div className="ms-auto">
                        {ModalInfo}
                    </div>
                </Stack>

                <ManCard.Section>
                    <Divider size="sm" />
                </ManCard.Section>

                <Grid columns={48}>

                    <Grid.Col xl={15} lg={24} md={48}>
                        <Input.Wrapper id={"test"} label="Player Level - Changes access to purchase offers">
                            <Flex
                                gap="sm"
                                direction="row"
                            >
                                <Slider
                                    w={"100%"}
                                    py={5}
                                    marks={marks}
                                    value={playerLevel}
                                    min={1}
                                    max={40}
                                    step={1}
                                    label={(value) => value.toFixed(0)}
                                    onChange={handlePlayerLevelChange}
                                    onChangeEnd={handlePlayerLevelChange}
                                />
                                <NumberInput
                                    maw={70}
                                    miw={70}
                                    value={playerLevel}
                                    min={1}
                                    max={40}
                                    onChange={handlePlayerLevelChange}
                                />
                            </Flex>
                        </Input.Wrapper>
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
                    </Grid.Col>

                    <Grid.Col xl={25} lg={16} md={34}>
                        <Group>
                            <Input.Wrapper id={"test1"} label="Muzzle Device Mode" description="Any will choose from both loud + silenced." inputWrapperOrder={['label', 'input', 'description', 'error']} >
                                <br />
                                <SegmentedControl
                                    value={muzzleModeToggle}
                                    onChange={handleMDMChange}
                                    fullWidth
                                    color="blue"
                                    id="test1"
                                    data={[
                                        { label: 'Loud', value: 'Loud' },
                                        { label: 'Silenced', value: 'Quiet' },
                                        { label: 'Any', value: 'Any' },
                                    ]}
                                />
                            </Input.Wrapper>
                            <Input.Wrapper id={"test2"} label="Fitting Priority" description="Meta: Choose best of X, then best of Y." inputWrapperOrder={['label', 'input', 'description', 'error']}>
                                <br />
                                <SegmentedControl
                                    style={{ whiteSpace: "normal", height: "100%" }}
                                    value={fittingPriority}
                                    onChange={handleFPChange}
                                    color="blue"
                                    id="test2"
                                    data={[
                                        { label: 'Recoil', value: 'Recoil' },
                                        { label: 'Meta Recoil', value: 'MetaRecoil' },
                                        { label: 'Ergonomics', value: 'Ergonomics' },
                                        { label: 'Meta Ergonomics', value: 'MetaErgonomics' },
                                    ]}
                                />
                            </Input.Wrapper>
                        </Group>
                    </Grid.Col>
                    <Grid.Col xl={8} lg={8} md={12} sm={14}>
                        <Input.Wrapper id={"test3"} label="Weapon Purchase Offer Filter" description="Must choose at least one" inputWrapperOrder={['label', 'input', 'description', 'error']}>
                            <br />
                            <ToggleButtonGroup type="checkbox" name="PurchaseOfferTypes" value={purchaseOfferTypes} onChange={(val) => {
                                handlePOTChange(val)
                            }} >
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
                        </Input.Wrapper>

                    </Grid.Col>
                    <Grid.Col span={48}>

                        {weaponOptions.length === 0 && (
                            <>
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
                            </>
                        )}
                        {weaponOptions.length > 0 && (
                            <ManSelect
                                value={chosenGun}
                                onChange={handleWeaponSelectionChange}
                                withinPortal
                                label={<Text fz="sm">Available Choices: {filteredWeaponOptions.length} </Text>}
                                placeholder="Select your weapon..."
                                itemComponent={SelectItem}
                                data={filteredWeaponOptions}
                                searchable
                                maxDropdownHeight={400}
                                nothingFound="No weapons found."
                                required
                                withAsterisk={false}
                                clearable
                                searchValue={searchValue}
                            />
                        )}
                    </Grid.Col>

                </Grid>
                <ManButton variant="filled" color="teal" fullWidth mt="md" radius="md" uppercase type="submit">
                    Build
                </ManButton>
            </Form>
        </ManCard>
    )

    let content = (

        <Container size="xl" px="xs" pt="xs" pb={{ base: '3rem', xs: '2rem', md: '1rem' }}>
            <SimpleGrid
                cols={1}
                spacing="xs"
                verticalSpacing="sm"
            >
                {newContent}
                {/* {TopSection} */}
                {ResultsSection}
                {/*{dataCurveSection}*/}
            </SimpleGrid>
        </Container>
    );
    return (
        content
    );
}
