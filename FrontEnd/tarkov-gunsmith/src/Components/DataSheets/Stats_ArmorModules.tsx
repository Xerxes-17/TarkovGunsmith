import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box } from '@mui/material';
import { ArmorCollider, ArmorPlateCollider, ArmorType, convertEnumValToArmorString, MaterialType } from '../ADC/ArmorData';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Card, Col, Row } from 'react-bootstrap';
import ImageWithDefaultFallback from '../Common/ImageWithFallBack';

export function DataSheetArmorModules(props: any) {
    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)
    interface ArmorModule {
        id: string
        category: string
        armorType: ArmorType
        name: string

        armorClass: number
        bluntThroughput: number
        maxDurability: number
        maxEffectiveDurability: number
        armorMaterial: MaterialType
        weight: number

        usedInNames: string[]

        armorPlateColliders: ArmorPlateCollider[]
        armorColliders: ArmorCollider[]
    }

    const [TableData, setTableData] = useState<ArmorModule[]>([]);

    const fetchData = async () => {
        const response = await fetch(API_URL + '/GetArmorModulesData');
        setTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        fetchData();
    }, [])

    function namesDisplay(row: ArmorModule) {
        return (
            <>
                {row.usedInNames.map((name) => {
                    return <>{name}<br /></>
                })}
            </>
        )
    }

    function combinedCollidersDisplay(row: ArmorModule) {
        return (
            <span>
                {armorPlateCollidersDisplay(row)}
                {armorCollidersDisplay(row)}
            </span>
        )

    }

    function armorPlateCollidersDisplay(row: ArmorModule) {
        return (
            <>
                {row.armorPlateColliders.length > 0 ? <>Plates:<br/></> : <></>}
                {row.armorPlateColliders.map((enumVal) => {
                    return <>&nbsp;&nbsp;{ArmorPlateCollider[enumVal]}<br /></>
                })}
            </>
        )
    }

    function armorCollidersDisplay(row: ArmorModule) {
        return (
            <>
                {row.armorColliders.length > 0 ? <>Body:<br/></> : <></>}
                {row.armorColliders.map((enumVal) => {
                    return <>&nbsp;&nbsp;{ArmorCollider[enumVal]}<br /></>
                })}
            </>
        )
    }

    function plateCollidersToStrings(colliders: ArmorPlateCollider[]){
        return colliders.map((val) => ArmorPlateCollider[val])
    }
    function armorCollidersToStrings(colliders: ArmorCollider[]){
        return colliders.map((val) => ArmorCollider[val])
    }

    function createHitZoneValues(row: ArmorModule){
        const plates = plateCollidersToStrings(row.armorPlateColliders);
        const body = armorCollidersToStrings(row.armorColliders);
        return [...plates,...body]
    }

    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<ArmorModule>[]>(
        () => [
            {
                accessorFn: (row) => ArmorType[row.armorType],
                id: 'armorType',
                header: 'Type',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'category',
                header: 'Category',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
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
                        <ImageWithDefaultFallback
                            alt="avatar"
                            height={40}
                            src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
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
                accessorKey: 'bluntThroughput',
                header: 'Blunt Throughput',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'maxDurability',
                header: 'Durability',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, //small column
            },
            {
                accessorKey: 'maxEffectiveDurability',
                header: 'eff. Durability',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'armorMaterial',
                header: 'material',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (
                    <span>{(convertEnumValToArmorString(cell.getValue<number>()))} </span>
                )
            },
            {
                accessorKey: 'weight',
                header: 'Weight (kg)',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                // accessorKey: 'usedInNames',
                accessorKey: 'usedInNames',
                // accessorFn: row => namesDisplay(row),
                id: 'usedInNames',
                header: 'Default used by',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (namesDisplay(cell.row.original))
            },
            {
                id: 'armorColliders',
                accessorFn: (row) => createHitZoneValues(row),
                header: 'Hit Zones',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (combinedCollidersDisplay(cell.row.original))
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
                            Plates and Inserts
                        </Card.Header>
                        <Card.Body>
                            <>
                                This table starts with a few columns hidden by default. Press "Show/Hide Columns" on the right to change what is visible.
                                <br /><br />
                                <h5>Plates</h5>
                                Plates are armor items which can be inserted or removed to slots on a plate carrier. They will do zero blunt damage on a block despite the stats they might have.
                                <br /><br />
                                <h5>Inserts</h5>
                                Inserts cannot be added or removed from armor and are built in to the vest, helmet or rig. This armor will behave in the same way that armor did in the past and will deal blunt damage on a block. They have no weight, as the parent armor item will account for them.
                                <br /><br />
                            </>
                        </Card.Body>
                    </Card>
                </Col>
                <MaterialReactTable
                    columns={columns}
                    data={TableData}
                    // layoutMode='grid'

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

                        grouping: ['category'], //an array of columns to group by by default (can be multiple)
                        expanded: true, //expand all groups by default
                        sorting: [{ id: 'category', desc: true }, { id: 'armorClass', desc: true }, { id: 'name', desc: false }], //sort by state by default
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