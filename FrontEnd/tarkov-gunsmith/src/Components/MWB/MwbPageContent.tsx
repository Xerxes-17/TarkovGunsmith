import { Alert, Button, Card, Col, Form, Modal, OverlayTrigger, Tooltip, Row, Spinner, Stack, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';

import {
    ActionIcon,
    Button as ManButton,
    Card as ManCard,
    Image,
    Slider, Container,
    SimpleGrid, Group,
    Text, Divider, Title, Input, TextInput, Flex, NumberInput, SegmentedControl, Switch, Checkbox,
    Select as ManSelect,
    Avatar,
    Grid,
    createStyles,
} from '@mantine/core';
import { Box, CardContent, Card as MatCard, ThemeProvider, createTheme } from "@mui/material";

import { MwbContext } from "../../Context/ContextMWB";
import React, { forwardRef, useContext, useMemo, useState } from 'react';

import { OfferType, PurchaseOffer } from '../AEC/AEC_Interfaces';
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { margin } from '@mui/system';
import { handleCopyImage, handleImageDownload } from '../Common/helpers';
import { LinkContainer } from 'react-router-bootstrap';
import { LINKS } from '../../Util/links';

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

type PuchasedModsEntry = {
    PurchaseOffer: any,
    WeaponMod: any
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

    let newTopSection = (

        <ManCard shadow="sm" padding="md" radius="md" withBorder bg={"#212529"} style={{ overflow: "auto" }}>
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

                    <Grid.Col xl={26} lg={26} md={48} >
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

                    </Grid.Col>

                    <Grid.Col xl={22} lg={22} md={48}>
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

                    <Grid.Col xl={26} lg={26} md={33} span={48}>
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
                            <Input.Wrapper id={"test2"} label="Fitting Priority" description="Meta: Filter to best of X, then best of Y." inputWrapperOrder={['label', 'input', 'description', 'error']}>
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

                    <Grid.Col xl={9} lg={9} md={11} span={48}>
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
                                // clearable
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

    function costToolTipElement(rowOriginal: any) {
        var included = false;
        if (result?.BasePreset?.WeaponMods.some((x) => x.Id === rowOriginal.WeaponMod.Id)) {
            included = true;
        }

        const temp = rowOriginal.PurchaseOffer?.PriceRUB ?? "n/a";
        let resultStr = `${temp}`;

        if (temp !== "n/a") {
            resultStr = `₽ ${temp.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}`
        }

        let tooltipContent = <>n/a - Probably only comes with a weapon</>;
        if (included) {
            tooltipContent = <>n/a - Comes with preset</>;
        }


        if (rowOriginal.PurchaseOffer !== null) {
            const currency = currencyStringToSymbol(rowOriginal.PurchaseOffer.Currency);
            
            tooltipContent = (
                <>
                    {rowOriginal.PurchaseOffer.Vendor} level {rowOriginal.PurchaseOffer.MinVendorLevel}
                    <br />
                    {currency} {rowOriginal.PurchaseOffer.Price.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                    <br />
                    {included === true && (
                        <>
                            Comes with preset
                        </>
                    )}
                </>
            )
        }


        const renderTooltip = (props: any) => (
            <Tooltip id="button-tooltip" {...props}>
                {tooltipContent}
            </Tooltip>
        );

        return (
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
                <span>
                    {included === false && typeof(temp) === "string"  && (
                        <>
                            {resultStr}
                        </>
                    )}
                    {included === true && typeof(temp) === "string" &&  (
                        <Text>{resultStr}</Text>
                    )}

                    {included === false && typeof(temp) === "number" &&  (
                        <Text>{resultStr}</Text>
                    )}
                    {included === true && typeof(temp) === "number" &&  (
                        <Text td="line-through">{resultStr}</Text>
                    )}

                </span>
            </OverlayTrigger>
        )
    }
    const [picturesYesNo, setPicturesYesNo] = useState(false);

    const columns = useMemo<MRT_ColumnDef<PuchasedModsEntry>[]>(
        () => [
            {
                id: 'name',
                accessorFn: (row) => row.WeaponMod.Name,
                header: 'Name',
                size: 300,
                muiTableHeadCellProps: {
                    align: 'left',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
                Cell: ({ renderedCellValue, row }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        {picturesYesNo === true &&
                            <Image
                                src={`https://assets.tarkov.dev/${row.original.WeaponMod.Id}-grid-image.jpg`}
                                alt="avatar"
                                height={50}
                                maw={200}
                                fit="scale-down"
                            />
                        }
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
            },
            {
                id: 'ergonomics',
                accessorFn: (row) => row.WeaponMod.Ergonomics,
                header: 'Ergonomics',
                size: 50,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                id: 'recoil',
                accessorFn: (row) => row.WeaponMod.Recoil,
                header: 'Recoil',
                size: 50,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                id: 'cost',
                accessorFn: (row) => row.PurchaseOffer?.PriceRUB ?? 'Default Value',
                header: 'Cost',
                size: 50,
                muiTableHeadCellProps: {
                    align: 'right',
                },
                muiTableBodyCellProps: {
                    align: 'right',
                },
                Cell: ({ renderedCellValue, row }) => {
                    return (
                        <>
                            {costToolTipElement(row.original)}
                        </>
                    )
                },
            },
        ],
        [picturesYesNo],
    );

    //store pagination state in your own state
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 50, //customize the default page size
    });

    function currencyStringToSymbol(str: string) {
        if (str.includes("USD"))
            return "$"
        else if (str.includes("EUR"))
            return "€"
        else if (str.includes("RUB"))
            return "₽"
        else
            return ""
    }

    interface WeaponStatProps {
        statCurrent: number;
        statPreset: number;
        statBase: number;
        decimalPlaces: number;
    }

    function WeaponStat({
        statCurrent,
        statPreset,
        statBase,
        decimalPlaces,
    }: WeaponStatProps) {
        let tooltipContent = (
            <>
                Preset: {statPreset.toFixed(decimalPlaces)} <br />
                Base: {statBase.toFixed(decimalPlaces)}
            </>
        );

        const renderTooltip = (props: any) => (
            <Tooltip id="button-tooltip" {...props}>
                {tooltipContent}
            </Tooltip>
        );

        return (
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
                <span>
                    {statCurrent.toFixed(decimalPlaces)}
                </span>
            </OverlayTrigger>
        );
    }


    let newResultsSection;

    if (result !== undefined) {
        console.log(result)

        let RoF = result.BasePreset?.Weapon.bFirerate;

        if(result.BasePreset?.Weapon.weapFireType.length === 1 && result.BasePreset?.Weapon.weapFireType[0].includes("Single")){
            RoF = result.BasePreset?.Weapon.SingleFireRate;
        }

        const headersRow1 =
            <>
                <TableCell align="center">Weight</TableCell>
                <TableCell align="center">Ergonomics</TableCell>
                <TableCell align="center">Recoil</TableCell>
                <TableCell align="center">Convergence</TableCell>
            </>
        const headersRow2 =
            <>
                <TableCell align="center">Recoil Dispersion</TableCell>
                <TableCell align="center">Recoil Angle</TableCell>
                <TableCell align="center">Camera Recoil</TableCell>
                <TableCell align="center">Camera Snap</TableCell>
            </>

        const bodyRow1 =
            <>
                <TableCell align="center">
                    <WeaponStat
                        statCurrent={result.Weight!}
                        statPreset={result.BasePreset!.Weight}
                        statBase={result.BasePreset!.Weapon.Weight}
                        decimalPlaces={2}
                    />
                    {' '}
                    kg
                </TableCell>
                <TableCell align="center">
                    <WavingHandIcon style={{ fontSize: "15px" }} />
                    {' '}
                    <WeaponStat
                        statCurrent={result.Ergonomics!}
                        statPreset={result.BasePreset!.Ergonomics}
                        statBase={result.BasePreset!.Weapon.Ergonomics}
                        decimalPlaces={1}
                    />
                </TableCell>
                <TableCell align="center">
                    <FileUploadIcon fontSize='small' />
                    {' '}
                    <WeaponStat
                        statCurrent={result.Recoil_Vertical!}
                        statPreset={result.BasePreset!.Recoil_Vertical}
                        statBase={result.BasePreset!.Weapon.RecoilForceUp}
                        decimalPlaces={1}
                    />
                </TableCell>
                <TableCell align="center"><FileDownloadIcon fontSize='small' /> {result.BasePreset?.Weapon.Convergence.toFixed(2)}</TableCell>
            </>
        const bodyRow2 =
            <>
                <TableCell align="center">
                    <FileUploadIcon fontSize='small' style={{ rotate: "270deg" }} />
                    <FileUploadIcon fontSize='small' style={{ rotate: "90deg" }} />
                    {' ' + result.BasePreset?.Weapon.RecolDispersion}
                </TableCell>
                <TableCell align="center"><TrendingFlatIcon style={{ rotate: `${-result.BasePreset?.Weapon.RecoilAngle}deg` }} />{result.BasePreset?.Weapon.RecoilAngle}</TableCell>
                <TableCell align="center">{result.BasePreset?.Weapon.CameraRecoil}</TableCell>
                <TableCell align="center">{result.BasePreset?.Weapon.CameraSnap}</TableCell>
            </>
        newResultsSection = (
            <>

                <ManCard className='MWBresultCard' id='MWVBprintID'>
                    <Group noWrap>
                        <h2 className='MWBresultCardTitle'>{result.BasePreset!.Weapon!.Name}</h2>
                        {/* Disabled for now due to cors being a bitch */}
                        {/* <div className="ms-auto">
                            <Stack direction='horizontal' gap={2}>
                                <Button size='sm' variant="outline-info" onClick={() => handleImageDownload('MWVBprintID')}>Download 📩</Button>
                                <Button size='sm' variant="outline-info" onClick={() => handleCopyImage('MWVBprintID')}>Copy 📋</Button>
                            </Stack>
                        </div> */}
                    </Group>
                    <ManCard.Section>
                        <Divider size="sm" />
                    </ManCard.Section>
                    <Grid columns={48} pt={4}>
                        <Grid.Col xl={12} lg={12} md={12} span={48}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-around',
                                    alignItems: 'center',
                                }}
                            >
                                <Image
                                    src={`https://assets.tarkov.dev/${result?.BasePreset?.Id.split("_")[0]}-grid-image.webp`}
                                    alt="avatar"
                                    // mah={105}
                                    maw={305}
                                    fit="scale-down"
                                    withPlaceholder
                                />
                            </Box>
                        </Grid.Col>
                        <Grid.Col xl={36} lg={36} md={36} span={48}>
                            <Paper elevation={1}>
                                <TableContainer className='WideWeaponSummary'>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow >
                                                {headersRow1}
                                                {headersRow2}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow >
                                                {bodyRow1}
                                                {bodyRow2}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                                <TableContainer className='NarrowWeaponSummary'>
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow >
                                                {headersRow1}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow >
                                                {bodyRow1}
                                            </TableRow>

                                        </TableBody>
                                    </Table>

                                </TableContainer>
                                <TableContainer className='NarrowWeaponSummary' >
                                    <Table aria-label="simple table">
                                        <TableHead>
                                            <TableRow >
                                                {headersRow2}
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow >
                                                {bodyRow2}
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        </Grid.Col>
                    </Grid>


                    <Grid columns={48}>
                        <Grid.Col xl={12} lg={12} md={12} span={48}>
                            <MatCard>
                                <CardContent>
                                    <table style={{ padding: "5px", width: "100%" }}>
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
                                    </table>
                                </CardContent>
                            </MatCard>
                            <MatCard sx={{ marginTop: "5px" }}>
                                <CardContent>
                                    <table style={{ width: "100%" }}>
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
                            </MatCard>
                        </Grid.Col>
                        <Grid.Col xl={36} lg={36} md={36} span={48}>
                            <MaterialReactTable
                                columns={columns}
                                data={result.PurchasedMods.List}
                                renderTopToolbarCustomActions={({ table }) => (
                                    <>
                                        <h3 style={{ paddingTop: 6, marginBottom: 0 }}>Attached Mods</h3>
                                        {/* <div className="ms-auto" style={{ paddingTop: 4 }}>
                                                        <ManButton onClick={() => { }}>Update exclusion list</ManButton>
                                                    </div> */}
                                    </>
                                )}
                                positionToolbarAlertBanner="none"
                                enableToolbarInternalActions={false}

                                enableSelectAll={false}
                                enableGlobalFilter={false}
                                enableFilters={false}
                                enableHiding={false}
                                enableFullScreenToggle={false}
                                enableDensityToggle={false}
                                enableTableHead
                                enableBottomToolbar={false}
                                enableColumnActions={false}
                                enableStickyHeader
                                muiTableContainerProps={{ sx: { maxHeight: '60vh' } }}
                                // enableRowSelection
                                initialState={{
                                    // columnPinning: { right: ['mrt-row-select'] },
                                    density: "compact",
                                    pagination: pagination,
                                }}
                                // displayColumnDefOptions={{
                                //     'mrt-row-select': {
                                //         header: 'Exclude?'
                                //     }
                                // }}
                                renderDetailPanel={({ row }) => (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            justifyContent: 'space-around',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Image
                                            src={`https://assets.tarkov.dev/${row.original.WeaponMod.Id}-grid-image.webp`}
                                            alt="avatar"
                                            height={50}
                                            maw={200}
                                            fit="scale-down" />
                                        <Box sx={{ textAlign: 'center' }}>
                                            {row.original.WeaponMod.Description}
                                        </Box>
                                        {/* Disabled until I can work out a better way of doing this */}
                                        {/* <Box sx={{ textAlign: 'center' }}>
                                            {row.original.PurchaseOffer !== null &&
                                                <>
                                                    {row.original.PurchaseOffer?.Vendor} level {row.original.PurchaseOffer?.MinVendorLevel}
                                                    <br />
                                                    {row.original.PurchaseOffer?.Currency ? currencyStringToSymbol(row.original.PurchaseOffer?.Currency) : ""}
                                                    {' '}
                                                    {row.original.PurchaseOffer?.Price.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                                                </>
                                            }
                                            {row.original.PurchaseOffer === null &&
                                                <>
                                                    -
                                                </>
                                            }
                                        </Box> */}
                                    </Box>
                                )} />
                        </Grid.Col>
                    </Grid>

                </ManCard>


            </>
        )
    }
    else {
        newResultsSection = (
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
    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });



    let content = (

        <Container size="xl" px="xs" pt="xs" pb={{ base: '3rem', xs: '2rem', md: '1rem' }}>
            <SimpleGrid
                cols={1}
                spacing="xs"
                verticalSpacing="sm"
            >
                {newTopSection}
                {newResultsSection}
                {/*{dataCurveSection}*/}
            </SimpleGrid>
        </Container>
    );
    return (
        <ThemeProvider theme={darkTheme}>
            {content}
        </ThemeProvider>

    );
}
