import MaterialReactTable from 'material-react-table';
import type { MRT_ColumnDef } from 'material-react-table'; // If using TypeScript (optional, but recommended)
import { useEffect, useMemo, useState } from 'react';
import { API_URL } from '../../Util/util';
import { Box } from '@mui/material';
export default function DataSheetAmmo(props: any) {
    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)
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

    const [AmmoTableData, setAmmoTableData] = useState<AmmoTableRow[]>([]);

    const ammos = async () => {
        const response = await fetch(API_URL + '/GetAmmoDataSheetData');
        setAmmoTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        ammos();
    }, [])



    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
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
                header: 'Caliber',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, //small column
            },
            {
                accessorKey: 'damage',
                header: 'DAM',
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
    const [pagination, setPagination] = useState({
        pageIndex: 0,
        pageSize: 200, //customize the default page size
    });

    return (
        <>
            This table starts with a few columns hidden by default. Press "Show/Hide Columns" on the right to change what is visible.
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
        </>
    )
}