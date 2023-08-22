import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box } from '@mui/material';
import { convertEnumValToArmorString, MaterialType } from '../../Types/T_Armor';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Card, Col } from "react-bootstrap";

export default function DataSheetArmor(props: any) {
    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)
    interface ArmorTableRow {
        id: string
        name: string

        armorClass: number
        maxDurability: number
        material: MaterialType
        effectiveDurability: number
        bluntThroughput: number
        price: number
        traderLevel: number
        type: string

    }

    const [ArmorTableData, setArmorTableData] = useState<ArmorTableRow[]>([]);

    const armors = async () => {
        const response = await fetch(API_URL + '/GetArmorDataSheetData');
        setArmorTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        armors();
    }, [])

    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<ArmorTableRow>[]>(
        () => [
            {
                accessorKey: 'name', //simple recommended way to define a column
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
                            src={`https://assets.tarkov.dev/${row.original.id}-icon.jpg`}
                            loading="lazy"
                        />
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
            },
            {
                accessorKey: 'armorClass',
                header: 'Armor Class',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, //small column
            },
            {
                accessorKey: 'maxDurability',
                header: 'Durability',
                muiTableHeadCellProps: { sx: { color: 'red' } },
                size: 50, //small column
            },
            {
                accessorKey: 'material',
                header: 'material',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                Cell: ({ cell }) => (
                    <span>{(convertEnumValToArmorString(cell.getValue<number>()))} </span>
                )
            },
            {
                accessorKey: 'effectiveDurability',
                header: 'eff. Durability',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),

            },
            {
                accessorKey: 'bluntThroughput',
                header: 'Blunt Throughput',
                muiTableHeadCellProps: { sx: { color: 'yellow' } },
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
                accessorKey: 'type',
                header: 'type',
                muiTableHeadCellProps: { sx: { color: 'blue' } },
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
                            Armor Table
                        </Card.Header>
                        <Card.Body>
                            <>
                                This table starts with a few columns hidden by default. Press "Show/Hide Columns" on the right to change what is visible.
                            </>
                        </Card.Body>
                    </Card>
                </Col>
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

                        grouping: ['armorClass'], //an array of columns to group by by default (can be multiple)
                        expanded: true, //expand all groups by default
                        sorting: [{ id: 'armorClass', desc: true }, { id: 'name', desc: false }], //sort by state by default
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
            </ThemeProvider>
        </>
    )
}