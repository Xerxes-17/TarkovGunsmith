import { Box, Avatar, Button, Flex, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { convertEnumValToArmorString, ArmorPlateZones, ArmorZones, ArmorType, MATERIALS } from "../../../ADC/ArmorData";
import { lightShield, heavyShield, noneShield } from "../../tgIcons";
import { ArmorModule, ArmorModuleTableRow } from "../../../../Types/ArmorTypes";
import { API_URL } from "../../../../Util/util";
import {MRT_ColumnDef,  MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton, MantineReactTable } from "mantine-react-table";
import { tgMultiSelectColOptions, tgNameColOptions, tgNumColOptions, useTgTable } from "../use-tg-table";
import { useDisclosure, useFocusTrap } from "@mantine/hooks";
import { ArmorTypeWithToolTip } from "../../TextWithToolTips/ArmorTypeWithToolTip";
import { BluntThroughputWithToolTip } from "../../TextWithToolTips/BluntThroughputWithToolTip";
import { ArmorMaterialWithToolTip } from "../../TextWithToolTips/ArmorMaterialWithToolTip";
import { MaxRicochetColHeader } from "../../TextWithToolTips/MaxRicochetColHeader";
import { MinAngleRicochetColHeader } from "../../TextWithToolTips/MinAngleRicochetColHeader";
import { MinRicochetColHeader } from "../../TextWithToolTips/MinRicochetColHeader";
import { createHitZoneValues } from "../../Helpers/ArmorHelpers";
import { HitZonesWTT } from "../../TextWithToolTips/HitZonesWTT";
import { RicochetAngleCell } from "../TableCells/RicochetAngleCell";
import { RicochetChanceCell } from "../TableCells/RicochetChanceCells";
import { BluntDamageCell } from "../TableCells/BluntDamageCell";


export function namesDisplay(input: string) {
    return (
        <>
            {input.split(",").map((name) => {
                return <>{name}<br /></>
            })}
        </>
    )
}

export function hitZonesDisplay(row: ArmorModuleTableRow) {
    return (
        <>
            {row.hitZones.map((zone) => {
                return <>{zone}<br /></>
            })}
        </>
    )
}

export function ArmorModulesMRT(){
    const initialData: ArmorModuleTableRow[] = [];
    const [TableData, setTableData] = useState<ArmorModuleTableRow[]>(initialData);
    const focusTrapRef = useFocusTrap();

    const fetchData = async () => {
        try {
            const response = await fetch(API_URL + '/GetArmorModulesData');

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data: ArmorModule[] = await response.json();

            const rows: ArmorModuleTableRow[] = data.map(row => ({
                id: row.id,
                category: row.category,
                armorType: row.armorType,
                name: row.name,
                armorClass: row.armorClass,
                bluntThroughput: row.bluntThroughput,
                maxDurability: row.maxDurability,
                maxEffectiveDurability: row.maxEffectiveDurability,
                armorMaterial: convertEnumValToArmorString(row.armorMaterial),
                weight: row.weight,
                ricochetParams: row.ricochetParams,
                usedInNames: row.usedInNames.join(","),
                compatibleWith: row.compatibleWith.join(","),
                hitZones: createHitZoneValues(row),
            }));

            setTableData(rows);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    // This useEffect will update the ArmorOptions with the result from the async API call
    useEffect(() => {
        fetchData();
    }, [])



    function combinedCollidersDisplay(row: ArmorModule) {
        return (
            <span>
                {armorPlateCollidersDisplay(row)}
                {armorCollidersDisplay(row)}
            </span>
        )

    }

    function armorPlateCollidersDisplay(row: ArmorModule) {
        return (
            <>
                {row.armorPlateColliders.map((enumVal) => {
                    return <>&nbsp;&nbsp;{ArmorPlateZones[enumVal]}<br /></>
                })}
            </>
        )
    }

    function armorCollidersDisplay(row: ArmorModule) {
        return (
            <>
                {row.armorColliders.map((enumVal) => {
                    return <>&nbsp;&nbsp;{ArmorZones[enumVal]}<br /></>
                })}
            </>
        )
    }

    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<ArmorModuleTableRow>[]>(
        
        () => [
            {
                accessorFn: (row) => ArmorType[row.armorType],
                id: 'armorType',
                header: 'Type',
                Header: ArmorTypeWithToolTip(),
                ...tgMultiSelectColOptions
            },
            {
                accessorKey: 'category',
                header: 'Category',
                ...tgMultiSelectColOptions
            },
            {
                accessorKey: 'name',
                header: 'Name',
                size: 50,
                enableSorting: true,
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
                        >
                            {row.original.armorType === ArmorType.Light && lightShield}
                            {row.original.armorType === ArmorType.Heavy && heavyShield}
                            {row.original.armorType === ArmorType.None && noneShield}
                        </Avatar>
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
                ...tgNameColOptions
            },
            {
                accessorKey: 'armorClass',
                header: 'Armor Class',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, 
                ...tgNumColOptions
            },
            {
                accessorKey: 'bluntThroughput',
                header: 'Blunt Throughput',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell, row }) => BluntDamageCell(cell, row.original.hitZones),
                Header: BluntThroughputWithToolTip(),
                ...tgNumColOptions
            },
            {
                accessorKey: 'maxDurability',
                header: 'Durability',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, 
                ...tgNumColOptions
            },
            {
                accessorKey: 'maxEffectiveDurability',
                header: 'Effective Durability',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10,
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                ...tgNumColOptions
            },
            {
                accessorKey: 'armorMaterial',
                header: 'Material',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterSelectOptions: MATERIALS,
                Header: ArmorMaterialWithToolTip(),
                ...tgMultiSelectColOptions
            },
            {
                accessorKey: 'weight',
                header: 'Weight (kg)',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                ...tgNumColOptions
            },
            {
                accessorKey: 'ricochetParams.x',
                header: 'Max Ricochet Chance',
                size: 80,
                Header: MaxRicochetColHeader(),
                Cell: ({cell, row}) => RicochetChanceCell(cell, row.original.ricochetParams),
                ...tgNumColOptions
            },
            {
                accessorKey: 'ricochetParams.y',
                header: 'Min Ricochet Chance',
                size: 80,
                Header: MinRicochetColHeader(),
                Cell: ({cell, row}) => RicochetChanceCell(cell, row.original.ricochetParams),
                ...tgNumColOptions
            },
            {
                accessorKey: 'ricochetParams.z',
                header: 'Min Ricochet Angle',
                size: 80,
                Header: MinAngleRicochetColHeader(),
                Cell: ({cell, row}) => RicochetAngleCell(cell, row.original.ricochetParams),
                ...tgNumColOptions
            },
            {
                accessorKey: 'usedInNames',
                id: 'usedInNames',
                header: 'Default used by',
                Cell: ({ cell }) => (namesDisplay(cell.row.original.usedInNames)),
                ...tgNameColOptions
            },
            {
                accessorKey: 'compatibleWith',
                id: 'compatibleWith',
                header: 'Compatible with',

                Cell: ({ cell }) => (namesDisplay(cell.row.original.compatibleWith)),
                ...tgNameColOptions
            },
            {
                accessorKey: 'hitZones',
                header: 'Hit Zones',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell }) => (hitZonesDisplay(cell.row.original)),
                Header: HitZonesWTT(),
                ...tgNameColOptions
            },
        ],
        [],
    );

    const table = useTgTable({
        columns,
        data: TableData,
        initialState: {
            density: 'xs',
            pagination: {
                pageIndex: 0, pageSize: 200
            },
            columnVisibility: {
                compatibleWith: false,
                ricochetParams: false
            },
            columnPinning: {
                left: ['mrt-row-expand']
            },
            grouping: ['category'],
            expanded: true,
            sorting: [{ id: 'category', desc: true }, { id: 'armorClass', desc: true }, { id: 'name', desc: false }],
        },

        state: {
            showGlobalFilter: true,
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
        renderTopToolbarCustomActions: ({ table }) => (
            <Flex
                gap="md"
                justify="flex-start"
                align="center"
                direction="row"
                wrap="wrap"
                ref={focusTrapRef}
            >
                <MRT_GlobalFilterTextInput table={table} data-autofocus/>
            </Flex>

        ),
        
        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* <MRT_TablePagination table={table} /> */}
                <MRT_ToggleFullScreenButton table={table} />
            </>
        )
    })

    return (
        <MantineReactTable table={table}/>
    )
}