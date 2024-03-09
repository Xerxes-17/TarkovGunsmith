import { Button, Flex, Text } from "@mantine/core"
import { useTgTable } from "../use-tg-table"
import { visibility } from "html2canvas/dist/types/css/property-descriptors/visibility"
import { MRT_ColumnDef, MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton, MantineReactTable } from "mantine-react-table"
import { useMemo, useState } from "react";
import { BallisticSimulatorFormValues, FormArmorLayer } from "../../../../Pages/BallisticsSimulator/ballistic-simulator-form-context";
import { BallisticSimResultV2 } from "../../../../Pages/BallisticsSimulator/api-requests";

export interface MultiShotMultiLayerSummary {
    penetrationChance: number,
    penetrationDamage: number,
    mitigatedDamageTotalPenetration: number,
    blockedDamageAverage: number,
    specificChanceOfKill: number,
    cumulativeChanceOfKill: number,
    averageRemainingHP: number
}

export interface LayerDetails {
    isPlate: boolean,
    prPen: number,
    penetrationDamage: number,
    damageMitigated: number,
    blockedDamage: number,
    durability: number,
}

export interface MultiShotMultiLayerDetails {
    penetrationChance: number,
    penetrationDamage: number,
    layers: LayerDetails[]
}

export interface MultiShotMultiLayerTableRow {
    hitNum: number,
    parameters: BallisticSimulatorFormValues,
    summary: MultiShotMultiLayerSummary,
    details: MultiShotMultiLayerDetails,
}


const demoRow: MultiShotMultiLayerTableRow = {
    hitNum: 1,
    parameters: {
        penetration: 40,
        damage: 50,
        armorDamagePercentage: 55,
        targetZone: "Thorax",
        hitPointsPool: 85,
        maxLayers: 2,
        armorLayers: [
            {
                isPlate: true,
                armorClass: 4,
                bluntDamageThroughput: 20,
                durability: 10,
                maxDurability: 40,
                armorMaterial: "Steel"
            },
            {
                isPlate: false,
                armorClass: 2,
                bluntDamageThroughput: 30,
                durability: 30,
                maxDurability: 30,
                armorMaterial: "Aramid"
            }
        ]
    },
    summary: {
        penetrationChance: 60,
        penetrationDamage: 25,
        mitigatedDamageTotalPenetration: 25,
        blockedDamageAverage: 10,
        specificChanceOfKill: 30,
        cumulativeChanceOfKill: 60,
        averageRemainingHP: 45
    },
    details: {
        penetrationChance: 60,
        penetrationDamage: 25,
        layers: [
            {
                isPlate: true,
                prPen: 60,
                penetrationDamage: 25,
                damageMitigated: 15,
                blockedDamage: 10,
                durability: 20
            },
            {
                isPlate: false,
                prPen: 100,
                penetrationDamage: 25,
                damageMitigated: 0,
                blockedDamage: 10,
                durability: 15
            }

        ]
    }

}

const basicVisibility: Record<string, boolean> = {
    "hitNum": true,
    "specificChanceOfKill": true,
    "cumulativeChanceOfKill": true,
    "averageRemainingHP": true,
    "penetrationChance": true,
    "penetrationDamage": true,
    "mitigatedDamage": false,
    "blockedChance": false,
    "blockedDamageAverage": false,
    "Layers": true,
    "Layer 0": true,
    "L0.dp": true,
    "L0.prPen": true,
    "L0.penetrationDamage": false,
    "L0.damageMitigated": true,
    "L0.blockedDamage": true,
    "Layer 1": true,
    "L1.dp": true,
    "L1.prPen": true,
    "L1.penetrationDamage": false,
    "L1.damageMitigated": true,
    "L1.blockedDamage": true
}

export interface MultiShotMultiLayerResultsTableProps {
    result: BallisticSimResultV2
}

export function MultiShotMultiLayerResultsTable({result}: MultiShotMultiLayerResultsTableProps) {

    const initialData: MultiShotMultiLayerTableRow[] = [demoRow];

    const [tableData, setTableData] = useState<MultiShotMultiLayerTableRow[]>(initialData);

    const [visibility, setVisibility] = useState<Record<string, boolean>>({ caliber: false, });

    const foo = demoRow.parameters.armorLayers.map((layer, index) => {
        const subColumns: MRT_ColumnDef<MultiShotMultiLayerTableRow>[] = [
            {
                id: `L${index}.prPen`,
                accessorFn: (row) => `${100 - row.details.layers[index].prPen}`,
                // accessorKey: `details.layers.${index}.prPen`,
                header: `Block Chance`,
            },
            {
                id: `L${index}.penetrationDamage`,
                accessorKey: `details.layers.${index}.penetrationDamage`,
                header: `Dam Pen`,
            },
            {
                id: `L${index}.blockedDamage`,
                accessorKey: `details.layers.${index}.blockedDamage`,
                header: `Dam Blk`,
            },
            {
                id: `L${index}.damageMitigated`,
                accessorKey: `details.layers.${index}.damageMitigated`,
                header: `Dam Mit`,
            },

            {
                id: `L${index}.dp`,
                accessorKey: `details.layers.${index}.durability`,
                header: `Dura`,
            },

        ]

        const columnDef: MRT_ColumnDef<MultiShotMultiLayerTableRow> =
        {
            id: `Layer ${index}`,
            header: `Layer ${index}`,
            columns: subColumns
        }
        return columnDef
    })

    const bar: MRT_ColumnDef<MultiShotMultiLayerTableRow> = {
        header: 'Layers',
        id: 'Layers',
        columns: foo,
        // mantineTableHeadCellProps:{
        //     sx:{backgroundColor: "green"}
        // }
    }

    console.log("foo", foo)

    const standardCols: MRT_ColumnDef<MultiShotMultiLayerTableRow>[] = [
        {
            id: "hitNum",
            accessorKey: "hitNum",
            header: 'hitNum',
        },
        {
            id: "specificChanceOfKill",
            accessorKey: "summary.specificChanceOfKill",
            header: 'SCoK',
        },
        {
            id: "cumulativeChanceOfKill",
            accessorKey: "summary.cumulativeChanceOfKill",
            header: 'CCoK',
        },
        {
            id: "averageRemainingHP",
            accessorKey: "summary.averageRemainingHP",
            header: 'Average Remaining HP',
        },
        {
            id: "penetrationChance",
            accessorKey: "summary.penetrationChance",
            header: 'Penetration Chance',
        },
        {
            id: "penetrationDamage",
            accessorKey: "summary.penetrationDamage",
            header: 'Penetration Damage',
        },
        {
            id: "mitigatedDamage",
            accessorKey: "summary.mitigatedDamageTotalPenetration",
            header: 'mitigated Damage',
        },
        {
            id: "blockedChance",
            accessorFn: (row) => `${100 - row.summary.penetrationChance}`,
            header: 'Blocked Chance',
        },
        {
            id: "blockedDamageAverage",
            accessorKey: "summary.blockedDamageAverage",
            header: 'Average Blocked Damage ',
        },
    ]

    const insertIndex = standardCols.length - 2;

    // const combined = Array.prototype.splice.apply(standardCols, [insertIndex, 0].concat(foo));
    // const combined = standardCols.splice(insertIndex, 0, bar);
    const combined = standardCols.concat(foo);
    console.log("combined", combined)
    const combinedColsIds: string[] = combined.map(column => column.id).filter(id => id !== undefined) as string[];
    console.log("combinedColsIds", combinedColsIds)

    const combinedColsIds2: string[] = combined
        .map(columnDef => {
            const ids: (string | undefined)[] = [columnDef.id];

            if (columnDef.columns) {
                columnDef.columns.forEach(subColumn => {
                    if (subColumn.id !== undefined) {
                        ids.push(subColumn.id);
                    }
                });
            }

            return ids.filter(id => id !== undefined) as string[];
        })
        .flat();

    console.log("combinedColsIds2", combinedColsIds2)

    function extractIds(columnDef: MRT_ColumnDef<MultiShotMultiLayerTableRow>): string[] {
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


    const columns = useMemo<MRT_ColumnDef<MultiShotMultiLayerTableRow>[]>(
        () => combined,
        [combined],
    );

    const table = useTgTable({
        columns,
        data: tableData,

        enableColumnFilters: false,
        enableColumnActions: false,
        enableSorting: false,

        enableExpanding: true,
        filterFromLeafRows: true,

        initialState: {
            columnVisibility: basicVisibility,
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

        mantineTableBodyCellProps: ({
            cell,
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

    })

    // table.toggleAllColumnsVisible()


    return (
        <>
            <MantineReactTable table={table} />
        </>
    )
}