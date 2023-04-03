import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Accordion, Button, Card, Col, OverlayTrigger, ToggleButton, ToggleButtonGroup, Tooltip } from 'react-bootstrap';
import { AMMO_VS_ARMOR } from '../../Util/links';
import { Link } from 'react-router-dom';
import { requestAmmoAuthorityData } from '../../Context/Requests';



export default function SimplifiedAmmoRatingsTable(props: any) {
    const [ammoData, setAmmoData] = useState([]);
    useEffect(() => {
        const data = JSON.parse(localStorage.getItem('TarkovGunsmith_AmmoData')!);
        if (data) {
          setAmmoData(data);
        }
        else{
          requestAmmoAuthorityData().then(response => {
            setAmmoData(response);
            localStorage.setItem('TarkovGunsmith_AmmoData', JSON.stringify(response));
          }).catch(error => {
            console.error(error);
          });
        }
      }, []);


    //store pagination state in your own state
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 200, //customize the default page size
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)
    interface RatingsTableRow {
        ammo: any
        distancePenetrationPower: number
        distanceDamage: number
        ratings: string[]
        traderCashLevel: number
    }
    const MY_VIOLET = "#fc03f4";
    const MY_PURPLE = "#83048f";
    const MY_BLUE = "#027cbf";
    const MY_GREEN = "#118f2a";
    const MY_YELLOW_BRIGHT = "#f5a700";
    const MY_YELLOW = "#ad8200";
    const MY_ORANGE = "#c45200"
    const MY_RED = "#910d1d";

    const [AmmoTableData, setAmmoTableData] = useState<RatingsTableRow[]>([]);

    const [picturesYesNo, setPicturesYesNo] = useState(false);

    const [distance, setDistance] = useState(15);
    const distances: number[] = [1, 15, 25, 50, 75, 100, 125];

    const handleDistanceChange = (val: any) => setDistance(val);

    const ammos = async () => {
        const response = await fetch(API_URL + `/GetAmmoEffectivenessChartAtDistance/${distance}`);
        setAmmoTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        ammos();
    }, [distance])

    function dealWithMultiShotAmmo(input: string, projectileCount: number) {
        if (projectileCount === 1) {
            return (
                <span>{input}</span>
            )
        }
        else {

            var split1 = input.split('|');
            var split2 = split1[0].split('.');
            var numbers = split2.map((x) => {
                return parseInt(x)
            });

            const renderTooltip = (props: any) => (
                <Tooltip id="button-tooltip" {...props}>
                    Num. pellets: {numbers[0]}.{numbers[1]}.{numbers[2]}
                </Tooltip>
            );

            return (
                <OverlayTrigger
                    placement="top"
                    delay={{ show: 250, hide: 400 }}
                    overlay={renderTooltip}
                >
                    <span>
                        {/* thorax shells */}
                        {`${Math.max(1, Math.ceil(numbers[0] / projectileCount))}.`}

                        {/* head shells */}
                        {`${Math.max(1, Math.ceil(numbers[1] / projectileCount))}.`}

                        {/* leg shells */}
                        {`${Math.max(1, Math.ceil(numbers[2] / projectileCount))} |`}
                        {split1[1]}
                    </span>
                </OverlayTrigger>

            )
        }



    }

    function getTraderConditionalCell(input: number) {
        if (input === 1) {
            return <span style={{ color: MY_ORANGE }}>{(input)}</span>
        }
        else if (input === 2) {
            return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input)}</span>
        }
        else if (input === 3) {
            return <span style={{ color: MY_GREEN }}>{(input)}</span>
        }
        else if (input === 4) {
            return <span style={{ color: MY_BLUE }}>{(input)}</span>
        }
        else {
            return <>n/a</>
        }
    }


    function getEffectivenessColorCode(input: string, projectileCount: number) {
        var thoraxSTK = Number.parseInt(input.split(".").at(0)!, 10);
        if (projectileCount > 1) {
            thoraxSTK = Math.ceil(thoraxSTK / projectileCount)
        }

        if (thoraxSTK === 1) {
            return MY_PURPLE
        }
        else if (thoraxSTK === 2) {
            return MY_BLUE
        }
        else if (thoraxSTK <= 4) {
            return MY_GREEN
        }
        else if (thoraxSTK <= 6) {
            return MY_YELLOW
        }
        else if (thoraxSTK <= 8) {
            return MY_ORANGE
        }
        else {
            return MY_RED
        }
    }
    function damageConditionalColour(input: number) {
        if (input >= 146) {
            return <span style={{ color: MY_VIOLET }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        }
        else if (input >= 110) {
            return <span style={{ color: MY_BLUE }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
        }
        else if (input >= 73) {
            return <span style={{ color: MY_GREEN }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
        }
        else if (input >= 55) {
            return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
        }
        else if (input >= 43) {
            return <span style={{ color: MY_ORANGE }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
        }
        else {
            return <span style={{ color: "red" }}>{(input.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 }))}</span>
        }
    }

    function penetrationConditionalColour(input: number) {
        if (input >= 57) {
            return <span style={{ color: MY_VIOLET }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        }
        else if (input >= 47) {
            return <span style={{ color: MY_BLUE }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        }
        else if (input >= 37) {
            return <span style={{ color: "green" }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        }
        else if (input >= 27) {
            return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        }
        else if (input >= 17) {
            return <span style={{ color: MY_ORANGE }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        }
        else {
            return <span style={{ color: "red" }}>{(input).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}</span>
        }
    }

    function fragmentationCutoff(input: number, penetration: number) {
        if (penetration >= 20) {
            return input;
        }
        else {
            return 0;
        }
    }

    function fragmentationConditionalColour(input: number) {
        if (input > .59) {
            return <span style={{ color: MY_VIOLET }}>{(input * 100).toLocaleString()} %</span>
        }
        else if (input > .49) {
            return <span style={{ color: MY_BLUE }}>{(input * 100).toLocaleString()} %</span>
        }
        else if (input > .29) {
            return <span style={{ color: "green" }}>{(input * 100).toLocaleString()} %</span>
        }
        else if (input > .19) {
            return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input * 100).toLocaleString()} %</span>
        }
        else if (input > .09) {
            return <span style={{ color: MY_ORANGE }}>{(input * 100).toLocaleString()} %</span>
        }
        else {
            return <span style={{ color: "red" }}>{(input * 100).toLocaleString()} %</span>
        }
    }
    function greenRedOrNothing(input: number) {
        if (input > 0) {
            return <span style={{ color: "green" }}>+{(input).toLocaleString()}</span>
        }
        else if (input < 0) {
            return <span style={{ color: "red" }}>{(input).toLocaleString()}</span>
        }
        else {
            return <></>
        }
    }
    function negativeGreen_PositiveRed_OrNothing(input: number) {
        if (input < 0) {
            return <span style={{ color: "green" }}>{(input).toLocaleString()}</span>
        }
        else if (input > 0) {
            return <span style={{ color: "red" }}>+{(input).toLocaleString()}</span>
        }
        else {
            return <></>
        }
    }

    function positiveGreenOrNothing_Percent(input: number) {
        if (input > 0) {
            return <span style={{ color: "green" }}>{(input * 100).toLocaleString()} %</span>
        }
        else {
            return <></>
        }
    }

    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<RatingsTableRow>[]>(
        () => [
            {
                accessorKey: 'ammo.name', //simple recommended way to define a column
                header: 'Name',
                id: 'header_normal',
                muiTableHeadCellProps: { sx: { color: 'green' } }, //custom props
                enableSorting: true,
                filterFn: 'fuzzy',
                Cell: ({ renderedCellValue, row }) => (
                    <>

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                            }}
                        >
                            {picturesYesNo === true &&
                                <img
                                    alt="avatar"
                                    height={40}
                                    src={`https://assets.tarkov.dev/${row.original.ammo.id}-icon.jpg`}
                                    loading="lazy"
                                />
                            }

                            {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                            <span><Link to={`${AMMO_VS_ARMOR}/${row.original.ammo.id}`}>{renderedCellValue}</Link></span>
                        </Box>
                    </>
                ),
            },
            {
                accessorKey: 'ammo.caliber',
                header: 'Cal.',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'distancePenetrationPower',
                header: 'PEN',
                muiTableHeadCellProps: {
                    sx: { color: 'white' },
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },

                Cell: ({ cell }) => (
                    <>
                        {penetrationConditionalColour(cell.getValue<number>())}
                    </>
                )
            },
            {
                accessorKey: 'distanceDamage',
                header: 'DMG',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                filterFn: 'greaterThanOrEqualTo',
                Cell: ({ cell }) => (
                    <>
                        {damageConditionalColour(cell.getValue<number>())}
                    </>
                )
            },
            {
                accessorKey: 'ammo.projectileCount',
                header: 'Projectiles',
                id: 'projectiles',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue<number>()}
                    </>
                )
            },
            {
                accessorKey: 'ammo.fragmentationChance',
                header: 'Frag %',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                filterFn: 'greaterThanOrEqualTo',
                Cell: ({ cell, row }) => (
                    <>
                        {fragmentationConditionalColour(fragmentationCutoff(cell.getValue<number>(), row.original.ammo.penetrationPower))}
                    </>
                )
            },
            {
                accessorKey: 'ammo.lightBleedingDelta',
                header: 'LBC Δ %',
                id: 'LBD',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <>
                        {positiveGreenOrNothing_Percent(cell.getValue<number>())}
                    </>
                )
            },
            {
                accessorKey: 'ammo.heavyBleedingDelta',
                header: 'HBC Δ %',
                id: 'HBD',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <>
                        {positiveGreenOrNothing_Percent(cell.getValue<number>())}
                    </>
                )
            },
            {
                accessorKey: 'ammo.initialSpeed',
                header: 'Initial Speed',
                id: 'InitialSpeed',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue<number>().toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })} m/s
                    </>
                )
            },
            {
                accessorKey: 'ammo.ammoAccuracy',
                header: 'Ammo Acc %',
                size: 10,
                muiTableHeadCellProps: {
                    sx: {
                        color: 'white',
                    },
                },
                muiTableBodyCellProps: {
                    align: 'center',
                    sx: {
                        color: 'white',
                    },
                },
                Cell: ({ cell }) => (
                    <span style={{ display: "inline-block" }}>
                        {greenRedOrNothing(cell.getValue<number>())}
                    </span>
                )
            },
            {
                accessorKey: 'ammo.ammoRec',
                header: 'Recoil',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <>
                        {negativeGreen_PositiveRed_OrNothing(cell.getValue<number>())}
                    </>
                )
            },
            {
                accessorKey: 'ratings',
                header: 'AC 2',
                id: "ac2",
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell, row }) => (
                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(1) + '', row.original.ammo.projectileCount),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        <>
                            {dealWithMultiShotAmmo(cell.getValue<string[]>().at(1)!, row.original.ammo.projectileCount)}
                        </>

                    </Box>
                ),
            },
            {
                accessorKey: 'ratings',
                header: 'AC 3',
                id: "ac3",
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell, row }) => (

                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(2) + '', row.original.ammo.projectileCount),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {dealWithMultiShotAmmo(cell.getValue<string[]>().at(2)!, row.original.ammo.projectileCount)}
                    </Box>
                ),
            },
            {
                accessorKey: 'ratings',
                header: 'AC 4',
                id: "ac4",
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell, row }) => (
                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(3) + '', row.original.ammo.projectileCount),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {dealWithMultiShotAmmo(cell.getValue<string[]>().at(3)!, row.original.ammo.projectileCount)}
                    </Box>
                ),
            },
            {
                accessorKey: 'ratings',
                header: 'AC 5',
                id: "ac5",
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell, row }) => (
                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(4) + '', row.original.ammo.projectileCount),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {dealWithMultiShotAmmo(cell.getValue<string[]>().at(4)!, row.original.ammo.projectileCount)}
                    </Box>
                ),
            },
            {
                accessorKey: 'ratings',
                header: 'AC 6',
                id: "ac6",
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell, row }) => (
                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(5) + '', row.original.ammo.projectileCount),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        {dealWithMultiShotAmmo(cell.getValue<string[]>().at(5)!, row.original.ammo.projectileCount)}
                    </Box>
                ),
            },
            {
                accessorKey: 'traderCashLevel',
                header: 'Trader $ Level',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                Cell: ({ cell }) => (
                    <>
                        {(getTraderConditionalCell(cell.getValue<number>()))}
                    </>
                ),
            },
        ],
        [picturesYesNo],
    );


    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Col xxl>
                    <Card bg="dark" border="secondary" text="light" className="xxl">
                        <Card.Header as="h2" >
                            Ammo Effectiveness Table
                        </Card.Header>
                        <Card.Body>
                            <>
                                This table shows the effectiveness rating of all ammo on the basis of average <strong>Hits to kill</strong> for a given AC like so:<br />
                                &nbsp;
                                <Box
                                    component="span"
                                    sx={() => ({
                                        backgroundColor: getEffectivenessColorCode("3.1.6 | 55%", 1),
                                        borderRadius: '0.25rem',
                                        color: '#fff',
                                        maxWidth: '9ch',
                                        p: '0.25rem',
                                    })}
                                >
                                    <span>3.1.6 | 55%</span>
                                </Box>
                                &nbsp;
                                in the format of: "<strong>HitsToKill[Thorax.Head.Legs] | (First shot penetration chance)</strong>".<br /><br />
                                Each cell is highlighted to how effective it is against a <strong>thorax</strong> target: <br />

                                <ul>

                                    <li className='special_li'>
                                        <Box
                                            component="span"
                                            sx={() => ({
                                                backgroundColor: MY_PURPLE,
                                                borderRadius: '0.25rem',
                                                color: '#fff',
                                                maxWidth: '9ch',
                                                p: '0.25rem',
                                            })}
                                        >
                                            Incredible
                                        </Box>
                                        &nbsp;kills with 1 thorax hit on average.
                                    </li>

                                    <li>
                                        <Box
                                            component="span"
                                            sx={() => ({
                                                backgroundColor: MY_BLUE,
                                                borderRadius: '0.25rem',
                                                color: '#fff',
                                                maxWidth: '9ch',
                                                p: '0.25rem',
                                            })}
                                        >
                                            Excellent
                                        </Box>
                                        &nbsp;kills with 2 thorax hits on average.
                                    </li>
                                    <li>
                                        <Box
                                            component="span"
                                            sx={() => ({
                                                backgroundColor: MY_GREEN,
                                                borderRadius: '0.25rem',
                                                color: '#fff',
                                                maxWidth: '9ch',
                                                p: '0.25rem',
                                            })}
                                        >
                                            Good
                                        </Box>
                                        &nbsp;kills with 3 or 4 thorax hits on average.
                                    </li>
                                    <li>
                                        <Box
                                            component="span"
                                            sx={() => ({
                                                backgroundColor: MY_YELLOW,
                                                borderRadius: '0.25rem',
                                                color: '#fff',
                                                maxWidth: '9ch',
                                                p: '0.25rem',
                                            })}
                                        >
                                            Okay
                                        </Box>
                                        &nbsp;kills with 5 or 6 thorax hits on average.
                                    </li>
                                    <li>
                                        <Box
                                            component="span"
                                            sx={() => ({
                                                backgroundColor: MY_ORANGE,
                                                borderRadius: '0.25rem',
                                                color: '#fff',
                                                maxWidth: '9ch',
                                                p: '0.25rem',
                                            })}
                                        >
                                            Poor
                                        </Box>
                                        &nbsp;kills with 7 or 8 thorax hits on average.
                                    </li>
                                    <li>
                                        <Box
                                            component="span"
                                            sx={() => ({
                                                backgroundColor: MY_RED,
                                                borderRadius: '0.25rem',
                                                color: '#fff',
                                                maxWidth: '9ch',
                                                p: '0.25rem',
                                            })}
                                        >
                                            Terrible
                                        </Box>
                                        &nbsp;kills with 9+ thorax hits on average.
                                    </li>
                                </ul>
                                <Accordion defaultActiveKey="0" flush>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>
                                            Example:&nbsp;<em>5.45x39mm PS gs</em>&nbsp;against armor classes:
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                {/* <li>You will kill a player in 6 leg shots when we account for fragmentation.</li> */}
                                                <li>
                                                    AC 2 &nbsp;
                                                    <Box
                                                        component="span"
                                                        sx={() => ({
                                                            backgroundColor: getEffectivenessColorCode("2.1.6 | 97%", 1),
                                                            borderRadius: '0.25rem',
                                                            color: '#fff',
                                                            maxWidth: '9ch',
                                                            p: '0.25rem',
                                                        })}
                                                    >
                                                        <span>2.1.6 | 97%</span>
                                                    </Box>
                                                    &nbsp; You will usually kill on 2 <strong>thorax</strong> hits, 1 <strong>head</strong> hit, 6 <strong>leg</strong> hits. You have a 97% chance to penetrate this AC on your first hit.
                                                </li>
                                                <li>
                                                    AC 3 &nbsp;
                                                    <Box
                                                        component="span"
                                                        sx={() => ({
                                                            backgroundColor: getEffectivenessColorCode("3.1.6 | 91%", 1),
                                                            borderRadius: '0.25rem',
                                                            color: '#fff',
                                                            maxWidth: '9ch',
                                                            p: '0.25rem',
                                                        })}
                                                    >
                                                        <span>3.1.6 | 91%</span>
                                                    </Box>
                                                    &nbsp; You will usually kill on 3 <strong>thorax</strong> hits, 1 <strong>head</strong> hit, 6 <strong>leg</strong> hits. You have a 91% chance to penetrate this AC on your first hit.
                                                </li>
                                                <li>
                                                    AC 4 &nbsp;
                                                    <Box
                                                        component="span"
                                                        sx={() => ({
                                                            backgroundColor: getEffectivenessColorCode("6.3.6 | 13%", 1),
                                                            borderRadius: '0.25rem',
                                                            color: '#fff',
                                                            maxWidth: '9ch',
                                                            p: '0.25rem',
                                                        })}
                                                    >
                                                        <span>6.3.6 | 13%</span>
                                                    </Box>
                                                    &nbsp; You will usually kill on 6 <strong>thorax</strong> hits, 3 <strong>head</strong> hits, 6 <strong>leg</strong> hits. You have a 13% chance to penetrate this AC on your first hit.
                                                </li>
                                                <li>
                                                    AC 5 &nbsp;
                                                    <Box
                                                        component="span"
                                                        sx={() => ({
                                                            backgroundColor: getEffectivenessColorCode("13.9.6 | 0%", 1),
                                                            borderRadius: '0.25rem',
                                                            color: '#fff',
                                                            maxWidth: '9ch',
                                                            p: '0.25rem',
                                                        })}
                                                    >
                                                        <span>13.9.6 | 0%</span>
                                                    </Box>
                                                    &nbsp; You will usually kill on 13 <strong>thorax</strong> hits, 9 <strong>head</strong> hits, 6 <strong>leg</strong> hits. You have a 0% chance to penetrate this AC on your first hit.
                                                </li>
                                                <li>
                                                    AC 6 &nbsp;
                                                    <Box
                                                        component="span"
                                                        sx={() => ({
                                                            backgroundColor: getEffectivenessColorCode("15.10.6 | 0%", 1),
                                                            borderRadius: '0.25rem',
                                                            color: '#fff',
                                                            maxWidth: '9ch',
                                                            p: '0.25rem',
                                                        })}
                                                    >
                                                        <span>15.10.6 | 0%</span>
                                                    </Box>
                                                    &nbsp; You will usually kill on 15 <strong>thorax</strong> hits, 10 <strong>head</strong> hits, 6 <strong>leg</strong> hits. You have a 0% chance to penetrate this AC on your first hit.
                                                </li>
                                            </ul>

                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <strong>Multi-projectile</strong> rounds are displayed in "Shells to Kill", if you want to see the "Projectiles to Kill", check their tooltip. Number of projectiles is an available column.<br />
                                <strong>Please note:</strong>
                                <ul>
                                    <li>Distance drop-off of damage and penetration is not yet modeled, so marginal cases in practice might take an extra shot.</li>
                                    <li>I've set fragmentation for ammo with less than 20 penetration to 0 to save you from having to cross check it and do it in your head, aren't I nice?</li>
                                </ul>
                            </>
                        </Card.Body>
                    </Card>
                </Col>
                <MaterialReactTable
                    renderTopToolbarCustomActions={({ table }) => (
                        <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                            <ToggleButton
                                size='sm'
                                className="mb-2"
                                id="toggle-check"
                                type="checkbox"
                                variant="outline-primary"
                                checked={picturesYesNo}
                                value="1"
                                onChange={(e) => setPicturesYesNo(e.currentTarget.checked)}
                            >
                                Ammo Pictures on/off
                            </ToggleButton>
                            <Button
                                disabled
                                size='sm'
                                className="mb-2"
                                variant="outline-info"
                            >
                                This table has Projectiles and Light and Heavy 🩸 hidden by default. Press ||| on the top right to show them.
                            </Button>
                            <div className='mb-2'>
                                <ToggleButtonGroup size="sm" type="radio" value={distance} onChange={handleDistanceChange} name="distanceMode">
                                    <ToggleButton size='sm' variant='outline-success' disabled id={"dummy"} value={"dummy"}>
                                        Distance:
                                    </ToggleButton>
                                    {distances.map((item: any, i: number) => {
                                        return (
                                            <ToggleButton size='sm' key={JSON.stringify(item)} variant='outline-success' id={`tbg-btn-dist-${item}`} value={item}>
                                                {item}
                                            </ToggleButton>
                                        )
                                    })}
                                </ToggleButtonGroup>
                            </div>

                        </Box>
                    )}

                    columns={columns}
                    data={AmmoTableData}

                    enableRowSelection={false}//enable some features
                    enableSelectAll={false}

                    // enableRowActions
                    enableColumnFilterModes


                    enableColumnOrdering
                    enableGrouping
                    enablePinning
                    enableMultiSort={true}
                    enableGlobalFilter={true} //turn off a feature
                    enableDensityToggle={false}
                    initialState={{
                        density: 'compact',
                        columnVisibility: {
                            AmmoRec: false,
                            LBD: false,
                            HBD: false,
                            tracer: false,
                            price: false,
                            traderLevel: true,
                            cal: false,
                            projectiles: false
                        },
                        columnPinning: {
                            left: ['header_normal']
                        },
                        pagination: pagination,

                        grouping: ['ammo.caliber'], //an array of columns to group by by default (can be multiple)
                        expanded: true, //expand all groups by default
                        sorting: [{ id: 'ammo.penetrationPower', desc: true }], //sort by state by default
                    }} //hide AmmoRec column by default

                    defaultColumn={{
                        minSize: 10, //allow columns to get smaller than default
                        maxSize: 10, //allow columns to get larger than default
                        size: 10, //make columns wider by default
                    }}
                    enableStickyHeader

                    sortDescFirst
                    muiTablePaginationProps={{
                        rowsPerPageOptions: [10, 25, 50, 75, 100, 150, 200],
                    }}
                />
            </ThemeProvider>
        </>

    )
}