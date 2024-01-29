import { useState, useEffect, useMemo } from 'react';
import {
    MantineReactTable,
    useMantineReactTable,
    type MRT_ColumnDef,
    MRT_GlobalFilterTextInput,
    MRT_ToggleFullScreenButton,
    MRT_ExpandButton
} from 'mantine-react-table';
import { Box, Button, Flex, Text, Avatar, Title } from '@mantine/core'
import { useDisclosure } from "@mantine/hooks";
import { HelmetTableRow, PrimaryArmor, SecondaryArmorTableRow } from '../../Types/HelmetTypes';
import { ArmorCollider, MATERIALS, MaterialType } from '../../Components/ADC/ArmorData';
import { armorCollidersToStrings } from '../../Types/ArmorTypes';


export function HelmetsMRT() {
    const initialData: HelmetTableRow[] = [
        {
            id: "example",
            name: "example 6B47 superrr",
            imageLink: "example",
            weight: 4.20,
            ergonomics: 0,
            turnSpeed: 0,
            primaryArmor: {
                type: "Heavy",
                armorClass: 3,
                bluntThroughput: 0.238,
                totalMaxDurability: 45,
                totalMaxEffectiveDurability: 420,
                armorMaterial: "Aluminium",
                ricochetParams: {
                    x: 0.9,
                    y: 0.4,
                    z: 75
                },
                armorColliders: armorCollidersToStrings([
                    ArmorCollider.ParietalHead,
                    ArmorCollider.BackHead,
                    ArmorCollider.Ears
                ]),
            },
            subRows: [
                {
                    id: "example",
                    name: "example 6B47 subbb",
                    imageLink: "example",
                    weight: 4.20,
                    ergonomics: 0,
                    turnSpeed: 0,
                    primaryArmor: {
                        type: "Heavy",
                        armorClass: 3,
                        bluntThroughput: 0.238,
                        totalMaxDurability: 45,
                        totalMaxEffectiveDurability: 420,
                        armorMaterial: "Aluminium",
                        ricochetParams: {
                            x: 0.9,
                            y: 0.4,
                            z: 75
                        },
                        armorColliders: armorCollidersToStrings([
                            ArmorCollider.HeadCommon,
                            ArmorCollider.Eyes,
                            ArmorCollider.Jaw
                        ]),
                    },
                    subRows: []
                }
            ]
        }
    ];
    const [tableData, setTableData] = useState<HelmetTableRow[]>(initialData);
    const [pix, pixHandlers] = useDisclosure(true);
    const [manualGrouping, setManualGrouping] = useState<string[]>([]);

    const [filters, filtersHandlers] = useDisclosure(false);
    const [visibility, setVisibility] = useState<Record<string, boolean>>({ caliber: false, });

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

    const columns = useMemo<MRT_ColumnDef<HelmetTableRow>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'name',
                header: 'Name',
                size: 8,
                Header: ({ column, header }) => (
                    <div style={{ width: "100%" }}>Name</div>),
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
                id: "type",
                accessorKey: "primaryArmor.type",
                header: "Type",
                size: 80,
            },
            {
                accessorKey: "weight",
                header: "Weight",
                size: 80,
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
            },
            {
                id: "armorClass",
                accessorKey: "primaryArmor.armorClass",
                header: "Armor Class",
                size: 80,
            },
            {
                id: "bluntThroughput",
                accessorKey: "primaryArmor.bluntThroughput",
                header: "Blunt Throughput",
                size: 80,
            },
            {
                id: "sectionDurability",
                accessorFn: (row) => row.primaryArmor.totalMaxDurability / row.primaryArmor.armorColliders.length,
                header: "Section Durability",
                size: 80,
            },
            {
                id: "sectionEffectiveDurability",
                accessorFn: (row) => row.primaryArmor.totalMaxEffectiveDurability / row.primaryArmor.armorColliders.length,
                header: "Section Effective Durability",
                size: 80,
            },
            {
                id: "totalDurability",
                accessorKey: "primaryArmor.totalMaxDurability",
                header: "Max Durability",
                size: 80,
            },
            {
                id: "totalEffectiveDurability",
                accessorKey: "primaryArmor.totalMaxEffectiveDurability",
                header: "Max Effective Durability",
                size: 80,
            },
            {
                id: "armorMaterial",
                accessorKey: "primaryArmor.armorMaterial",
                header: "Armor Material",
                size: 80,
                filterVariant: "multi-select",
                filterSelectOptions: MATERIALS
            },
            {
                id: "ricochetX",
                accessorKey: "primaryArmor.ricochetParams.x",
                header: "Max Ricochet Chance",
                size: 80,
            },
            {
                id: "ricochetY",
                accessorKey: "primaryArmor.ricochetParams.y",
                header: "Min Ricochet Chance",
                size: 80,
            },
            {
                id: "ricochetZ",
                accessorKey: "primaryArmor.ricochetParams.z",
                header: "Min Ricochet Angle",
                size: 80,
            },
            {
                id: "armorZones",
                accessorFn: (row) => row.primaryArmor.armorColliders.join(", "),
                header: "Armor Zones",
                size: 80,
            },
        ], []
    );

    const table = useMantineReactTable({
        columns,
        data: tableData,

        enableExpanding: true,
        filterFromLeafRows: true,

        // renderDetailPanel: ({ row }) => (
        //     <Box
        //         sx={{
        //             display: 'flex',
        //             justifyContent: 'flex-start',
        //             alignItems: 'center',
        //             gap: '16px',
        //             padding: '16px',
        //         }}
        //     >
        //         <Avatar
        //             alt="avatar"
        //             size={'md'}
        //             src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
        //         // hidden={!pix && manualGrouping.some(x=>x === 'caliber')}
        //         >
        //             TG
        //         </Avatar>
        //         <Box sx={{ textAlign: 'center' }}>
        //             <Title>Ligma Balls:</Title>
        //             <Text>&quot;{row.original.name}&quot;</Text>
        //         </Box>
        //     </Box>
        // ),

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
                    <Button size={'xs'} compact variant={manualGrouping.length > 0 ? 'filled' : 'light'} onClick={handleToggleCaliber} >Group Calibers</Button>
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
        <Box w={"100%"} p={10} pb={50}>
            <MantineReactTable table={table} />
        </Box>
    );
}