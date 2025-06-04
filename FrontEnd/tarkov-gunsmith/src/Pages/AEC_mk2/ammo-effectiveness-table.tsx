import { useDisclosure, useMediaQuery, useViewportSize } from "@mantine/hooks";
import { tgMultiSelectColOptions, tgNameColOptions, useTgTable } from "../../Components/Common/Tables/use-tg-table";
import { AecData, AvatarNameCellProps, ConvertAecRawToDisplay, CustomHtkCellProps, DisplayRowAEC, findArmHTK, findLegHTK } from "./types";
import { Avatar, Button, Flex, Group, Switch, Text } from "@mantine/core";
import { MantineReactTable, MRT_ColumnDef, MRT_ExpandButton, MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton } from "mantine-react-table";
import { useCallback, useMemo, useState } from "react";
import { mapAmmoCaliberFullNameToLabel } from "../../Types/AmmoTypes";
import { HtkConfidenceInput } from "./htk-confidence-input";
import { HtkBadge } from "./htk-badge";

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

    const customHtkCell = useCallback(({ value, projectileCount }: CustomHtkCellProps) => {
        return (
            <HtkBadge value={value} projectileCount={projectileCount} />
        );
    }, []);

    const avatarNameCell = useCallback(({ renderedCellValue, row }: AvatarNameCellProps) => {
        return (
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
        );
    }, [pix, manualGrouping.length]);



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
                Cell: ({ renderedCellValue, row }) => avatarNameCell({ renderedCellValue, row }),
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
                id: "projectiles",
                accessorKey: "projectileCount",
                header: 'Projectiles',
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(0)}</div>;
                }
            },

            // {
            //     id: "originalDamage",
            //     accessorKey: "originalDamage",
            //     header: 'Base Damage',
            //     Cell: ({ cell }) => {
            //         return <div>{(cell.getValue<number>()).toFixed(1)}</div>;
            //     }
            // },
            // {
            //     id: "originalPenetrationPower",
            //     accessorKey: "originalPenetrationPower",
            //     header: 'Base Penetration',
            //     Cell: ({ cell }) => {
            //         return <div>{(cell.getValue<number>()).toFixed(1)}</div>;
            //     }
            // },


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
                id: "damageDelta",
                header: "Damage Δ(15m)",
                accessorFn: (row) => { return (row.damage - row.originalDamage).toFixed(1) }
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
                id: "penetrationDelta",
                header: "Penetration Δ(15m)",
                accessorFn: (row) => { return (row.penetrationPower - row.originalPenetrationPower).toFixed(1) }
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
                id: "htkLeg",
                header: "HTK Leg",
                size: 10,
                accessorFn(row) {
                    return (findLegHTK(row.damage)).toFixed(1)
                },
                // Cell: ({ row }) => <HtkBadge value={findLegHTK(row.original.damage)} projectileCount={row.original.projectileCount} />,
                Cell: ({ row }) => customHtkCell({ value: findLegHTK(row.original.damage), projectileCount: row.original.projectileCount }),
            },
            {
                id: "htkArm",
                header: "HTK Arm",
                size: 10,
                accessorFn(row) {
                    return (findArmHTK(row.damage)).toFixed(1)
                },
                // Cell: ({ row }) => <HtkBadge value={findArmHTK(row.original.damage)} projectileCount={row.original.projectileCount} />,
                Cell: ({ row }) => customHtkCell({ value: findArmHTK(row.original.damage), projectileCount: row.original.projectileCount }),
            },

            {
                id: "htks",
                header: `Hits to Kill Thorax @ 15m distance with >${lastConfidence}% confidence`,
                columns: [
                    {
                        id: "ac2.avg",
                        header: "AC 2",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc2.avgHTK.toFixed(1)
                        },
                        // Cell: ({ row }) => <HtkBadge value={row.original.htkAc2.avgHTK} projectileCount={row.original.projectileCount} />,
                        Cell: ({ row }) => customHtkCell({ value: row.original.htkAc2.avgHTK, projectileCount: row.original.projectileCount }),
                    },
                    {
                        id: "ac3Legacy.avg",
                        header: "AC 3 (Legacy)",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc3Legacy.avgHTK.toFixed(1)
                        },
                        // Cell: ({ row }) => <HtkBadge value={row.original.htkAc3Legacy.avgHTK} projectileCount={row.original.projectileCount} />,
                        Cell: ({ row }) => customHtkCell({ value: row.original.htkAc3Legacy.avgHTK, projectileCount: row.original.projectileCount }),
                    },
                    {
                        id: "ac3.avg",
                        header: "AC 3",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc3.avgHTK.toFixed(1)
                        },
                        // Cell: ({ row }) => <HtkBadge value={row.original.htkAc3.avgHTK} projectileCount={row.original.projectileCount} />,
                        Cell: ({ row }) => customHtkCell({ value: row.original.htkAc3.avgHTK, projectileCount: row.original.projectileCount }),
                    },
                    {
                        id: "ac4Legacy.avg",
                        header: "AC 4 (Legacy)",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc4Legacy.avgHTK.toFixed(1)
                        },
                        // Cell: ({ row }) => <HtkBadge value={row.original.htkAc4Legacy.avgHTK} projectileCount={row.original.projectileCount} />,
                        Cell: ({ row }) => customHtkCell({ value: row.original.htkAc4Legacy.avgHTK, projectileCount: row.original.projectileCount }),
                    },
                    {
                        id: "ac4.avg",
                        header: "AC 4",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc4.avgHTK.toFixed(1)
                        },
                        // Cell: ({ row }) => <HtkBadge value={row.original.htkAc4.avgHTK} projectileCount={row.original.projectileCount} />,
                        Cell: ({ row }) => customHtkCell({ value: row.original.htkAc4.avgHTK, projectileCount: row.original.projectileCount }),
                    },
                    {
                        id: "ac5.avg",
                        header: "AC 5",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc5.avgHTK.toFixed(1)
                        },
                        // Cell: ({ row }) => <HtkBadge value={row.original.htkAc5.avgHTK} projectileCount={row.original.projectileCount} />,
                        Cell: ({ row }) => customHtkCell({ value: row.original.htkAc5.avgHTK, projectileCount: row.original.projectileCount }),
                    },
                    {
                        id: "ac6.avg",
                        header: "AC 6",
                        size: 10,
                        accessorFn(originalRow) {
                            return originalRow.htkAc6.avgHTK.toFixed(1)
                        },
                        // Cell: ({ row }) => <HtkBadge value={row.original.htkAc6.avgHTK} projectileCount={row.original.projectileCount} />,
                        Cell: ({ row }) => customHtkCell({ value: row.original.htkAc6.avgHTK, projectileCount: row.original.projectileCount }),
                    },
                ]
            }
        ]
        , [lastConfidence, avatarNameCell, customHtkCell]
    );

    const mobileView = useMediaQuery('(max-width: 766px)');
    const { height:vpHeight, width: vpWidth } = useViewportSize();

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
                left: ['mrt-row-expand', 'name']
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
                height: mobileView ? vpHeight - 225 : undefined
            }

        },
        mantineTableContainerProps: {
            style: {
                height: mobileView ? vpHeight - 225 : undefined
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
                gap="lg"
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
                    <Group spacing={'xs'}>
                        <Text fw={600}>Toggles</Text>
                        <Button size={'xs'} compact variant={manualGrouping.length > 0 ? 'filled' : 'light'} onClick={handleToggleCaliber} >Group Calibers</Button>
                        <Button size={'xs'} compact variant={pix ? 'filled' : 'light'} onClick={() => pixHandlers.toggle()} >Images</Button>
                    </Group>

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