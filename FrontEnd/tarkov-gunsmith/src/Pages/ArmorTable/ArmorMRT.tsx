import { useState, useEffect, useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    MRT_GlobalFilterTextInput,
    MRT_ToggleFullScreenButton} from 'mantine-react-table';
import { Button, Flex, Text } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks";
import { NewArmorTableRow } from '../../Types/HelmetTypes';
import { convertEnumValToArmorString } from '../../Components/ADC/ArmorData';
import { getArmorStatsDataFromApi_WishGranter } from '../../Api/ArmorApiCalls';
import { ArmorZonesTableCell } from '../../Components/Common/ArmorZonesTableCell';
import { MaxRicochetColHeader } from '../../Components/Common/TextWithToolTips/MaxRicochetColHeader';
import { MinRicochetColHeader } from '../../Components/Common/TextWithToolTips/MinRicochetColHeader';
import { MinAngleRicochetColHeader } from '../../Components/Common/TextWithToolTips/MinAngleRicochetColHeader';
import { ArmorMaterialWithToolTip } from '../../Components/Common/TextWithToolTips/ArmorMaterialWithToolTip';
import { BluntThroughputWithToolTip } from '../../Components/Common/TextWithToolTips/BluntThroughputWithToolTip';
import { ArmorTypeWithToolTip } from '../../Components/Common/TextWithToolTips/ArmorTypeWithToolTip';
import { HitZonesWTT } from '../../Components/Common/TextWithToolTips/HitZonesWTT';
import { createHitZoneValues_ArmorTableRow } from '../../Components/Common/Helpers/ArmorHelpers';
import { ArmorBluntDamageCell } from '../../Components/Common/TableCells/ArmorBluntDamageCell';
import { RicochetAngleCell } from '../../Components/Common/TableCells/RicochetAngleCell';
import { RicochetChanceCell } from '../../Components/Common/TableCells/RicochetChanceCells';
import { DirectPercentageCell } from '../../Components/Common/TableCells/DirectPercentageCell';
import { NameAndAvatarCell } from '../../Components/Common/TableCells/NameAndAvatarCell';

export function ArmorMRT() {
    const initialData: NewArmorTableRow[] = [];
    const [tableData, setTableData] = useState<NewArmorTableRow[]>(initialData);
    const [pix, pixHandlers] = useDisclosure(true);
    const [expandedArmorZones, expandedArmorZonesHandlers] = useDisclosure(true);
    const [manualGrouping, setManualGrouping] = useState<string[]>([]);

    const [filters, filtersHandlers] = useDisclosure(false);
    const [visibility, setVisibility] = useState<Record<string, boolean>>({ caliber: false, });

    async function getTableData() {
        const response_ApiWishGranter = await getArmorStatsDataFromApi_WishGranter()

        if (response_ApiWishGranter !== null) {
            setTableData(response_ApiWishGranter);
            return;
        }

        console.error("Error: WishGranter failed to respond (correctly).")
    }

    useEffect(() => {
        getTableData();
    }, [])

    const columns = useMemo<MRT_ColumnDef<NewArmorTableRow>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                header: 'Name',
                size: 8,
                Header: () => (
                    <div style={{ width: "100%" }}>Name</div>),
                Cell: ({ renderedCellValue, row }) => NameAndAvatarCell(renderedCellValue, row, pix)
            },
            {
                id: "type",
                accessorKey: "type",
                header: "Type",
                size: 80,
                Header: ArmorTypeWithToolTip()
            },
            {
                accessorKey: "weight",
                header: "Weight (kg)",
                size: 80,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toFixed(2)}</span>
                ),
            },

            {
                accessorKey: "ergonomics",
                header: "Ergonomics",
                size: 80,
            },
            {
                accessorKey: "turnSpeed",
                header: "Turn Speed",
                size: 80,
                Cell: ({ cell }) => DirectPercentageCell(cell)
            },
            {
                accessorKey:"speedPenalty",
                header: "Movement Speed Penalty",
                size: 80,
                Cell: ({ cell }) => DirectPercentageCell(cell)
            },
            {
                id: "armorClass",
                accessorKey: "armorClass",
                header: "Armor Class",
                size: 80,
            },
            {
                id: "bluntThroughput",
                accessorKey: "bluntThroughput",
                header: "Blunt Throughput",
                size: 80,
                Cell: ({ cell, row }) => ArmorBluntDamageCell(cell, row),
                Header: BluntThroughputWithToolTip()
            },
            {
                id: "default",
                accessorKey: "isDefault",
                header: "Built In",
                size: 80,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<boolean>()).toLocaleString()}</span>
                ),
            },
            {
                id: "durability",
                accessorKey: "durability",
                header: "Durability",
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            <strong>{cell.getValue<number>().toFixed(0)}</strong>
                        </div>
                    )
                },
                size: 80,
            },
            {
                id: "effectiveDurability",
                accessorKey: "effectiveDurability",
                header: "Effective Durability",
                size: 80,
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            <strong>{cell.getValue<number>().toFixed(0)}</strong>
                        </div>
                    )
                },
            },
            {
                id: "armorMaterial",
                accessorFn: (row) => convertEnumValToArmorString(row.armorMaterial),
                header: "Armor Material",
                size: 80,
                filterVariant: "text",
                // filterVariant: "multi-select",
                // filterSelectOptions: MATERIALS
                Header: ArmorMaterialWithToolTip()
            },
            {
                id: "ricochetX",
                accessorKey: "ricochetParams.x",
                header: "Max Ricochet Chance",
                size: 80,
                Header: MaxRicochetColHeader(),
                Cell: ({ cell, row }) => RicochetChanceCell(cell, row.original.ricochetParams)
            },
            {
                id: "ricochetY",
                accessorKey: "ricochetParams.y",
                header: "Min Ricochet Chance",
                size: 80,
                Header: MinRicochetColHeader(),
                Cell: ({ cell, row }) => RicochetChanceCell(cell, row.original.ricochetParams)
            },
            {
                id: "ricochetZ",
                accessorKey: "ricochetParams.z",
                header: "Min Ricochet Angle",
                size: 80,
                Header: MinAngleRicochetColHeader(),
                Cell: ({ cell, row }) => RicochetAngleCell(cell, row.original.ricochetParams)
            },
            {
                id: "armorZones",
                accessorFn: (row) => createHitZoneValues_ArmorTableRow(row),
                header: "Armor Zones",
                size: 80,
                Cell: ({ row, cell }) => {
                    if (expandedArmorZones === true && row.getParentRow() === undefined) {
                        return ArmorZonesTableCell(cell.getValue<string[]>());
                    }
                    else {
                        const temp = createHitZoneValues_ArmorTableRow(row.original);
                        return temp.map((zone) => (<>{zone}<br /></>))
                    }
                },
                Header: HitZonesWTT()
            },
        ], [pix, expandedArmorZones]
    );

    const table = useMantineReactTable({
        columns,
        data: tableData,

        enableExpanding: true,
        filterFromLeafRows: true,

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

        enableDensityToggle: false,
        positionToolbarAlertBanner: "bottom",

        enableRowSelection: false,
        columnFilterDisplayMode: "subheader",
        positionPagination: "bottom",
        mantinePaginationProps: {
            rowsPerPageOptions: ["10", "25", "50", "75", "100", "150", "200"],
        },
        initialState: {
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

        mantineTableBodyCellProps: ({
            row
        }) => ({
            sx: {
                backgroundColor: row.getParentRow() !== undefined ? 'rgba(30, 30, 30, 1)' : undefined,
                // backgroundColor: cell.getValue<number>() > 40 ? 'rgba(22, 184, 44, 0.5)' : undefined,
                // fontWeight: cell.column.id === 'age' && cell.getValue<number>() > 40 ? 'bold' : 'normal'
            }
        }),

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
                    {/* <Button size={'xs'} compact variant={manualGrouping.length > 0 ? 'filled' : 'light'} onClick={handleToggleCaliber} >Group Calibers</Button> */}
                    <Button size={'xs'} compact variant={pix ? 'filled' : 'light'} onClick={() => pixHandlers.toggle()} >Images</Button>
                    <Button size={'xs'} compact variant={filters ? 'filled' : 'light'} onClick={() => filtersHandlers.toggle()} >Filters</Button>
                    <Button size={'xs'} compact variant={expandedArmorZones ? 'light' : 'filled'} onClick={() => expandedArmorZonesHandlers.toggle()} >{expandedArmorZones ? 'Show Zones' : 'Hide Zones'}</Button>
                </Flex>
            </Flex>

        ),
        // displayColumnDefOptions: {
        //     "mrt-row-expand": {
        //         Cell: ({ cell, row, table }) => {
        //             const isAggregated = cell.getIsAggregated();

        //             return (
        //                 <Box>
        //                     {isAggregated ? (
        //                         <>
        //                             <MRT_ExpandButton row={row} table={table} />
        //                         </>
        //                     ) : (
        //                         <Avatar
        //                             alt="avatar"
        //                             size={'md'}
        //                             src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
        //                             style={{ display: pix ? "block" : "none" }}
        //                             hidden={!pix}
        //                         >
        //                             TG
        //                         </Avatar>
        //                     )}
        //                 </Box>
        //             );
        //         },
        //     },
        // },
        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* <MRT_TablePagination table={table} /> */}
                <MRT_ToggleFullScreenButton table={table} />
            </>
        ),
    });

    return (
        <MantineReactTable table={table} />
    );
}