import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box } from '@mui/material';
import { ArmorCollider, armorMaterialFilterOptions, ArmorPlateCollider, ArmorPlateZones, ArmorType, ArmorZones, convertEnumValToArmorString, MATERIALS, MaterialType } from '../ADC/ArmorData';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Card, Col, Row } from 'react-bootstrap';
import ImageWithDefaultFallback from '../Common/ImageWithFallBack';
import { ArmorModuleTableRow, ArmorModule } from '../../Types/ArmorTypes';

export function DataSheetArmorModules(props: any) {
    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)


    const [TableData, setTableData] = useState<ArmorModuleTableRow[]>([]);

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL + '/GetArmorModulesData');
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const data: ArmorModule[] = await response.json();
    
            const rows: ArmorModuleTableRow[] = data.map(row => ({
                id: row.id,
                category: row.category,
                armorType: row.armorType,
                name: row.name,
                armorClass: row.armorClass,
                bluntThroughput: row.bluntThroughput,
                maxDurability: row.maxDurability,
                maxEffectiveDurability: row.maxEffectiveDurability,
                armorMaterial: convertEnumValToArmorString(row.armorMaterial),
                weight: row.weight,
                ricochetParams: row.ricochetParams,
                usedInNames: row.usedInNames.join(","),
                compatibleWith: row.compatibleWith.join(","),
                hitZones: createHitZoneValues(row),
            }));
    
            setTableData(rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        fetchData();
    }, [])

    function namesDisplay(input: string) {
        return (
            <>
                {input.split(",").map((name) => {
                    return <>{name}<br /></>
                })}
            </>
        )
    }

    function hitZonesDisplay(row: ArmorModuleTableRow) {
        return (
            <>
                {row.hitZones.map((zone) => {
                    return <>{zone}<br /></>
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
                {row.armorPlateColliders.map((enumVal) => {
                    return <>&nbsp;&nbsp;{ArmorPlateZones[enumVal]}<br /></>
                })}
            </>
        )
    }

    function armorCollidersDisplay(row: ArmorModule) {
        return (
            <>
                {row.armorColliders.map((enumVal) => {
                    return <>&nbsp;&nbsp;{ArmorZones[enumVal]}<br /></>
                })}
            </>
        )
    }

    function plateCollidersToStrings(colliders: ArmorPlateCollider[]){
        return colliders.map((val) => ArmorPlateZones[val])
    }
    function armorCollidersToStrings(colliders: ArmorCollider[]){
        return colliders.map((val) => ArmorZones[val])
    }

    function createHitZoneValues(row: ArmorModule){
        const plates = plateCollidersToStrings(row.armorPlateColliders);
        const body = armorCollidersToStrings(row.armorColliders);
        return [...plates,...body]
    }

    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<ArmorModuleTableRow>[]>(
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
                header: 'Material',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterVariant: "multi-select",
                filterSelectOptions: MATERIALS
            },
            {
                accessorKey: 'weight',
                header: 'Weight (kg)',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'ricochetParams.x',
                header: 'Max Ricochet Chance',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'ricochetParams.y',
                header: 'Min Ricochet Chance',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'ricochetParams.z',
                header: 'Min Ricochet Angle',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'usedInNames',
                id: 'usedInNames',
                header: 'Default used by',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterVariant: "text",
                filterFn: "contains",
                Cell: ({ cell }) => (namesDisplay(cell.row.original.usedInNames))
            },
            {
                accessorKey: 'compatibleWith',
                id: 'compatibleWith',
                header: 'Compatible with',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterVariant: "text",
                filterFn: "contains",
                Cell: ({ cell }) => (namesDisplay(cell.row.original.compatibleWith))
            },
            {
                accessorKey: 'hitZones',
                header: 'Hit Zones',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterVariant: "text",
                filterFn: "contains",
                Cell: ({ cell }) => (hitZonesDisplay(cell.row.original))
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
                                This table starts with a few columns hidden by default. Press "Show/Hide Columns" on the right to change what is visible. You shouldn't need the hidden ones though.
                                <br /><br />
                                <h5>Plates</h5>
                                Plates are armor items which can be inserted or removed to slots on a plate carrier. They will do zero blunt damage on a block despite the stats they might have.
                                <br /><br />
                                <h5>Inserts</h5>
                                Inserts cannot be added or removed from armor and are built in to the vest, helmet or rig. This armor will behave in the same way that armor did in the past and will deal blunt damage on a block. They have no weight, as the parent armor item will account for them.
                                <br /><br />
                                <h5>Ricochet Chance??</h5>
                                A bit of math here. If something has 0 for Max Ricochet Chance, It can't do it at all. Then if the normalized hit angle between 0 and 90 from perpendicular of the surface is higher than Min Ricochet Angle, it is interpolated between MRA and 90°,<br />
                                with Min Ricochet Angle == Min Ricochet Chance and 90° == Max Ricochet Chance. So in short you want Max and Min Chances to be high and for the Min Angle to be low.
                                <br /><br />
                                Please note that not all "armor things" are here. For example face masks are like the old system and won't show up here.
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
                    enableColumnFilters
                    enableColumnFilterModes

                    enableColumnOrdering
                    enableGrouping
                    enablePinning
                    enableMultiSort={true}
                    enableGlobalFilter={true} //turn off a feature
                    enableDensityToggle={false}
                    initialState={{
                        density: 'compact',
                        pagination: pagination,

                        columnVisibility: {
                            compatibleWith: false,
                            ricochetParams: false
                        },

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