import { useTgTable } from "../use-tg-table"
import { MRT_ColumnDef, MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton, MantineReactTable } from "mantine-react-table"
import { useMemo, useState } from "react";
import { Box, Flex, Group, Input, NumberInput, Text } from "@mantine/core";
import { BallisticCalculatorTableRow } from "../../../../Pages/BallisticCalculator/types";
import { useMediaQuery } from "@mui/material";

export function BallisticCalculatorResultTable({ result: tableData }: { result: BallisticCalculatorTableRow[] }) {

    const [valueAdjustment, setValueAdjustment] = useState<number | ''>(1.00);

    const columns = useMemo<MRT_ColumnDef<BallisticCalculatorTableRow>[]>(
        () => [
            {
                id: "Distance",
                accessorKey: "Distance",
                header: 'Distance',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{cell.getValue<number>()} m</div>;
                }
            },
            {
                id: "Penetration",
                accessorKey: "Penetration",
                header: 'Penetration',
                size: 38,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: "Damage",
                accessorKey: "Damage",
                header: 'Damage',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: "Speed",
                accessorKey: "Speed",
                header: 'Speed',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} m/s</div>;
                }
            },
            {
                id: "Mils",
                accessorKey: "MilliradiansOfDrop",
                header: 'Mils',
                size: 25,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(2)}</div>;
                }
            },
            {
                id: "adjustedMils",
                accessorKey: "MilliradiansOfDrop",
                header: 'Adjusted Mils',
                size: 30,
                Cell: ({ cell }) => {
                    const multiplier = Number(valueAdjustment) || 1
                    return <div>{(cell.getValue<number>() * multiplier).toFixed(2)}</div>;
                }
            },
            {
                id: "Drop",
                accessorKey: "Drop",
                header: 'Drop',
                size: 45,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>() * 100).toFixed(3)} cm</div>;
                }
            },
            {
                id: "TimeOfFlight",
                accessorKey: "TimeOfFlight",
                header: 'Time Of Flight',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(2)} s</div>;
                }
            },
        ],
        [valueAdjustment],
    );

    const mobileView = useMediaQuery('(max-width: 766px)');

    const table = useTgTable({
        columns,
        data: tableData,

        layoutMode: "semantic",

        enableColumnFilters: false,
        enableColumnActions: false,
        enableSorting: false,
        enableBottomToolbar: false,
        enableTopToolbar: false,
        initialState: {
            density: "xs",
            pagination: {
                pageIndex: 0, pageSize: 250
            }
            ,
            columnPinning: {
                left: ['Distance']
            },
        },

        state: {
            // grouping: manualGrouping,
            // showGlobalFilter: true,
            // columnVisibility: visibility,
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

    return (
        <>
            <Group spacing="sm" noWrap pb={4}>
                <Box w={140}>
                    <NumberInput
                        value={valueAdjustment} onChange={setValueAdjustment}
                        inputWrapperOrder={['label', 'description', 'input', 'error']}
                        label="Scope Mils Multiplier"
                        precision={2}
                        max={2}
                        min={.01}
                        step={.01}
                    />
                </Box>
                <Input.Description pl={5}>In-game scope mils are not to scale. Set the multiplier for the adjusted mils column here.<br />From .01 to 2.00, step is .01.</Input.Description>
            </Group>

            <MantineReactTable table={table} />
        </>
    )
}