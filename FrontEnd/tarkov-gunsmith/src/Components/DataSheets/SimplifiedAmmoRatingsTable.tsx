import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Card, Col } from 'react-bootstrap';
export default function SimplifiedAmmoRatingsTable(props: any) {
    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)
    interface RatingsTableRow {
        ammo: any
        ratings: string[]
    }

    const [AmmoTableData, setAmmoTableData] = useState<RatingsTableRow[]>([]);

    const ammos = async () => {
        const response = await fetch(API_URL + '/GetCondensedAmmoEffectivenessTable');
        setAmmoTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        ammos();
    }, [])



    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<RatingsTableRow>[]>(
        () => [
            {
                accessorKey: 'ammo.name', //simple recommended way to define a column
                header: 'Name',
                muiTableHeadCellProps: { sx: { color: 'green' } }, //custom props
                size: 50, //small column
                enableSorting: true,
                Cell: ({ renderedCellValue, row }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <img
                            alt="avatar"
                            height={40}
                            src={`https://assets.tarkov.dev/${row.original.ammo.id}-icon.jpg`}
                            loading="lazy"
                        />
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
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
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'ammo.damage',
                header: 'DAM',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'ratings',
                header: 'AC 2',
                id:"ac2",
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue<string>().at(0)?.includes("0.")
                                    ? "#fc03f4"
                                    : cell.getValue<string>().at(0)?.includes("1.")
                                        ? theme.palette.info.dark
                                        : cell.getValue<string>().at(0)?.includes("2.")
                                            ? theme.palette.success.dark
                                            : cell.getValue<string>().at(0)?.includes("3.")
                                                ? theme.palette.warning.main
                                                : cell.getValue<string>().at(0)?.includes("4.")
                                                    ? "#fc6b03"
                                                    : theme.palette.error.dark,
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
                id:"ac3",
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue<string>().at(1)?.includes("0.")
                                    ? "#fc03f4"
                                    : cell.getValue<string>().at(1)?.includes("1.")
                                        ? theme.palette.info.dark
                                        : cell.getValue<string>().at(1)?.includes("2.")
                                            ? theme.palette.success.dark
                                            : cell.getValue<string>().at(1)?.includes("3.")
                                                ? theme.palette.warning.main
                                                : cell.getValue<string>().at(1)?.includes("4.")
                                                    ? "#fc6b03"
                                                    : theme.palette.error.dark,
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
                id:"ac4",
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue<string>().at(2)?.includes("0.")
                                    ? "#fc03f4"
                                    : cell.getValue<string>().at(2)?.includes("1.")
                                        ? theme.palette.info.dark
                                        : cell.getValue<string>().at(2)?.includes("2.")
                                            ? theme.palette.success.dark
                                            : cell.getValue<string>().at(2)?.includes("3.")
                                                ? theme.palette.warning.main
                                                : cell.getValue<string>().at(2)?.includes("4.")
                                                    ? "#fc6b03"
                                                    : theme.palette.error.dark,
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
                id:"ac5",
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue<string>().at(3)?.includes("0.")
                                    ? "#fc03f4"
                                    : cell.getValue<string>().at(3)?.includes("1.")
                                        ? theme.palette.info.dark
                                        : cell.getValue<string>().at(3)?.includes("2.")
                                            ? theme.palette.success.dark
                                            : cell.getValue<string>().at(3)?.includes("3.")
                                                ? theme.palette.warning.main
                                                : cell.getValue<string>().at(3)?.includes("4.")
                                                    ? "#fc6b03"
                                                    : theme.palette.error.dark,
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
                id:"ac6",
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (
                    <Box
                        component="span"
                        sx={(theme) => ({
                            backgroundColor:
                                cell.getValue<string>().at(4)?.includes("0.")
                                    ? "#fc03f4"
                                    : cell.getValue<string>().at(4)?.includes("1.")
                                        ? theme.palette.info.dark
                                        : cell.getValue<string>().at(4)?.includes("2.")
                                            ? theme.palette.success.dark
                                            : cell.getValue<string>().at(4)?.includes("3.")
                                                ? theme.palette.warning.main
                                                : cell.getValue<string>().at(4)?.includes("4.")
                                                    ? "#fc6b03"
                                                    : theme.palette.error.dark,
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
        ],
        [],
    );

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
                                This table shows the effectiveness rating of all ammo with 20 penetration and above* on the basis of <strong>shots to kill</strong> with the following combined scale:
                                <ul>
                                    <li><strong>0. </strong> Kills with 1 thorax hit on average. (Incredible)</li>
                                    <li><strong>1. </strong> Kills with 2 thorax hits on average. (Excellent)</li>
                                    <li><strong>2. </strong> Kills with 3 or 4 thorax hits on average. (Good)</li>
                                    <li><strong>3. </strong> Kills with 5 or 6 thorax hits on average. (Okay)</li>
                                    <li><strong>4. </strong> Kills with 7 or 8 thorax hits on average. (Poor)</li>
                                    <li><strong>5. </strong> Kills with 9+ thorax hits on average.     (Terrible)</li>
                                </ul>
                                <ul>
                                    <li><strong>.A </strong> Kills with 1 head-shot on average. (Excellent)</li>
                                    <li><strong>.B </strong> Kills with 2 head-shots on average. (Okay)</li>
                                    <li><strong>.C </strong> Kills with 3 head-shots or more on average. (Poor to Terrible)</li>
                                </ul>

                                Let's take the example of the 5.45 PS gs round. <br />
                                Against class 2 armor, such as a PACA, you will almost always kill on two shots to thorax, and with a class 2 headgear like the Heavy-Trooper mask, in one shot.<br />
                                Against class 3 armor, such as the Kirasa-N, you will almost always kill on three shots to the thorax, and against a 6B47 Ratnik helmet, in one shot.<br />
                                Against class 4 armor, such as the 6B3TM-01M RatRig, you will on average kill on six shots to the thorax, and against a TC-2001, in 3 shots.<br />
                                Against class 5 and 6 armor you hit the wall where you will need 9 or more shots to kill on thorax, and more than 3 on the head. You should aim at their legs instead!<br />
                                <br />
                                Please note that <strong>Flechette</strong> rounds haven't had their special edge case addressed yet.<br />
                                *This is because my model doesn't account for the lower pen rounds yet or AC 1 equipment, I'll get around to it soon I swear!
                            </>
                        </Card.Body>
                    </Card>
                </Col>
                <MaterialReactTable
                    columns={columns}
                    data={AmmoTableData}

                    enableRowSelection={false}//enable some features
                    enableSelectAll={false}

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
                            heavyBleedDelta: false,
                            lightBleedDelta: false,
                            tracer: false,
                            price: false,
                            traderLevel: false
                        },
                        pagination: pagination,

                        grouping: ['ammo.caliber'], //an array of columns to group by by default (can be multiple)
                        expanded: true, //expand all groups by default
                        sorting: [{ id: 'ammo.penetrationPower', desc: true }], //sort by state by default
                    }} //hide AmmoRec column by default

                    defaultColumn={{
                        minSize: 10, //allow columns to get smaller than default
                        maxSize: 75, //allow columns to get larger than default
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