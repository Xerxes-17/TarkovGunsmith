import { useEffect, useMemo, useState } from "react";
import { AmmoTableRow, filterNonBulletsOut, mapAmmoCaliberFullNameToLabel } from "../../../../Types/AmmoTypes";
import { getAmmoDataFromApi_TarkovDev } from "../../../../Api/AmmoApiCalls";
import { MRT_ColumnDef, MantineReactTable } from "mantine-react-table";
import { Avatar, Group, Tooltip, Text, CloseButton } from '@mantine/core';
import { useViewportSize } from "@mantine/hooks";
import { useBaseSearchSelectTable } from "../BaseSearchSelectTable";
import { useBallisticCalculatorFormContext } from "../../../../Pages/BallisticCalculator/ballistic-calculator-form-context";

interface SearchSelectAmmoTableProps {
    CloseDrawerCb: () => void
}


export function SearchSelectAmmoTable_Calc({ CloseDrawerCb }: SearchSelectAmmoTableProps) {
    const form = useBallisticCalculatorFormContext();

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

    const initialData: AmmoTableRow[] = [];
    const [tableData, setTableData] = useState<AmmoTableRow[]>(initialData);

    async function getTableData() {
        // const response_WishGranterApi = await getDataFromApi_WishGranter();
        // if(response_WishGranterApi !== null){
        //     setAmmoTableData(response_WishGranterApi);
        //     return;
        // }

        const response_ApiTarkovDev = await getAmmoDataFromApi_TarkovDev()
        if (response_ApiTarkovDev !== null) {
            setTableData(filterNonBulletsOut(response_ApiTarkovDev));
            return;
        }

        console.error("Error: Both WishGranter and ApiTarkovDev failed to respond (correctly).")
    }

    useEffect(() => {
        getTableData();
    }, [])

    function handleRowSelect(rowOriginal: AmmoTableRow) {
        console.log("ey dude ya not using this for now")
        CloseDrawerCb();
    }

    const columns = useMemo<MRT_ColumnDef<AmmoTableRow>[]>(
        () => [
            {
                id: 'name',
                accessorKey: 'shortName',
                header: 'Name',
                size: 140,
                minSize: 140,
                maxSize: 140,
                filterFn: "contains",
                columnFilterModeOptions: [],
                Header: ({ column, header }) => (
                    <div style={{ width: "100%" }}>Name</div>),
                AggregatedCell: ({ row }) => row.renderValue("caliber"),
                Cell: ({ renderedCellValue, row }) => (
                    <Group align="center">
                        <Avatar
                            alt="avatar"
                            size={'sm'}
                            src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
                        // hidden={!pix && manualGrouping.some(x=>x === 'caliber')}
                        >
                            TG
                        </Avatar>
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue} </span>
                    </Group>
                    // <span>{renderedCellValue}</span>
                ),
            },
            {
                id: "caliber",
                accessorFn: (row) => `${mapAmmoCaliberFullNameToLabel(row.caliber)}`,
                // size: 70,
                accessorKey: 'caliber',
                header: 'Caliber',
                filterVariant: "multi-select",
                filterFn: "arrIncludesSome",
                columnFilterModeOptions: [],
                Cell: ({ renderedCellValue }) => (
                    <span>{renderedCellValue}</span>
                ),
            },
            {
                accessorKey: 'damage',
                header: 'Damage',
                // size: 80,
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) =>
                    <div>
                        Mean: <strong>{cell.getValue<number>().toFixed(0)}</strong>
                    </div>,
                filterFn: "greaterThanOrEqualTo",
                columnFilterModeOptions: ['between', 'lessThan', 'greaterThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'],
                Cell: ({ cell, row }) => {
                    if (row.original.projectileCount > 1) {
                        return (
                            <>
                                <Tooltip
                                    label={`${row.original.projectileCount * cell.getValue<number>()}`}
                                >
                                    <Text>{row.original.projectileCount} x {cell.getValue<number>().toFixed(0)}</Text>
                                </Tooltip>

                            </>
                        )
                    }
                    return <>{cell.getValue<number>().toFixed(0)}</>

                }
            },
            {
                accessorKey: 'penetrationPower',
                header: 'Penetration',
                aggregationFn: ['max', 'mean',],
                // size: 80,
                filterFn: "greaterThanOrEqualTo",
                columnFilterModeOptions: ['between', 'lessThan', 'greaterThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'],
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            Mean: <strong>{
                                cell
                                    .getValue<Array<number>>()?.[1]
                                    .toFixed(0)
                            }
                            </strong>
                        </div>
                    )
                },
            },
            {
                accessorKey: 'armorDamagePerc',
                header: 'Armor Damage%',
                // size: 80,
                filterFn: "greaterThanOrEqualTo",
                columnFilterModeOptions: ['between', 'lessThan', 'greaterThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo'],
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()} %</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell }) => {
                    return (
                        <div>
                            Mean: <strong>{cell.getValue<number>().toFixed(0)}%</strong>
                        </div>
                    )
                },
            },
        ],
        [],
    );

    const table = useBaseSearchSelectTable({
        columns,
        data: tableData,

        initialState: {
            expanded: true,
            columnVisibility: {
                caliber: true,
            },
            density: "xs",

            pagination: {
                pageIndex: 0, pageSize: 15
            }
            ,
            columnPinning: {
                left: ['name']
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
                height: tableHeight,
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