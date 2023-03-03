import { Box } from "@mui/material"
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table"
import { useState, useEffect, useMemo } from "react"
import { Col, Card } from "react-bootstrap"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { API_URL } from "../../Util/util"

export default function DataSheetEffectivenessArmor(props: any) {
    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)
    interface effectivenessDataRow {
        ammoId: string
        ammoName: string

        armorId: string
        armorName: string

        firstShot_PenChance: number
        firstShot_PenDamage: number
        firstShot_BluntDamage: number
        firstShot_ArmorDamage: number
        expectedShotsToKill: number
        expectedKillShotConfidence: number
    }

    const [ArmorTableData, setArmorTableData] = useState<effectivenessDataRow[]>([]);

    const armors = async () => {
        const response = await fetch(API_URL + '/GetArmorEffectivenessData');
        setArmorTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        armors();
    }, [])

    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<effectivenessDataRow>[]>(
        () => [
            {
                accessorKey: 'ammoName', //simple recommended way to define a column
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
                            src={`https://assets.tarkov.dev/${row.original.ammoId}-icon.jpg`}
                            loading="lazy"
                        />
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
            },
            {
                accessorKey: 'firstShot_PenChance',
                header: 'FirstShot PenChance',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'firstShot_PenDamage',
                header: 'FirstShot PenDamage',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'firstShot_BluntDamage',
                header: 'FirstShot BluntDamage',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'firstShot_ArmorDamage',
                header: 'FirstShot ArmorDamage',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'expectedShotsToKill',
                header: 'Expected Shots To Kill',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
            },
            {
                accessorKey: 'expectedKillShotConfidence',
                header: 'Killshot Confidence',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },

        ],
        [],
    );

    //store pagination state in your own state
    const [pagination, setPagination] = useState({
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
                        <Card.Body>
                            <>
                                This table starts with a few columns hidden by default. Press "Show/Hide Columns" on the right to change what is visible.
                                <MaterialReactTable
                                    columns={columns}
                                    data={ArmorTableData}

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

                                        grouping: ['expectedShotsToKill'], //an array of columns to group by by default (can be multiple)
                                        expanded: true, //expand all groups by default
                                        sorting: [{ id: 'expectedShotsToKill', desc: false }, { id: 'expectedKillShotConfidence', desc: true }], //sort by state by default
                                    }} //hide AmmoRec column by default

                                    defaultColumn={{
                                        minSize: 20, //allow columns to get smaller than default
                                        maxSize: 75, //allow columns to get larger than default
                                        size: 20, //make columns wider by default
                                    }}
                                    enableStickyHeader

                                    sortDescFirst
                                    muiTablePaginationProps={{
                                        rowsPerPageOptions: [10, 25, 50, 75, 100, 150, 200],
                                    }}
                                />
                            </>
                        </Card.Body>
                    </Card>
                </Col>
            </ThemeProvider>
        </>

    )
}