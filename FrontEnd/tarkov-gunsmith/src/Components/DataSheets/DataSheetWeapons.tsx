import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Card, Col } from "react-bootstrap";

export default function DataSheetWeapons(props: any) {
    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)
    interface WeaponsTableRow {
        id: string
        name: string
        caliber: string

        rateOfFire: number
        baseErgonomics: number
        baseRecoil: number

        recoilDispersion: number
        convergence: number
        recoilAngle: number
        cameraRecoil: number

        defaultErgonomics: number
        defaultRecoil: number

        price: number
        traderLevel: number
        fleaPrice: number
    }

    const [ArmorTableData, setArmorTableData] = useState<WeaponsTableRow[]>([]);

    const armors = async () => {
        const response = await fetch(API_URL + '/GetWeaponDataSheetData');
        setArmorTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        armors();
    }, [])

    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<WeaponsTableRow>[]>(
        () => [
            {
                accessorKey: 'name', //simple recommended way to define a column
                header: 'Name',
                muiTableHeadCellProps: { sx: { color: 'white' } }, //custom props
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
                            src={`https://assets.tarkov.dev/${row.original.id}-icon.jpg`}
                            loading="lazy"
                        />
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
            },
            {
                accessorKey: 'caliber',
                header: 'caliber',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, //small column
            },
            {
                accessorKey: 'rateOfFire',
                header: 'RoF',
                muiTableHeadCellProps: { sx: { color: 'red' } },
                size: 50, //small column
            },
            {
                accessorKey: 'baseErgonomics',
                header: 'Ergonomics (base)',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                )
            },
            {
                accessorKey: 'baseRecoil',
                header: 'Vertical Recoil (base)',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),

            },


            {
                accessorKey: 'convergence',
                header: 'Convergence',
                muiTableHeadCellProps: { sx: { color: 'yellow' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'recoilAngle',
                header: 'Recoil Angle',
                muiTableHeadCellProps: { sx: { color: 'yellow' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'cameraRecoil',
                header: 'Camera Recoil',
                muiTableHeadCellProps: { sx: { color: 'yellow' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'recoilDispersion',
                header: 'Horizontal Recoil (RecoilDispersion)',
                muiTableHeadCellProps: { sx: { color: 'yellow' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'defaultRecoil',
                header: 'Vertical Recoil (default)',
                muiTableHeadCellProps: { sx: { color: 'green' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },

            {
                accessorKey: 'defaultErgonomics',
                header: 'Ergonomics (default)',
                muiTableHeadCellProps: { sx: { color: 'green' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },

            {
                accessorKey: 'price',
                header: 'Price',
                muiTableHeadCellProps: { sx: { color: 'blue' } },
            },
            {
                accessorKey: 'traderLevel',
                header: 'Trader Level',
                muiTableHeadCellProps: { sx: { color: 'blue' } },
            },
            {
                accessorKey: 'fleaPrice',
                header: 'Flea Price',
                muiTableHeadCellProps: { sx: { color: 'lightblue' } },
                Cell: ({ cell }) => (
                    <span>₽ {(cell.getValue<number>()).toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
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
                                            price: false,
                                            baseErgonomics: false,
                                            baseRecoil: false,

                                            cameraRecoil: false,
                                            recoilAngle: false,

                                            traderLevel: false
                                        },
                                        pagination: pagination,

                                        grouping: ['caliber'], //an array of columns to group by by default (can be multiple)
                                        expanded: true, //expand all groups by default
                                        sorting: [{ id: 'convergence', desc: true }, { id: 'defaultRecoil', desc: false }], //sort by state by default
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