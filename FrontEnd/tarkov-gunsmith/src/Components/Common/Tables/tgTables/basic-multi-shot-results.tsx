import { Button, Flex, Text } from "@mantine/core"
import { useTgTable } from "../use-tg-table"
import { MRT_ColumnDef, MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton, MantineReactTable } from "mantine-react-table"
import { useMemo, useState } from "react";
import { BallisticSimHitSummary, BallisticSimResultV2 } from "../../../../Pages/BallisticsSimulator/api-requests";



export interface MultiShotMultiLayerResultsTableProps {
    result: BallisticSimResultV2
}

export function BasicMultiShotResultsTable({ result }: MultiShotMultiLayerResultsTableProps) {
    const simParameters = result.Inputs;
    const [tableData, setTableData] = useState<BallisticSimHitSummary[]>(result.hitSummaries);

    const [visibility, setVisibility] = useState<Record<string, boolean>>({ caliber: false, });
    const foo = result.Inputs.armorLayers.map((layer, index) => {
        const subColumns: MRT_ColumnDef<BallisticSimHitSummary>[] = [
            {
                id: `L${index}.prBlock`,
                accessorKey: `layerHitResultDetails.${index}.prBlock`,
                header: `Block Chance`,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>() * 100).toFixed(1)} %</div>;
                }
            },
            {
                id: `L${index}.damageBlock`,
                accessorKey: `layerHitResultDetails.${index}.damageBlock`,
                header: `Block Damage`,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: `L${index}.damageMitigated`,
                accessorKey: `layerHitResultDetails.${index}.damageMitigated`,
                header: `Mitigated Damage`,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: `L${index}.averageRemainingDurability`,
                accessorKey: `layerHitResultDetails.${index}.averageRemainingDurability`,
                header: `Durability`,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} / {simParameters.armorLayers[index].maxDurability}</div>;
                },
                mantineTableBodyCellProps: {
                    align: 'center',
                },
            },
        ]

        const columnDef: MRT_ColumnDef<BallisticSimHitSummary> =
        {
            id: `Layer ${index+1}`,
            header: `Layer ${index+1}`,
            columns: subColumns,
            mantineTableHeadCellProps: {
                sx:{backgroundColor: ( (index+1) % 2 === 0 ? "#3b3d44" :"#25262B" )}
            },
        }
        return columnDef
    })

    console.log("foo", foo)

    const standardCols: MRT_ColumnDef<BallisticSimHitSummary>[] = [
        {
            id: "hitNum",
            accessorKey: "hitNum",
            header: 'Hit Num',
        },
        {
            id: "specificChanceOfKill",
            accessorKey: "specificChanceOfKill",
            header: 'SCoK',
            Cell: ({ cell }) => {
                return <div>{(cell.getValue<number>()).toFixed(1)} %</div>;
            }
        },
        {
            id: "cumulativeChanceOfKill",
            accessorKey: "cumulativeChanceOfKill",
            header: 'CCoK',
            Cell: ({ cell }) => {
                return <div>{(cell.getValue<number>()).toFixed(1)} %</div>;
            }
        },
        {
            id: "averageRemainingHP",
            accessorKey: "averageRemainingHP",
            header: 'Average HP',
            Cell: ({ cell }) => {
                return <div>{(cell.getValue<number>()).toFixed(0)} / {simParameters.initialHitPoints}</div>;
            },
            mantineTableBodyCellProps: {
                align: 'center',
            },
        },
        {
            id: "penetrationChance",
            accessorKey: "prPenetration",
            header: 'Penetration Chance',
            Cell: ({ cell }) => {
                return <div>{(cell.getValue<number>() * 100).toFixed(1)} %</div>;
            }
        },

        {
            id: "penetrationDamage",
            accessorKey: "damagePenetration",
            header: 'Penetration Damage',
            Cell: ({ cell }) => {
                return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
            }
        },
    ]
    const combined = standardCols.concat(foo);
    console.log("combined", combined)

    function extractIds(columnDef: MRT_ColumnDef<BallisticSimHitSummary>): string[] {
        const ids: (string | undefined)[] = [columnDef.id];

        if (columnDef.columns) {
            columnDef.columns.forEach(subColumn => {
                ids.push(...extractIds(subColumn));
            });
        }

        return ids.filter(id => id !== undefined) as string[];
    }
    const combinedColsIds3: string[] = combined
        .map(extractIds)
        .flat();

    console.log(combinedColsIds3);


    const columns = useMemo<MRT_ColumnDef<BallisticSimHitSummary>[]>(
        () => combined,
        [combined],
    );

    const table = useTgTable({
        columns,
        data: tableData,

        enableColumnFilters: false,
        enableColumnActions: false,
        enableSorting: false,
        enableBottomToolbar: false,
        enableTopToolbar: false,

        initialState: {
            density: "xs",
            pagination: {
                pageIndex: 0, pageSize: 200
            }
            ,
            columnPinning: {
                left: ['mrt-row-expand']
            },
        },
        state: {
            // grouping: manualGrouping,
            // showGlobalFilter: true,
            // columnVisibility: visibility,
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
            </Flex>

        ),
        renderToolbarInternalActions: ({ table }) => (
            <>
                <MRT_ToggleFullScreenButton table={table} />
            </>
        ),

    })

    // table.toggleAllColumnsVisible()


    return (
        <>
            <MantineReactTable table={table} />
        </>
    )
}