import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { tgMultiSelectColOptions, tgNameColOptions, useTgTable } from "../../Components/Common/Tables/use-tg-table";
import { AecData, ConvertAecRawToDisplay, DisplayRowAEC } from "./types";
import { Avatar, Button, Flex, Group, Text } from "@mantine/core";
import { MantineReactTable, MRT_ColumnDef, MRT_ExpandButton, MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton } from "mantine-react-table";
import { useMemo, useState } from "react";
import { mapAmmoCaliberFullNameToLabel } from "../../Types/AmmoTypes";
import { HtkConfidenceInput } from "./htk-confidence-input";

export function AmmoEffectivenessTable({ tableData }: { tableData: AecData }) {

    const [processedAmmoData, setProcessedAmmoData] = useState<DisplayRowAEC[]>(ConvertAecRawToDisplay(tableData, 75));

    const [lastConfidence, setLastConfidence] = useState<number>(75)

    function onClickRefreshConfidence(value: number) {
        if (!tableData) {
            return
        }

        const valueAsNum = typeof value !== 'string' ? value : 75
        setLastConfidence(valueAsNum)

        const processedTableData = ConvertAecRawToDisplay(tableData, valueAsNum)
        setProcessedAmmoData(processedTableData)
    }

    const [pix, pixHandlers] = useDisclosure(true);

    const [manualGrouping, setManualGrouping] = useState<string[]>(['caliber']);
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

    const columns = useMemo<MRT_ColumnDef<DisplayRowAEC>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'ammoName',
                header: 'Name',
                size: 45,
                Header: ({ column, header }) => (
                    <div style={{ width: "100%" }}>Name</div>),
                AggregatedCell: ({ row }) => row.renderValue("caliber"),
                Cell: ({ renderedCellValue, row }) => (
                    <Group align="center">
                        <Avatar
                            alt="avatar"
                            size={'md'}
                            src={`https://assets.tarkov.dev/${row.original.ammoId}-icon.webp`}
                            style={{ display: pix && manualGrouping.length === 0 ? "block" : "none" }}
                        >
                            TG
                        </Avatar>
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Group>
                ),
                ...tgNameColOptions
            },

            {
                id: "caliber",
                accessorFn: (row) => `${mapAmmoCaliberFullNameToLabel(row.caliber)}`,
                accessorKey: 'caliber',
                header: 'Caliber',
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue}</span>
                ),
                ...tgMultiSelectColOptions
            },

            {
                id: "originalDamage",
                accessorKey: "originalDamage",
                header: 'Base Damage',
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)}</div>;
                }
            },
            {
                id: "originalPenetrationPower",
                accessorKey: "originalPenetrationPower",
                header: 'Base Penetration',
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)}</div>;
                }
            },
            

            {
                id: "damage",
                accessorKey: "damage",
                header: 'Damage',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)}</div>;
                }
            },
            {
                id: "penetrationPower",
                accessorKey: "penetrationPower",
                header: 'Penetration',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)}</div>;
                }
            },
            {
                id: "armorDamagePerc",
                accessorKey: "armorDamagePerc",
                header: 'Armor Damage%',
                size: 30,
            },
            {
                id: "baseArmorDamage",
                header: 'Derived Armor Damage',
                minSize: 80,
                accessorFn(originalRow) {
                    return (originalRow.penetrationPower * (originalRow.armorDamagePerc / 100)).toFixed(1)
                },
            },

            {
                id: "htks",
                header: `Hits to Kill Thorax @ 15m distance with >${lastConfidence}% confidence`,
                columns: [
                    {
                        id: "ac3.avg",
                        header: "AC 3",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc3.avgHTK.toFixed(1)
                        },
                        
                    },
                    {
                        id: "ac4.avg",
                        header: "AC 4",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc4.avgHTK.toFixed(1)
                        },
                    },
                    {
                        id: "ac5.avg",
                        header: "AC 5",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc5.avgHTK.toFixed(1)
                        },
                    },
                    {
                        id: "ac6.avg",
                        header: "AC 6",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc6.avgHTK.toFixed(1)
                        },
                    },
                ]
            }
        ]
        , [manualGrouping.length, pix, lastConfidence]
    );

    const mobileView = useMediaQuery('(max-width: 766px)');

    const table = useTgTable({
        columns,
        data: processedAmmoData,

        layoutMode: "semantic",

        enableColumnFilters: true,
        enableColumnActions: false,
        enableSorting: true,
        enableBottomToolbar: true,
        enableTopToolbar: true,
        initialState: {
            expanded: true,
            density: "xs",
            pagination: {
                pageIndex: 0, pageSize: 200
            }
            ,
            columnPinning: {
                left: ['mrt-row-expand']
            },
            sorting: [{ id: 'penetrationPower', desc: true }],
        },

        state: {
            grouping: manualGrouping,
            showGlobalFilter: true,
            columnVisibility: visibility,
        },
        mantinePaperProps: {
            style: {
                height: mobileView ? 300 : undefined
            }

        },
        mantineTableContainerProps: {
            style: {
                height: mobileView ? 300 : undefined
            },
            className: "tgMainTableInAppShell"
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

        // mantineTableHeadRowProps: {
        //     sx: {
        //         // backgroundColor: "green",
        //         top: "40px"
        //     }
        // },

        mantineTableHeadCellProps: {
            style: {
                verticalAlign: "bottom",
            },
            sx: {
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
                    <Text fw={600}>Toggles</Text>
                    <Button size={'xs'} compact variant={manualGrouping.length > 0 ? 'filled' : 'light'} onClick={handleToggleCaliber} >Group Calibers</Button>
                    <Button size={'xs'} compact variant={pix ? 'filled' : 'light'} onClick={() => pixHandlers.toggle()} >Images</Button>
                    <HtkConfidenceInput onClick={onClickRefreshConfidence} />
                </Flex>

            </Flex>

        ),
        displayColumnDefOptions: {
            "mrt-row-expand": {
                Cell: ({ cell, row, table }) => {
                    const isAggregated = cell.getIsAggregated();

                    return (
                        <>
                            {isAggregated ? (
                                <>
                                    <MRT_ExpandButton row={row} table={table} />
                                </>
                            ) : (
                                <Avatar
                                    alt="avatar"
                                    size={'32px'}
                                    src={`https://assets.tarkov.dev/${row.original.ammoId}-icon.webp`}
                                    style={{ display: pix ? "block" : "none" }}
                                    hidden={!pix}
                                >
                                    TG
                                </Avatar>
                            )}
                        </>
                    );
                },
            },
        },
        renderToolbarInternalActions: ({ table }) => (
            <>
                <MRT_ToggleFullScreenButton table={table} />
            </>
        ),
    })

    return (
        <>
            <MantineReactTable table={table} />
        </>
    )
}