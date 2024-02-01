/* eslint-disable react/jsx-pascal-case */
import { useState, useEffect } from "react"

import { useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    MRT_GlobalFilterTextInput,
    MRT_ToggleFullScreenButton,
    MRT_ExpandButton
} from 'mantine-react-table';
import { AmmoTableRow, mapAmmoCaliberFullNameToLabel, unwantedAmmos } from '../../Types/AmmoTypes';

import { Box, Button, Flex, Text, Avatar } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks";
import { getAmmoDataFromApi_TarkovDev } from "../../Api/AmmoApiCalls";


export default function AmmoMRT() {
    const initialData: AmmoTableRow[] = [];
    const [tableData, setTableData] = useState<AmmoTableRow[]>(initialData);
    const [manualGrouping, setManualGrouping] = useState<string[]>(['caliber']);

    const [pix, pixHandlers] = useDisclosure(true);
    const [filters, filtersHandlers] = useDisclosure(false);
    const [visibility, setVisibility] = useState<Record<string, boolean>>({ caliber: false, });

    async function getTableData() {
        // const response_WishGranterApi = await getDataFromApi_WishGranter();
        // if(response_WishGranterApi !== null){
        //     setAmmoTableData(response_WishGranterApi);
        //     return;
        // }

        const response_ApiTarkovDev = await getAmmoDataFromApi_TarkovDev()
        if(response_ApiTarkovDev !== null){
            setTableData(filterNonBulletsOut(response_ApiTarkovDev));
            return;
        }

        console.error("Error: Both WishGranter and ApiTarkovDev failed to respond (correctly).")
    }

    useEffect(() => {
        getTableData();
    }, [])


    function filterNonBulletsOut(input: AmmoTableRow[]){
        const result = input.filter(x=>!unwantedAmmos.includes(x.caliber))
        return result
    }

    // Handler to toggle 'caliber' in the manualGrouping array
    const handleToggleCaliber = () => {
        if (manualGrouping.includes('caliber')) {
            // 'caliber' is already in the array, so we remove it
            setManualGrouping(manualGrouping.filter(item => item !== 'caliber'));
            setVisibility({ caliber: true })
        } else {
            // 'caliber' is not in the array, so we add it
            setManualGrouping([...manualGrouping, 'caliber']);
            setVisibility({ caliber: false })
        }
    };

    const columns = useMemo<MRT_ColumnDef<AmmoTableRow>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'shortName',
                header: 'Name',
                size: 8,
                Header: ({ column, header }) => (
                    <div style={{ width: "100%" }}>Name</div>),
                AggregatedCell: ({ row }) => row.renderValue("caliber"),
                Cell: ({ renderedCellValue, row }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <Avatar
                            alt="avatar"
                            size={'md'}
                            src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
                            style={{ display: pix && manualGrouping.length === 0 ? "block" : "none" }}
                            // hidden={!pix && manualGrouping.some(x=>x === 'caliber')}
                        >
                            TG
                        </Avatar>
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                    // <span>{renderedCellValue}</span>
                ),
            },
            {
                id: "caliber",
                accessorFn: (row) => `${mapAmmoCaliberFullNameToLabel(row.caliber)}`,
                size: 8,
                accessorKey: 'caliber',
                header: 'Caliber',
                filterVariant: "multi-select",
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue}</span>
                ),
            },

            {
                accessorKey: 'damage',
                header: 'Damage',
                size: 120,
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </div>,
                filterVariant: "range",
                Cell: ({cell, row}) => {
                    if(row.original.projectileCount > 1){
                        return (
                            <>{row.original.projectileCount} x {cell.getValue<number>().toFixed(0)} ({row.original.projectileCount*cell.getValue<number>()})</> 
                        )
                    }
                    return <>{cell.getValue<number>().toFixed(0)}</>
                    
                }
            },
            {
                accessorKey: 'penetrationPower',
                header: 'Penetration',
                aggregationFn: ['max', 'mean',],
                size: 120,
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            Mean: <strong>{
                                cell
                                    .getValue<Array<number>>()?.[1]
                                    .toFixed(0)
                            }
                            </strong>
                        </div>
                    )
                },

                filterVariant: "range"
            },
            {
                accessorKey: 'penetrationPowerDeviation',
                header: 'Penetration Power Deviation',
                aggregationFn: ['max', 'mean',],
                size: 120,
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            Mean: <strong>{
                                cell
                                    .getValue<Array<number>>()?.[1]
                                    .toFixed(2)
                            }
                            </strong>
                        </div>
                    )
                },

                filterVariant: "range"
            },
            {
                accessorKey: 'armorDamagePerc',
                header: 'Armor Damage%',
                size: 130,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()} %</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            Mean: <strong>{cell.getValue<number>().toFixed(0)}%</strong>
                        </div>
                    )
                },
                filterVariant: "range"
            },
            {
                accessorKey: 'baseArmorDamage',
                header: 'Derived Armor Damage',
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()} </span>
                ),
                size: 130,
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                        </div>
                    )
                },
                filterVariant: "range"
            },
            {
                accessorKey: 'lightBleedDelta',
                header: 'Light Bleed Bonus',

                Cell: ({ cell }) => (
                    <>
                        {cell.getValue<number>() > 0 ? (
                            <span>{(cell.getValue<number>() * 100).toLocaleString()} %</span>
                        ) : <span>-</span>}
                    </>
                ),
                size: 80,
            },
            {
                accessorKey: 'heavyBleedDelta',
                header: 'Heavy Bleed Bonus',
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue<number>() > 0 ? (
                            <span>{(cell.getValue<number>() * 100).toLocaleString()} %</span>
                        ) : <span>-</span>}
                    </>
                ),
                size: 85,
            },
            {
                accessorKey: 'fragChance',
                header: 'Frag',
                Cell: ({ cell, row }) => (
                    <>
                        {cell.getValue<number>() > 0 && row.original.penetrationPower > 19 ? (
                            <span>{(cell.getValue<number>() * 100).toLocaleString()} %</span>
                        ) : <span>-</span>}
                    </>
                ),
                size: 55,
            },
            {
                accessorKey: 'AmmoRec',
                header: 'Recoil Modifier',
                size: 110,
                Cell: ({ cell }) => (
                    <>
                        {cell.getValue<number>() !== 0 ? (
                            <span>{cell.getValue<number>()}</span>
                        ) : <span>-</span>}
                    </>
                ),
            },
            {
                accessorKey: 'initialSpeed',
                header: 'Initial Speed',
                size: 140,
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)} m/s</strong>
                    </div>,
                filterVariant: "range",
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue} m/s</span>
                ),
            },
            {
                accessorKey: 'tracer',
                header: 'Tracer?',
                size: 120,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<boolean>()).toLocaleString()}</span>
                ),
            },
            // {
            //     accessorKey: 'price',
            //     header: 'Price',
            //     size: 120,
            // },
            // {
            //     accessorKey: 'traderLevel',
            //     header: 'Trader Level',
            //     size: 120,
            // },
        ],
        [pix, manualGrouping],
    );

    const table = useMantineReactTable({
        columns,
        data: tableData,
        positionGlobalFilter: "none",
        enableStickyHeader: true,
        enableGlobalFilter: true,
        enableColumnFilterModes: true,

        enableColumnOrdering: true,
        enableColumnFilters: true,

        enableToolbarInternalActions: true,
        enableHiding: false,
        enableSorting: true,

        enableColumnActions: false,
        enableColumnDragging: false,
        enableFacetedValues: true,
        enableGrouping: true,
        enablePinning: true,

        // enableTopToolbar: false,
        enableDensityToggle: false,
        positionToolbarAlertBanner: "bottom",

        enableRowSelection: false,
        // enableColumnResizing: true,
        columnFilterDisplayMode: "subheader",
        positionPagination: "bottom",
        mantinePaginationProps: {
            rowsPerPageOptions: ["10", "25", "50", "75", "100", "150", "200"],
        },
        initialState: {
            expanded: true,
            columnVisibility: {
                caliber: true,
                tracer: false,
                price: false,
            },
            density: "xs",

            pagination: {
                pageIndex: 0, pageSize: 200
            }
            ,
            columnPinning: {
                left: ['mrt-row-expand', 'name']
                // left: ['mrt-row-expand']
            },
            sorting: [{ id: 'penetrationPower', desc: true }],
        },
        state: {
            grouping: manualGrouping,
            showGlobalFilter: true,
            columnVisibility: visibility,
            showColumnFilters: filters,
        },
        mantineTableHeadProps: {
            sx: {
                tableLayout: 'fixed',
            },
        },
        mantineTopToolbarProps: {
            sx: {
                verticalAlign: "bottom"
            }
        },

        mantineTableHeadCellProps: {
            style: {
                verticalAlign: "bottom"
            },
            sx: {
                // '& .mantine-Paper-root': {
                //     verticalAlign: "bottom",
                // },
                // ! Did these two to get the actions group ahead of the label
                // '& .mantine-TableHeadCell-Content': {
                //     display: 'flex',
                //     flexDirection:"column-reverse",
                //     whiteSpace: "normal"
                // },
                // '& .mantine-TableHeadCell-Content-Actions': {
                //     alignSelf:"flex-start",
                // },

                '& .mantine-TableHeadCell-Content-Wrapper': {
                    width: "100%",
                    whiteSpace: "normal"
                },
                '& .mantine-TableHeadCell-Content-Labels': {
                    // justifyContent: 'space-between',
                    display: 'flex',
                    flexWrap: 'wrap'
                },
            },
        },
        //todo make this  have a multi-select for calibers
        renderTopToolbarCustomActions: ({ table }) => (
            <Flex
                gap="md"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
            >
                <MRT_GlobalFilterTextInput table={table} />
                <Flex
                    gap="md"
                    justify="flex-start"
                    align="center"
                    direction="row"
                    wrap="wrap"
                >
                    <Text fw={700}>Toggles</Text>
                    <Button size={'xs'} compact variant={ manualGrouping.length > 0 ? 'filled' : 'light'} onClick={handleToggleCaliber} >Group Calibers</Button>
                    <Button size={'xs'} compact variant={pix? 'filled' : 'light'} onClick={() => pixHandlers.toggle()} >Images</Button>
                    <Button size={'xs'} compact variant={filters? 'filled' : 'light'} onClick={() => filtersHandlers.toggle()} >Filters</Button>
                </Flex>

                {/* <MultiSelect
                    placeholder="Filter by up to 6 choices"
                    data={ammoCaliberArray}
                    miw={250}
                    maw={400}
                    maxSelectedValues={6}
                    withinPortal={true}
                    value={filterValues}
                    onChange={setFilterValues}
                /> */}
            </Flex>

        ),
        displayColumnDefOptions: {
            "mrt-row-expand": {
                Cell: ({ cell, row, table }) => {
                    const isAggregated = cell.getIsAggregated();

                    return (
                        <Box>
                            {isAggregated ? (
                                <>
                                    <MRT_ExpandButton row={row} table={table} />
                                </>
                            ) : (
                                <Avatar
                                    alt="avatar"
                                    size={'md'}
                                    src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
                                    style={{ display: pix ? "block" : "none" }}
                                    hidden={!pix}
                                >
                                    TG
                                </Avatar>
                            )}
                        </Box>
                    );
                },
            },
        },
        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* <MRT_TablePagination table={table} /> */}
                <MRT_ToggleFullScreenButton table={table} />
            </>
        ),
    });

    return (
        <Box w={"100%"} p={10} pb={50}>
            <MantineReactTable table={table} />
        </Box>
    );
}