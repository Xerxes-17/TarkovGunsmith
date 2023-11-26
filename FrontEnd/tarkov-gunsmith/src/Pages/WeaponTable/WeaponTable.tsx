/* eslint-disable react/jsx-pascal-case */
import { useState, useEffect } from "react"
import { API_URL } from "../../Util/util"

import { useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    MRT_GlobalFilterTextInput,
    MRT_ToggleFullScreenButton,
    MRT_ExpandButton
} from 'mantine-react-table';
import { AmmoTableRow, mapAmmoCaliberToLabel } from "../../Components/Common/Types/AmmoTypes";

import { Box, Button, Flex, Text, Avatar } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks";
import { WeaponsTableRow } from "../../Components/Common/Types/WeaponTypes";

export default function WeaponTableContent() {
    const [tableData, setTableData] = useState<WeaponsTableRow[]>([]);


    const [manualGrouping, setManualGrouping] = useState<string[]>(['caliber']);

    const [filterValues, setFilterValues] = useState<string[]>([]);
    const [unfilteredData, setUnfilteredData] = useState<WeaponsTableRow[]>([]);
    const [data, setData] = useState<AmmoTableRow[]>([]);

    const [pix, pixHandlers] = useDisclosure(false);
    const [filters, filtersHandlers] = useDisclosure(false);

    const [visibility, setVisibility] = useState<Record<string, boolean>>({ caliber: false, });


    const dataApiCall = async () => {
        const response = await fetch(API_URL + '/GetWeaponDataSheetData');
        // console.log(response)
        setTableData(await response.json())
    }
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        dataApiCall();
    }, [])

    useEffect(() => {

        const temp = unfilteredData.filter(x => filterValues.includes(x.caliber));
        if (filterValues.length === 0) {
            setTableData(unfilteredData);
        }
        else {
            setTableData(temp);
        }
    }, [unfilteredData, filterValues])


    const columns = useMemo<MRT_ColumnDef<WeaponsTableRow>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
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
                            src={row.original.imageLink}
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
                accessorKey: "caliber",
                header: "Caliber"

            },
            {
                id: "rateOfFire",
                accessorKey: "rateOfFire",
                header: "Rate of Fire",
                size: 75,
                aggregationFn: 'median',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Median: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </div>,
            },
            {
                id: "defaultErgonomics",
                accessorKey: "defaultErgonomics",
                header: "Default Ergonomics",
                size: 75,
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </div>,
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue?.toLocaleString('en-us')}</span>
                ),
            },
            {
                id: "defaultRecoil",
                accessorKey: "defaultRecoil",
                header: "Default Recoil",
                size: 75,
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </div>,
                Cell: ({ cell }) => (
                    <span>{cell.getValue<number>().toFixed(0)}</span>
                ),
            },
            // {
            //     id: "baseErgonomics",
            //     accessorKey: "baseErgonomics",
            //     header: "Base Ergonomics",
            //     size: 75,
            // },
            // {
            //     id: "baseRecoil",
            //     accessorKey: "baseRecoil",
            //     header: "Base Recoil",
            //     size: 75,
            // },
            {
                id: "recoilDispersion",
                accessorKey: "recoilDispersion",
                header: "Recoil Dispersion",
                size: 75,
                aggregationFn: 'median',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Median: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </div>,
            },
            {
                id: "convergence",
                accessorKey: "convergence",
                header: "Convergence",
                size: 75,
                aggregationFn: 'median',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Median: <strong>{cell.getValue<number>().toFixed(2)}</strong>
                    </div>,
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue?.toLocaleString('en-us')}</span>
                ),
            },
            {
                id: "recoilAngle",
                accessorKey: "recoilAngle",
                header: "Recoil Angle",
                size: 75,
            },
            {
                id: "cameraRecoil",
                accessorKey: "cameraRecoil",
                header: "Camera Recoil",
                size: 75,
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Mean: <strong>{cell.getValue<number>().toFixed(2)}</strong>
                    </div>,
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue?.toLocaleString('en-us')}</span>
                ),
            },

            {
                id: "price",
                accessorKey: "price",
                header: "Price",
                size: 75,
            },
            {
                id: "traderLevel",
                accessorKey: "traderLevel",
                header: "Trader Level",
                size: 75,
            },
            {
                id: "fleaPrice",
                accessorKey: "fleaPrice",
                header: "Flea Market Price",
                size: 75,
            },
        ],
        [pix, manualGrouping],
    );

    const table = useMantineReactTable({
        columns: columns,
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
        enableColumnDragging: true,
        enableFacetedValues: true,
        enableGrouping: true,
        enablePinning: true,

        // enableTopToolbar: false,
        enableDensityToggle: false,
        positionToolbarAlertBanner: "top",

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
                // caliber: true,

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
            // grouping: manualGrouping,
            showGlobalFilter: true,
            // columnVisibility: visibility,
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
                justify={{ sm: 'center' }}
                align="flex-start"
                direction="row"
                wrap="wrap"
            >
                <MRT_GlobalFilterTextInput table={table} />
                <Flex
                    gap="md"
                    justify={{ sm: 'center' }}

                    align="flex-start"
                    direction="row"
                    wrap="wrap"

                >
                    <Text fw={700}>Toggles</Text>
                    {/* <Button size={'xs'} compact variant={ manualGrouping.length > 0 ? 'filled' : 'light'} onClick={handleToggleCaliber} >Group Calibers</Button> */}
                    <Button size={'xs'} compact variant={pix ? 'filled' : 'light'} onClick={() => pixHandlers.toggle()} >Images</Button>
                    <Button size={'xs'} compact variant={filters ? 'filled' : 'light'} onClick={() => filtersHandlers.toggle()} >Filters</Button>
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