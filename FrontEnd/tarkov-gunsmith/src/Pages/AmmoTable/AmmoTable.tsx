/* eslint-disable react/jsx-pascal-case */
import { useState, useEffect } from "react"
import { API_URL } from "../../Util/util"

import { useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    MRT_ColumnActionMenu,
    MRT_TableHeadCellSortLabel,
    MRT_TableBodyCellValue,
    MRT_TableHeadCellFilterLabel,
    MRT_TableHeadCell,
    MRT_ColumnPinningButtons,
    MRT_TableHeadCellGrabHandle,
    MRT_GlobalFilterTextInput,
    MRT_TablePagination,
    MRT_ToggleFullScreenButton,
    MRT_ExpandButton
} from 'mantine-react-table';
import { AmmoTableRow, ammoCaliberArray, mapAmmoCaliberToLabel } from "../../Components/Common/Types/AmmoTypes";

import { Badge, Box, Button, Flex, Grid, Group, Menu, Stack, Tooltip, Text, Image, Select, MultiSelect, Avatar } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks";

export default function AmmoTableContent() {



    const [manualGrouping, setManualGrouping] = useState<string[]>(['caliber']);

    // Handler to toggle 'caliber' in the manualGrouping array
    const handleToggleCaliber = () => {
        if (manualGrouping.includes('caliber')) {
            // 'caliber' is already in the array, so we remove it
            setManualGrouping(manualGrouping.filter(item => item !== 'caliber'));
        } else {
            // 'caliber' is not in the array, so we add it
            setManualGrouping([...manualGrouping, 'caliber']);
        }
    };

    const initialData: AmmoTableRow[] = [];
    const [filterValues, setFilterValues] = useState<string[]>([]);
    const [unfilteredData, setUnfilteredData] = useState<AmmoTableRow[]>(initialData);
    const [data, setData] = useState<AmmoTableRow[]>(initialData);
    const [pix, pixHandlers] = useDisclosure(false);

    useEffect(() => {

        const temp = unfilteredData.filter(x => filterValues.includes(x.caliber));
        if (filterValues.length === 0) {
            setData(unfilteredData);
        }
        else {
            setData(temp);
        }
    }, [unfilteredData, filterValues])


    const ammos = async () => {
        const response = await fetch(API_URL + '/GetAmmoDataSheetData');
        setUnfilteredData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        ammos();
    }, [])



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
                    // <Box
                    //     sx={{
                    //         display: 'flex',
                    //         alignItems: 'center',
                    //         gap: '1rem',
                    //     }}
                    // >
                    //     <img
                    //         alt="avatar"
                    //         height={40}
                    //         src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
                    //         loading="lazy"
                    //         hidden={!pix}
                    //     />
                    //     {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                    //     <span>{renderedCellValue}</span>
                    // </Box>
                    <span>{renderedCellValue}</span>
                ),

            },
            {
                id: "caliber",
                accessorFn: (row) => `${mapAmmoCaliberToLabel(row.caliber)}`,
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
                filterVariant: "range-slider"
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

                filterVariant: "range-slider"
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
                            Average: <strong>{cell.getValue<number>().toFixed(0)}%</strong>
                        </div>
                    )
                },
                filterVariant: "range-slider"
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
                            Average: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                        </div>
                    )
                },
                filterVariant: "range-slider"
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
                accessorKey: 'ammoRec',
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
                        Average: <strong>{cell.getValue<number>().toFixed(0)} m/s</strong>
                    </div>,
                filterVariant: "range-slider"
            },
            {
                accessorKey: 'tracer',
                header: 'Tracer?',
                size: 120,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<boolean>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'price',
                header: 'Price',
                size: 120,
            },
            {
                accessorKey: 'traderLevel',
                header: 'Trader Level',
                size: 120,
            },
        ],
        [pix],
    );

    const table = useMantineReactTable({
        columns,
        data: data, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
        positionGlobalFilter: "none",
        enableStickyHeader: true,
        enableGlobalFilter: true,
        enableColumnFilterModes: true,

        enableColumnOrdering: false,
        enableColumnFilters: true,

        enableToolbarInternalActions: true,
        enableHiding: false,
        enableSorting: true,

        enableColumnActions: false,
        enableColumnDragging: false,

        // enableTopToolbar: false,
        enableDensityToggle: false,
        positionToolbarAlertBanner: "top",
        enableFacetedValues: true,
        enableGrouping: true,
        // enablePinning: true,
        enableRowSelection: false,
        // enableColumnResizing: true,
        columnFilterDisplayMode: "popover",
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
            }
        },
        state: {
            grouping: manualGrouping,
            showGlobalFilter: true,
            columnVisibility: {
                caliber: false,
            },
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
                justify={{ sm: 'center' }}
                align="flex-start"
                direction="row"
                wrap="wrap"

            >
                <MRT_GlobalFilterTextInput table={table} />
                <Button size={'xs'} onClick={handleToggleCaliber} >Toggle Group By Caliber</Button>
                <Button size={'xs'} onClick={() => pixHandlers.toggle()} >Toggle Images</Button>
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
        // renderDetailPanel:({ row }) => (
        //     <Box
        //       sx={{
        //         display: 'grid',
        //         margin: 'auto',
        //         gridTemplateColumns: '1fr 1fr',
        //         width: '100%',
        //       }}
        //     >
        //       <Text>Address: {row.}</Text>
        //       <Text>City: </Text>
        //       <Text>State: </Text>
        //       <Text>Country: {row.original.country}</Text>
        //     </Box>
        //   )


    });

    return (
        <Box w={"100%"} p={10}>
            <MantineReactTable table={table} />
        </Box>
    );
}