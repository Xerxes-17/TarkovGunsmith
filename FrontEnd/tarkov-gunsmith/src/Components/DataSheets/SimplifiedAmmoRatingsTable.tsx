import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Accordion, Card, Col, ToggleButton } from 'react-bootstrap';
export default function SimplifiedAmmoRatingsTable(props: any) {
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

    const ammos = async () => {
        const response = await fetch(API_URL + '/GetCondensedAmmoEffectivenessTable');
        setAmmoTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        ammos();
    }, [])

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


    function getEffectivenessColorCode(input: string) {
        var thoraxSTK = Number.parseInt(input.split(".").at(0)!, 10);
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
            return <span style={{ color: MY_VIOLET }}>{(input)}</span>
        }
        else if (input >= 110) {
            return <span style={{ color: MY_BLUE }}>{(input)}</span>
        }
        else if (input >= 73) {
            return <span style={{ color: MY_GREEN }}>{(input)}</span>
        }
        else if (input >= 55) {
            return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input)}</span>
        }
        else if (input >= 43) {
            return <span style={{ color: MY_ORANGE }}>{(input)}</span>
        }
        else {
            return <span style={{ color: "red" }}>{(input)}</span>
        }
    }

    function penetrationConditionalColour(input: number) {
        if (input >= 57) {
            return <span style={{ color: MY_VIOLET }}>{(input).toLocaleString()}</span>
        }
        else if (input >= 47) {
            return <span style={{ color: MY_BLUE }}>{(input).toLocaleString()}</span>
        }
        else if (input >= 37) {
            return <span style={{ color: "green" }}>{(input).toLocaleString()}</span>
        }
        else if (input >= 27) {
            return <span style={{ color: MY_YELLOW_BRIGHT }}>{(input).toLocaleString()}</span>
        }
        else if (input >= 17) {
            return <span style={{ color: MY_ORANGE }}>{(input).toLocaleString()}</span>
        }
        else {
            return <span style={{ color: "red" }}>{(input).toLocaleString()}</span>
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
                            <span>{renderedCellValue}</span>
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
                accessorKey: 'ammo.penetrationPower',
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
                accessorKey: 'ammo.damage',
                header: 'DAM',
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
                accessorKey: 'ammo.fragmentationChance',
                header: 'Frag %',
                muiTableHeadCellProps: {
                    sx: { color: 'white' }
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
                filterFn: 'greaterThanOrEqualTo',
                Cell: ({ cell }) => (
                    <>
                        {fragmentationConditionalColour(cell.getValue<number>())}
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
                    <span style={{ display: "inline-block"}}>
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
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(0) + ''),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        <span>{(cell.getValue<string[]>().at(0))}</span>
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
                Cell: ({ cell }) => (

                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(1) + ''),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        <span>{(cell.getValue<string[]>().at(1))}</span>
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
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(2) + ''),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        <span>{(cell.getValue<string[]>().at(2))}</span>
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
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(3) + ''),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        <span>{(cell.getValue<string[]>().at(3))}</span>
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
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={() => ({
                            backgroundColor: getEffectivenessColorCode(cell.getValue<string>().at(4) + ''),
                            borderRadius: '0.25rem',
                            color: '#fff',
                            maxWidth: '9ch',
                            p: '0.25rem',
                        })}
                    >
                        <span>{(cell.getValue<string[]>().at(4))}</span>
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
                                This table shows the effectiveness rating of all ammo with 20 penetration and above* on the basis of average <strong>shots to kill</strong> for a given AC.<br /><br />
                                The format is: "<strong>Thorax.Head.Legs | FirstShotPenChance</strong>".<br /><br />
                                Each cell is highlighted to how effective it is against a <strong>thorax</strong> target: <br />

                                <ul>
                                    <li><strong>Purple</strong> Kills with 1 thorax hit on average. (Incredible)</li>
                                    <li><strong>Blue</strong> Kills with 2 thorax hits on average. (Excellent)</li>
                                    <li><strong>Green</strong> Kills with 3 or 4 thorax hits on average. (Good)</li>
                                    <li><strong>Yellow</strong> Kills with 5 or 6 thorax hits on average. (Okay)</li>
                                    <li><strong>Orange</strong> Kills with 7 or 8 thorax hits on average. (Poor)</li>
                                    <li><strong>Red</strong> Kills with 9+ thorax hits on average.     (Terrible)</li>
                                </ul>
                                <Accordion defaultActiveKey="0" flush>
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header>Example with 5.45 PS gs</Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                <li>You will kill a player in 6 leg shots when we account for fragmentation.</li>
                                                <li>Against class 2 armor, such as a PACA, you will almost always kill on two shots to thorax, and with a class 2 headgear like the Heavy-Trooper mask, in one shot.</li>
                                                <li>Against class 3 armor, such as the Kirasa-N, you will almost always kill on three shots to the thorax, and against a 6B47 Ratnik helmet, in one shot.</li>
                                                <li>Against class 4 armor, such as the 6B3TM-01M RatRig, you will on average kill on six shots to the thorax, and against a TC-2001, in 3 shots. So just mag-dump center of mass.</li>
                                                <li>Against class 5 and 6 armor you hit the wall where you will need 13 or more shots to kill on thorax, and more than 9 on the head. You should aim at their legs instead!</li>
                                            </ul>

                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <br />
                                Please note that <strong>Flechette</strong> rounds haven't had their special edge case addressed yet.<br />
                                *This is because my model doesn't account for the lower pen rounds yet or AC 1 equipment, I'll get around to it soon I swear! <br />
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
                                    Ammo Pictures
                                </ToggleButton>
                            </>
                        </Card.Body>
                    </Card>
                </Col>
                <MaterialReactTable
                    columns={columns}
                    data={AmmoTableData}

                    enableRowSelection={false}//enable some features
                    enableSelectAll={false}

                    // enableRowActions
                    // enableColumnFilterModes

                    
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
                            cal: false
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