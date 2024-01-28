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

import { Box, Button, Flex, Text, Avatar, MultiSelect } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks";
import { WeaponsTableRow } from "../../Components/Common/Types/WeaponTypes";
import { getDataFromApi_TarkovDev } from "../../Api/WeaponApiCalls";
import { ammoCaliberArray, ammoCaliberFullNameMap, mapAmmoCaliberFullNameToLabel, unwantedAmmos } from '../../Components/Common/Types/AmmoTypes';
import ImageWithDefaultFallback from "../../Components/Common/ImageWithFallBack";

export function WeaponMRT() {
    const initialData: WeaponsTableRow[] = [];
    const [unfilteredData, setUnfilteredData] = useState<WeaponsTableRow[]>(initialData);
    const [tableData, setTableData] = useState<WeaponsTableRow[]>(initialData);

    const [filterValues, setFilterValues] = useState<string[]>([]);
    const [manualGrouping, setManualGrouping] = useState<string[]>(['caliber']);

    const [pix, pixHandlers] = useDisclosure(false);
    const [filters, filtersHandlers] = useDisclosure(false);
    const [visibility, setVisibility] = useState<Record<string, boolean>>({ caliber: false, });

    async function getTableData() {
        // const response_WishGranterApi = await getDataFromApi_WishGranter();
        // if(response_WishGranterApi !== null){
        //     setWeaponTableData(response_WishGranterApi);
        //     return;
        // }

        const response_ApiTarkovDev = await getDataFromApi_TarkovDev()
        if (response_ApiTarkovDev !== null) {
            setTableData(filterNonBulletsOut(response_ApiTarkovDev));
            setUnfilteredData(filterNonBulletsOut(response_ApiTarkovDev));
            return;
        }

        console.error("Error: Both WishGranter and ApiTarkovDev failed to respond (correctly).")
    }

    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        getTableData();
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

    function filterNonBulletsOut(input: WeaponsTableRow[]) {
        const result = input.filter(x => !unwantedAmmos.includes(x.caliber))
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

    const columns = useMemo<MRT_ColumnDef<WeaponsTableRow>[]>(
        () => [
            {
                accessorKey: 'name', //simple recommended way to define a column
                header: 'Name',
                enableSorting: true,
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
                accessorKey: 'rateOfFire',
                header: 'RoF',
                size: 50,
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => (
                    <>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </>
                ),
            },
            {
                accessorKey: 'defaultErgonomics',
                header: 'Ergonomics (default)',
                size: 80,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => (
                    <>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </>
                ),
            },
            {
                accessorKey: 'defaultRecoil',
                header: 'Vertical Recoil (default)',
                size: 100,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => (
                    <>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </>
                ),
            },

            {
                accessorKey: 'recoilDispersion',
                header: 'Horizontal Recoil (Recoil Dispersion)',
                size: 120,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => (
                    <>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </>
                ),
            },
            {
                accessorKey: 'recoilAngle',
                header: 'Recoil Angle',
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: "median",
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            Median: <strong>{
                                cell
                                    .getValue<Number>()
                                    .toFixed(0)
                            }
                            </strong>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'deviationCurve',
                header: 'Deviation Curve',
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => (
                    <>
                        Mean: <strong>{cell.getValue<number>().toFixed(2)}</strong>
                    </>
                ),
            },
            {
                accessorKey: 'deviationMax',
                header: 'Deviation Max',
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => (
                    <>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </>
                ),
            },
            {
                accessorKey: 'baseErgonomics',
                header: 'Ergonomics (base)',
                size: 100, //small column
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => (
                    <>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </>
                ),
            },
            {
                accessorKey: 'baseRecoil',
                header: 'Vertical Recoil (base)',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 100, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => (
                    <>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </>
                ),
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
        enableColumnDragging: false,
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
                caliber: false,

            },
            density: "xs",

            pagination: {
                pageIndex: 0, pageSize: 200
            },
            columnPinning: {
                left: ['mrt-row-expand', 'name']
                // left: ['mrt-row-expand']
            },
        },
        state: {
            grouping: manualGrouping,
            showGlobalFilter: true,
            columnVisibility: visibility,
            showColumnFilters: filters,
        },
        mantineTableHeadProps: {
            sx: {
                // tableLayout: 'fixed',
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
                    <Button size={'xs'} compact variant={manualGrouping.length > 0 ? 'filled' : 'light'} onClick={handleToggleCaliber} >Group Calibers</Button>
                    <Button size={'xs'} compact variant={pix ? 'filled' : 'light'} onClick={() => pixHandlers.toggle()} >Images</Button>
                    <Button size={'xs'} compact variant={filters ? 'filled' : 'light'} onClick={() => filtersHandlers.toggle()} >Filters</Button>
                </Flex>

                <MultiSelect
                    placeholder="Filter by up to 6 calibers"
                    data={Object.entries(ammoCaliberFullNameMap).map(
                        ([value, label]) => ({ value: value, label: label })
                      )}
                    miw={250}
                    maw={400}
                    maxSelectedValues={6}
                    withinPortal={true}
                    value={filterValues}
                    onChange={setFilterValues}
                />
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
                                <ImageWithDefaultFallback
                                    alt="icon"
                                    height={40}
                                    src={row.original.imageLink}
                                    loading="lazy"
                                    hidden={!pix}
                                />
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