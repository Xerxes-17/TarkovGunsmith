import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table';
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Card, Col } from "react-bootstrap";
import ImageWithDefaultFallback from '../Common/ImageWithFallBack';
import axios, { AxiosResponse } from 'axios';

interface WeaponsTableRow {
    id: string
    name: string
    imageLink: string
    caliber: string

    rateOfFire: number
    baseErgonomics: number
    baseRecoil: number

    recoilDispersion: number
    recoilAngle: number
    deviationCurve: number
    deviationMax: number

    defaultErgonomics: number
    defaultRecoil: number

    price: number
    traderLevel: number
    fleaPrice: number
}

interface DevTarkovWeaponItem {
    id: string;
    name: string;

    properties: {
        caliber: string;

        fireRate: number;
        ergonomics: number;
        recoilVertical: number;

        recoilDispersion: number;
        recoilAngle: number;
        deviationCurve: number
        deviationMax: number

        defaultErgonomics: number;
        defaultRecoilVertical: number;
        defaultPreset: {
            id: string;
            name: string;
        };
    } | null;
}

interface ApiResponse {
    data: {
        items: DevTarkovWeaponItem[];
    };
}

export default function DataSheetWeapons(props: any) {
    const [WeaponTableData, setWeaponTableData] = useState<WeaponsTableRow[]>([]);

    async function fetchDataFromApi_TarkovDev(): Promise<DevTarkovWeaponItem[] | null> {
        try {
            const response: AxiosResponse<ApiResponse> = await axios.post("https://api.tarkov.dev/graphql", {
                query: `
                {
                    items(types: [gun]) {
                        id
                        name
                        properties {
                            ... on ItemPropertiesWeapon {
                                caliber
        
                                fireRate
                                ergonomics
                                recoilVertical
                                
                                recoilDispersion
                                convergence
                                recoilAngle
                                cameraRecoil
                                
                                cameraSnap
                                centerOfImpact
                                deviationCurve
                                deviationMax
                                
                                defaultErgonomics
                                defaultRecoilVertical
                                defaultPreset{
                                    id
                                    name
                                }
                            }
                        }
                    }
                }
            `,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
            });
            return response.data.data.items;
        } catch (error) {
            console.error('Error in fetching from api.tarkov.dev:', error);
            return null;
        }
    };

    function transformDevTarkovWeaponToWeaponsTableRow(weaponItem: DevTarkovWeaponItem): WeaponsTableRow {
        const properties = weaponItem.properties;

        const tableRow: WeaponsTableRow = {
            id: weaponItem.id,
            name: weaponItem.name,
            imageLink: properties?.defaultPreset?.id 
            ? `https://assets.tarkov.dev/${properties?.defaultPreset.id}-icon.webp` 
            : `https://assets.tarkov.dev/${weaponItem.id}-icon.webp`,

            caliber: properties ? properties.caliber : "",
            rateOfFire: properties ? properties.fireRate : -1,
            baseErgonomics: properties ? properties.ergonomics : -1,
            baseRecoil: properties ? properties.recoilVertical : -1,

            recoilDispersion: properties ? properties.recoilDispersion : -1,
            recoilAngle: properties ? properties.recoilAngle : -1,
            deviationCurve: properties ? properties.deviationCurve : -1,
            deviationMax: properties ? properties.deviationMax : -1,

            defaultErgonomics: properties ? properties.defaultErgonomics ?? properties.ergonomics : -1,
            defaultRecoil: properties ? properties.defaultRecoilVertical ?? properties.recoilVertical : -1,

            price: -1, // You need to provide the actual price or adjust this accordingly
            traderLevel: -1, // You need to provide the actual trader level or adjust this accordingly
            fleaPrice: -1, // You need to provide the actual flea price or adjust this accordingly
        };

        if (properties?.defaultErgonomics === null){
            tableRow.defaultErgonomics = properties.ergonomics
        }
        if(properties?.defaultRecoilVertical === null){
            tableRow.defaultRecoil = properties.recoilVertical
        }

        return tableRow
    }

    async function getDataFromApi_TarkovDev() {
        const fetched = await fetchDataFromApi_TarkovDev();
        if (fetched === null) {
            console.error("Something went wrong fetching ammo data from api.tarkov.dev")
            return null;
        }
        
        const transformed = fetched.map(item => transformDevTarkovWeaponToWeaponsTableRow(item));

        return transformed;
    }


    async function getDataFromApi_WishGranter(): Promise<WeaponsTableRow[] | null> {
        try {
            const response: AxiosResponse<WeaponsTableRow[]> = await axios.get(`${API_URL}/GetWeaponDataSheetData`);
            return response.data;
        } catch (error) {
            console.error('Error fetching ammo data:', error);
            return null;
        }
    };


    async function getTableData() {
        // const response_WishGranterApi = await getDataFromApi_WishGranter();
        // if(response_WishGranterApi !== null){
        //     setWeaponTableData(response_WishGranterApi);
        //     return;
        // }

        const response_ApiTarkovDev = await getDataFromApi_TarkovDev()
        if(response_ApiTarkovDev !== null){
            setWeaponTableData(response_ApiTarkovDev);
            return;
        }

        console.error("Error: Both WishGranter and ApiTarkovDev failed to respond (correctly).")
    }

    useEffect(() => {
        getTableData();
    }, [])

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
                        <ImageWithDefaultFallback
                            alt="icon"
                            height={40}
                            src={row.original.imageLink}
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
                accessorKey: 'deviationCurve',
                header: 'Deviation Curve',
                muiTableHeadCellProps: { sx: { color: 'yellow' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'deviationMax',
                header: 'Deviation Max',
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
                accessorKey: 'defaultRecoil',
                header: 'Vertical Recoil (default)',
                muiTableHeadCellProps: { sx: { color: 'yellow' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },

            {
                accessorKey: 'recoilDispersion',
                header: 'Horizontal Recoil (Recoil Dispersion)',
                muiTableHeadCellProps: { sx: { color: 'rosybrown' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },

            {
                accessorKey: 'defaultErgonomics',
                header: 'Ergonomics (default)',
                muiTableHeadCellProps: { sx: { color: 'cyan' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },

            {
                accessorKey: 'price',
                header: 'PriceRUB',
                muiTableHeadCellProps: { sx: { color: 'blue' } },
                Cell: ({ cell }) => (
                    <span>₽ {(cell.getValue<number>()).toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}</span>
                ),
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
                            Weapons Table
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
                    data={WeaponTableData}

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
                            caliber: true,
                            rateOfFire: true,
                            baseErgonomics: false,
                            baseRecoil: false,
                            recoilAngle: true,

                            price: false,
                            traderLevel: false,
                            fleaPrice: false
                        },
                        pagination: pagination,

                        grouping: ['caliber'], //an array of columns to group by by default (can be multiple)
                        expanded: true, //expand all groups by default deviationMax
                        sorting: [{ id: 'deviationCurve', desc: true }, { id: 'deviationMax', desc: true }, { id: 'defaultRecoil', desc: false }], //sort by state by default
                    }}

                    defaultColumn={{
                        minSize: 10, //allow columns to get smaller than default
                        maxSize: 20, //allow columns to get larger than default
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