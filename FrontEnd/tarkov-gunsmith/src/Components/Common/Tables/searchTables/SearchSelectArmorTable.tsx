import { useEffect, useMemo, useState } from "react";

import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { Avatar, Group, CloseButton } from "@mantine/core";
import { useViewportSize } from "@mantine/hooks";
import { useBaseSearchSelectTable } from "../BaseSearchSelectTable";
import { useBallisticSimulatorFormContext } from "../../../../Pages/BallisticsSimulator/ballistic-simulator-form-context";
import { API_URL } from "../../../../Util/util";
import { ArmorModule, ArmorModuleTableRow } from "../../../../Types/ArmorTypes";
import { armorZoneOptions, createHitZoneValues, returnZonesFromTargetZone } from "../../Helpers/ArmorHelpers";
import { ArmorType, MATERIALS, convertEnumValToArmorString } from "../../../ADC/ArmorData";
import { lightShield, heavyShield, noneShield } from "../../tgIcons";
import { BluntDamageCell } from "../TableCells/BluntDamageCell";
import { BluntThroughputWithToolTip } from "../../TextWithToolTips/BluntThroughputWithToolTip";
import { ArmorMaterialWithToolTip } from "../../TextWithToolTips/ArmorMaterialWithToolTip";
import { HitZonesWTT } from "../../TextWithToolTips/HitZonesWTT";
import { hitZonesDisplay, namesDisplay } from "../tgTables/ArmorModulesMRT";

interface SearchSelectArmorTableProps {
    CloseDrawerCb: () => void,
    layerIndex: number
}

export function SearchSelectArmorTable({ CloseDrawerCb, layerIndex }: SearchSelectArmorTableProps) {
    const form = useBallisticSimulatorFormContext();
    const targetZone = form.values.targetZone;
    const initialHitZones = returnZonesFromTargetZone(targetZone);
    
    const { height } = useViewportSize();

    function calculatedTableHeight() {
        if (height < 800) {
            return height - 200;
        }
        else {
            return height - 200;
        }
    }
    const tableHeight = calculatedTableHeight();

    const initialData: ArmorModuleTableRow[] = [];
    const [tableData, setTableData] = useState<ArmorModuleTableRow[]>(initialData);

    const getTableData = async () => {
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

    function handleRowSelect(rowOriginal: ArmorModuleTableRow) {
        form.setFieldValue(`armorLayers.${layerIndex}.isPlate`, rowOriginal.category === "Plate" ? true : false);
        form.setFieldValue(`armorLayers.${layerIndex}.armorClass`, rowOriginal.armorClass);
        form.setFieldValue(`armorLayers.${layerIndex}.bluntDamageThroughput`, rowOriginal.bluntThroughput * 100);

        form.setFieldValue(`armorLayers.${layerIndex}.durability`, rowOriginal.maxDurability);
        form.setFieldValue(`armorLayers.${layerIndex}.maxDurability`, rowOriginal.maxDurability);

        form.setFieldValue(`armorLayers.${layerIndex}.armorMaterial`, rowOriginal.armorMaterial);

        CloseDrawerCb();
    }

    useEffect(() => {
        getTableData();
    }, [])

    const columns = useMemo<MRT_ColumnDef<ArmorModuleTableRow>[]>(
        () => [
            {
                accessorKey: 'name', //simple recommended way to define a column
                header: 'Name',
                size: 50, //small column
                enableSorting: true,
                filterFn: "contains",
                columnFilterModeOptions: [],
                Cell: ({ renderedCellValue, row }) => (
                    <Group>
                        <Avatar
                            alt={`${ArmorType[row.original.armorType]}`}
                            size={'sm'}
                            src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
                        >
                            {row.original.armorType === ArmorType.Light && lightShield}
                            {row.original.armorType === ArmorType.Heavy && heavyShield}
                            {row.original.armorType === ArmorType.None && noneShield}
                        </Avatar>
                        <span>{renderedCellValue}</span>
                    </Group>
                ),
            },
            {
                accessorKey: 'usedInNames',
                id: 'usedInNames',
                header: 'Default used by',
                filterVariant: "text",
                filterFn: "contains",
                columnFilterModeOptions: [],
                Cell: ({ cell }) => (namesDisplay(cell.row.original.usedInNames))
            },
            {
                accessorKey: 'armorClass',
                header: 'Armor Class',
                size: 50, //small column
                filterFn: "greaterThanOrEqualTo",
                columnFilterModeOptions: ['between', 'lessThan', 'greaterThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'],
            },
            {
                accessorKey: 'bluntThroughput',
                accessorFn: (originalRow) => originalRow.bluntThroughput * 100,
                header: 'Blunt Throughput',
                filterFn: "greaterThanOrEqualTo",
                columnFilterModeOptions: ['between', 'lessThan', 'greaterThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'],
                Cell: ({ cell, row }) => BluntDamageCell(cell, row.original.hitZones),
                Header: BluntThroughputWithToolTip()
            },
            {
                accessorKey: 'maxDurability',
                header: 'Durability',
                size: 50, //small column
                filterFn: "greaterThanOrEqualTo",
                columnFilterModeOptions: ['between', 'lessThan', 'greaterThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'],
            },
            {
                accessorKey: 'armorMaterial',
                header: 'Material',
                filterVariant: "multi-select",
                filterFn: "arrIncludesSome",
                columnFilterModeOptions: [],
                filterSelectOptions: MATERIALS,
                Header: ArmorMaterialWithToolTip()
            },

            {
                id: "hitZones",
                accessorFn: (row) => row.hitZones.join(", "),
                header: 'Hit Zones',
                filterVariant: "multi-select",
                filterFn: "arrIncludesSome",
                mantineFilterMultiSelectProps: {
                    data: armorZoneOptions as any,
                },
                columnFilterModeOptions: [],
                Cell: ({ cell }) => (hitZonesDisplay(cell.row.original)),
                Header: HitZonesWTT()
            },
        ],
        [],
    );
    const table = useBaseSearchSelectTable<ArmorModuleTableRow>({
        columns,
        data: tableData,

        initialState: {
            expanded: true,
            columnVisibility: {
                caliber: true,
            },
            density: "xs",
            columnFilters: [{
                id: "hitZones",
                value: initialHitZones,
            }],

            pagination: {
                pageIndex: 0, pageSize: 15
            }
            ,
            columnPinning: {
                // left: ['name']
                // left: ['mrt-row-expand']
            },
            sorting: [{ id: 'penetrationPower', desc: true }, { id: 'damage', desc: true }],
        },

        mantineTableBodyRowProps: (row) => (
            {
                onClick: event => {
                    event.preventDefault();
                    handleRowSelect(row.row.original);
                }
            }
        ),
        mantineTableContainerProps: {
            sx: {
                height: tableHeight
            }
        },
        renderToolbarInternalActions: ({ table }) => (
            <Group position="center">
                <CloseButton onClick={CloseDrawerCb} title="Close" size="lg" iconSize={20} />
            </Group>
        ),

    })
    return (<MantineReactTable table={table} />);
}