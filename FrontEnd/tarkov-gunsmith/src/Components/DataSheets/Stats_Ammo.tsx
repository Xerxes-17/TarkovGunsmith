import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box, createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { Card, Col } from 'react-bootstrap';
import axios, { AxiosResponse } from 'axios';

interface AmmoTableRow {
    id: string
    name: string
    caliber: string
    damage: number
    penetrationPower: number
    armorDamagePerc: number
    baseArmorDamage: number
    lightBleedDelta: number
    heavyBleedDelta: number
    fragChance: number
    InitialSpeed: number
    AmmoRec: number
    tracer: boolean
    price: number
    traderLevel: number
}

interface DevTarkovAmmoItem {
    id: string;
    name: string;
    properties: {
        penetrationPower: number;
        damage: number;
        caliber: string;
        armorDamage: number;
        projectileCount: number;
        recoilModifier: number;
        heavyBleedModifier: number;
        lightBleedModifier: number;
        accuracyModifier: number;
        initialSpeed: number;
        fragmentationChance: number;
        tracer: boolean;
    } | null;
}

interface ApiResponse {
    data: {
        items: DevTarkovAmmoItem[];
    };
}

export default function DataSheetAmmo(props: any) {
    const [AmmoTableData, setAmmoTableData] = useState<AmmoTableRow[]>([]);


    async function fetchDataFromApi_TarkovDev(): Promise<DevTarkovAmmoItem[] | null> {
        try {
            const response: AxiosResponse<ApiResponse> = await axios.post("https://api.tarkov.dev/graphql", {
                query: `
                {
                    items(types: [ammo]) {
                        id
                        name
                        properties {
                            ... on ItemPropertiesAmmo {
                                penetrationPower
                                damage
                                caliber
                                armorDamage
                                projectileCount
                                recoilModifier
                                heavyBleedModifier
                                lightBleedModifier
                                accuracyModifier
                                initialSpeed
                                fragmentationChance
                                tracer
                            }
                        }
                    }
                }`
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            return response.data.data.items;
        } catch (error) {
            console.error("Error in fetching from api.tarkov.dev:", error);
            return null;
        }
    }

    function transformTarkovDevItemToAmmoTableRow(item: DevTarkovAmmoItem): AmmoTableRow {
        const properties = item.properties;
    
        return {
            id: item.id,
            name: item.name,
            caliber: properties ? properties.caliber : "",
            damage: properties ? properties.damage : -1,
            penetrationPower: properties ? properties.penetrationPower : -1,
            armorDamagePerc: properties ? properties.armorDamage : -1,
            baseArmorDamage: properties ? properties.penetrationPower * properties.armorDamage/100: -1,
            lightBleedDelta: properties ? properties.lightBleedModifier : -1,
            heavyBleedDelta: properties ? properties.heavyBleedModifier : -1,
            fragChance: properties ? properties.fragmentationChance : -1,
            InitialSpeed: properties ? properties.initialSpeed : -1,
            AmmoRec: properties ? properties.recoilModifier : -1,
            tracer: properties ? properties.tracer : false, 
            price: -1, 
            traderLevel: -1,
        };
    }

    async function getDataFromApi_TarkovDev(){
        const fetched = await fetchDataFromApi_TarkovDev();

        if(fetched === null){
            console.error("Something went wrong fetching ammo data from api.tarkov.dev")
            return null;
        }
        const transformed = fetched.map(item => transformTarkovDevItemToAmmoTableRow(item));

        const filtered = transformed.filter(row => row.caliber !== undefined && row.caliber !=="");

        return filtered;
    }

    async function getDataFromApi_WishGranter(): Promise<AmmoTableRow[] | null> {
        try {
            const response: AxiosResponse<AmmoTableRow[]> = await axios.get(`${API_URL}/GetAmmoDataSheetData`);
            return response.data;
        } catch (error) {
            console.error('Error fetching ammo data:', error);
            return null;
        }
    };

    async function getTableData() {
        const response_WishGranterApi = await getDataFromApi_WishGranter();
        if(response_WishGranterApi !== null){
            setAmmoTableData(response_WishGranterApi);
            return;
        }

        const response_ApiTarkovDev = await getDataFromApi_TarkovDev()
        if(response_ApiTarkovDev !== null){
            setAmmoTableData(response_ApiTarkovDev);
            return;
        }

        console.error("Error: Both WishGranter and ApiTarkovDev failed to respond (correctly).")
    }

    useEffect(() => {
        getTableData();
    }, [])

    const columns = useMemo<MRT_ColumnDef<AmmoTableRow>[]>(
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
                            src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
                            loading="lazy"
                        />
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
            },
            {
                accessorKey: 'caliber',
                header: 'Caliber',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, //small column
            },
            {
                accessorKey: 'damage',
                header: 'DMG',
                muiTableHeadCellProps: { sx: { color: 'red' } },
                size: 50, //small column
            },
            {
                accessorKey: 'penetrationPower',
                header: 'PEN',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 50, //small column
            },
            {
                accessorKey: 'armorDamagePerc',
                header: 'AD%',
                muiTableHeadCellProps: { sx: { color: 'orange' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()} %</span>
                ),

            },
            {
                accessorKey: 'baseArmorDamage',
                header: 'Derived Armor Damage',
                muiTableHeadCellProps: { sx: { color: 'yellow' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()} </span>
                )
            },
            {
                accessorKey: 'lightBleedDelta',
                header: 'Light Bleed Bonus',
                muiTableHeadCellProps: { sx: { color: 'violet' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>() * 100).toLocaleString()} %</span>
                )
            },
            {
                accessorKey: 'heavyBleedDelta',
                header: 'Heavy Bleed Bonus',
                muiTableHeadCellProps: { sx: { color: 'violet' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>() * 100).toLocaleString()} %</span>
                )
            },
            {
                accessorKey: 'fragChance',
                header: 'Frag',
                muiTableHeadCellProps: { sx: { color: 'purple' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>() * 100).toLocaleString()} %</span>
                )
            },
            {
                accessorKey: 'AmmoRec',
                header: 'Recoil Modifier',
                muiTableHeadCellProps: { sx: { color: 'purple' } },
            },
            {
                accessorKey: 'tracer',
                header: 'Tracer?',
                muiTableHeadCellProps: { sx: { color: 'lightblue' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<boolean>()).toLocaleString()}</span>
                )
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
                            Ammo Table
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

                        grouping: ['caliber'], //an array of columns to group by by default (can be multiple)
                        expanded: true, //expand all groups by default
                        sorting: [{ id: 'penetrationPower', desc: true }], //sort by state by default
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