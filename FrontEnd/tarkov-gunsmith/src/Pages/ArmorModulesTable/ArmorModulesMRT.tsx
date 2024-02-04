import { Box, Avatar, Button, Flex, MultiSelect, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { convertEnumValToArmorString, ArmorPlateZones, ArmorZones, ArmorPlateCollider, ArmorCollider, ArmorType, MATERIALS } from "../../Components/ADC/ArmorData";
import { lightShield, heavyShield, noneShield } from "../../Components/Common/tgIcons";
import { ArmorModule, ArmorModuleTableRow } from "../../Types/ArmorTypes";
import { API_URL } from "../../Util/util";
import {MRT_ColumnDef, MRT_ExpandButton, MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton, MantineReactTable } from "mantine-react-table";
import { useTgTable } from "../../Components/Common/use-tg-table";
import ImageWithDefaultFallback from "../../Components/Common/ImageWithFallBack";
import { ammoCaliberFullNameMap } from "../../Types/AmmoTypes";
import { useDisclosure } from "@mantine/hooks";
import { ArmorTypeWithToolTip } from "../../Components/Common/TextWithToolTips/ArmorTypeWithToolTip";
import { BluntThroughputWithToolTip } from "../../Components/Common/TextWithToolTips/BluntThroughputWithToolTip";
import { ArmorMaterialWithToolTip } from "../../Components/Common/TextWithToolTips/ArmorMaterialWithToolTip";
import { MaxRicochetColHeader } from "../../Components/Common/TextWithToolTips/MaxRicochetColHeader";
import { MinAngleRicochetColHeader } from "../../Components/Common/TextWithToolTips/MinAngleRicochetColHeader";
import { MinRicochetColHeader } from "../../Components/Common/TextWithToolTips/MinRicochetColHeader";
import { createHitZoneValues } from "../../Components/Common/Helpers/ArmorHelpers";
import { HitZonesWTT } from "../../Components/Common/TextWithToolTips/HitZonesWTT";
import { RicochetAngleCell } from "../../Components/Common/TableCells/RicochetAngleCell";
import { RicochetChanceCell } from "../../Components/Common/TableCells/RicochetChanceCells";
import { BluntDamageCell } from "../../Components/Common/TableCells/BluntDamageCell";


export function ArmorModulesMRT(){
    const initialData: ArmorModuleTableRow[] = [];
    const [TableData, setTableData] = useState<ArmorModuleTableRow[]>(initialData);
    const [filters, filtersHandlers] = useDisclosure(false);

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

    function namesDisplay(input: string) {
        return (
            <>
                {input.split(",").map((name) => {
                    return <>{name}<br /></>
                })}
            </>
        )
    }

    function hitZonesDisplay(row: ArmorModuleTableRow) {
        return (
            <>
                {row.hitZones.map((zone) => {
                    return <>{zone}<br /></>
                })}
            </>
        )
    }

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
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Header: ArmorTypeWithToolTip()
            },
            {
                accessorKey: 'category',
                header: 'Category',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'name', //simple recommended way to define a column
                header: 'Name',
                muiTableHeadCellProps: { sx: { color: 'white' } }, //custom props
                size: 50, //small column
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
                    // <span>{renderedCellValue}</span>
                ),
            },
            {
                accessorKey: 'armorClass',
                header: 'Armor Class',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, //small column
            },
            {
                accessorKey: 'bluntThroughput',
                header: 'Blunt Throughput',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                Cell: ({ cell, row }) => BluntDamageCell(cell, row.original.hitZones),
                Header: BluntThroughputWithToolTip()
            },
            {
                accessorKey: 'maxDurability',
                header: 'Durability',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 50, //small column
            },
            {
                accessorKey: 'maxEffectiveDurability',
                header: 'eff. Durability',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'armorMaterial',
                header: 'Material',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterVariant: "multi-select",
                filterSelectOptions: MATERIALS,
                Header: ArmorMaterialWithToolTip()
            },
            {
                accessorKey: 'weight',
                header: 'Weight (kg)',
                muiTableHeadCellProps: { sx: { color: 'white' } },
            },
            {
                accessorKey: 'ricochetParams.x',
                header: 'Max Ricochet Chance',
                size: 80,
                Header: MaxRicochetColHeader(),
                Cell: ({cell, row}) => RicochetChanceCell(cell, row.original.ricochetParams)
            },
            {
                accessorKey: 'ricochetParams.y',
                header: 'Min Ricochet Chance',
                size: 80,
                Header: MinRicochetColHeader(),
                Cell: ({cell, row}) => RicochetChanceCell(cell, row.original.ricochetParams)
            },
            {
                accessorKey: 'ricochetParams.z',
                header: 'Min Ricochet Angle',
                size: 80,
                Header: MinAngleRicochetColHeader(),
                Cell: ({cell, row}) => RicochetAngleCell(cell, row.original.ricochetParams)
            },
            {
                accessorKey: 'usedInNames',
                id: 'usedInNames',
                header: 'Default used by',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterVariant: "text",
                filterFn: "contains",
                Cell: ({ cell }) => (namesDisplay(cell.row.original.usedInNames))
            },
            {
                accessorKey: 'compatibleWith',
                id: 'compatibleWith',
                header: 'Compatible with',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterVariant: "text",
                filterFn: "contains",
                Cell: ({ cell }) => (namesDisplay(cell.row.original.compatibleWith))
            },
            {
                accessorKey: 'hitZones',
                header: 'Hit Zones',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                filterVariant: "text",
                filterFn: "contains",
                Cell: ({ cell }) => (hitZonesDisplay(cell.row.original)),
                Header: HitZonesWTT()
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
            grouping: ['category'],
            expanded: true,
            sorting: [{ id: 'category', desc: true }, { id: 'armorClass', desc: true }, { id: 'name', desc: false }],
        },

        state: {
            showGlobalFilter: true,
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
                    <Button size={'xs'} compact variant={filters ? 'filled' : 'light'} onClick={() => filtersHandlers.toggle()} >Filters</Button>
                </Flex>
            </Flex>

        ),
        
        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* <MRT_TablePagination table={table} /> */}
                <MRT_ToggleFullScreenButton table={table} />
            </>
        ),
        mantineTableContainerProps: { 
            // sx: 
            // { maxHeight: '500px' },
            className: "tgMainTableInAppShell"
        },
    })

    return (
        <MantineReactTable table={table}/>
    )
}