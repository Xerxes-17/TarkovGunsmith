/* eslint-disable react/jsx-pascal-case */
import { useMemo } from "react";
import {
    MantineReactTable,
    type MRT_ColumnDef,
    MRT_GlobalFilterTextInput,
    MRT_ToggleFullScreenButton,
} from "mantine-react-table";
import { Avatar, Badge, Flex, Group, SegmentedControl, Text } from "@mantine/core";

import {
    tgMultiSelectColOptions,
    tgNameColOptions,
    tgNumColOptions,
    useTgTable,
} from "../../../Components/Common/Tables/use-tg-table";
import { TtkRow, formatTtk } from "./ttk-types";

export interface TtkResultsTableProps {
    rows: TtkRow[];
    bestAmmoPerWeaponOnly: boolean;
    onToggleBestAmmoPerWeapon: (value: boolean) => void;
    confidence: number;
}

export function TtkResultsTable({
    rows,
    bestAmmoPerWeaponOnly,
    onToggleBestAmmoPerWeapon,
    confidence,
}: TtkResultsTableProps) {
    const columns = useMemo<MRT_ColumnDef<TtkRow>[]>(
        () => [
            {
                id: "weaponName",
                accessorKey: "weaponShortName",
                header: "Weapon",
                size: 160,
                Cell: ({ renderedCellValue, row }) => (
                    <Group align="center" spacing="xs" noWrap>
                        <Avatar
                            alt="weapon"
                            size={"sm"}
                            src={`https://assets.tarkov.dev/${row.original.weaponId}-icon.webp`}
                        >
                            TG
                        </Avatar>
                        <span>{renderedCellValue}</span>
                    </Group>
                ),
                ...tgNameColOptions,
            },
            {
                id: "ammoName",
                accessorKey: "ammoShortName",
                header: "Ammo",
                size: 140,
                Cell: ({ renderedCellValue, row }) => (
                    <Group align="center" spacing="xs" noWrap>
                        <Avatar
                            alt="ammo"
                            size={"sm"}
                            src={`https://assets.tarkov.dev/${row.original.ammoId}-icon.webp`}
                        >
                            TG
                        </Avatar>
                        <span>{renderedCellValue}</span>
                    </Group>
                ),
                ...tgNameColOptions,
            },
            {
                id: "caliberLabel",
                accessorKey: "caliberLabel",
                header: "Caliber",
                size: 100,
                ...tgMultiSelectColOptions,
            },
            {
                id: "ttkSeconds",
                accessorKey: "ttkSeconds",
                header: "TTK",
                size: 100,
                Cell: ({ cell }) => {
                    const value = cell.getValue<number>();
                    return (
                        <Text fw={700} color={Number.isFinite(value) ? undefined : "dimmed"}>
                            {formatTtk(value)}
                        </Text>
                    );
                },
                ...tgNumColOptions,
                filterFn: "lessThanOrEqualTo",
            },
            {
                id: "htk",
                accessorKey: "htk",
                header: `Hits to Kill @ ${confidence}%`,
                size: 110,
                Cell: ({ cell }) => {
                    const value = cell.getValue<number | null>();
                    return <div>{value === null ? "Not reached" : value}</div>;
                },
                ...tgNumColOptions,
                filterFn: "lessThanOrEqualTo",
            },
            {
                id: "triggerPulls",
                accessorKey: "triggerPulls",
                header: "Trigger Pulls",
                size: 100,
                Cell: ({ cell, row }) => {
                    const value = cell.getValue<number | null>();
                    if (value === null) {
                        return <div>Not reached</div>;
                    }
                    return (
                        <div>
                            {value}
                            {row.original.projectileCount > 1 && (
                                <Text span color="dimmed" size="xs">
                                    {" "}
                                    ({row.original.projectileCount} pellets)
                                </Text>
                            )}
                        </div>
                    );
                },
                ...tgNumColOptions,
                filterFn: "lessThanOrEqualTo",
            },
            {
                id: "fireMode",
                accessorKey: "fireMode",
                header: "Fire Mode",
                size: 100,
                Cell: ({ cell }) => {
                    const value = cell.getValue<string>();
                    return (
                        <Badge variant="outline" color={value === "Semi auto" ? "gray" : "blue"}>
                            {value}
                        </Badge>
                    );
                },
                ...tgMultiSelectColOptions,
            },
            {
                id: "effectiveRpm",
                accessorKey: "effectiveRpm",
                header: "Effective RPM",
                size: 100,
                ...tgNumColOptions,
            },
            {
                id: "firstShotPenChance",
                accessorKey: "firstShotPenChance",
                header: "First Shot Pen Chance",
                size: 110,
                Cell: ({ cell }) => <div>{(cell.getValue<number>() * 100).toFixed(1)} %</div>,
                ...tgNumColOptions,
            },
            {
                id: "damage",
                accessorKey: "damage",
                header: "Damage",
                size: 90,
                Cell: ({ cell }) => <div>{cell.getValue<number>().toFixed(1)}</div>,
                ...tgNumColOptions,
            },
            {
                id: "penetration",
                accessorKey: "penetration",
                header: "Penetration",
                size: 90,
                Cell: ({ cell }) => <div>{cell.getValue<number>().toFixed(1)}</div>,
                ...tgNumColOptions,
            },
            {
                id: "armorDamagePerc",
                accessorKey: "armorDamagePerc",
                header: "Armor Damage %",
                size: 90,
                Cell: ({ cell }) => <div>{cell.getValue<number>()} %</div>,
                ...tgNumColOptions,
            },
        ],
        [confidence]
    );

    const table = useTgTable({
        columns,
        data: rows,

        enableGrouping: false,

        initialState: {
            density: "xs",
            sorting: [{ id: "ttkSeconds", desc: false }],
            pagination: {
                pageIndex: 0,
                pageSize: 25,
            },
        },
        renderTopToolbarCustomActions: ({ table }) => (
            <Flex gap="md" justify="flex-start" align="center" direction="row" wrap="wrap">
                <MRT_GlobalFilterTextInput table={table} />
                <SegmentedControl
                    value={bestAmmoPerWeaponOnly ? "best" : "all"}
                    onChange={(value) => onToggleBestAmmoPerWeapon(value === "best")}
                    data={[
                        { label: "Every ammo", value: "all" },
                        { label: "Best ammo per gun", value: "best" },
                    ]}
                />
            </Flex>
        ),
        renderToolbarInternalActions: ({ table }) => (
            <>
                <MRT_ToggleFullScreenButton table={table} />
            </>
        ),
    });

    return <MantineReactTable table={table} />;
}
