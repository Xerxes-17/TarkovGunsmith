import { useTgTable } from "../use-tg-table"
import { MRT_ColumnDef, MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton, MantineReactTable } from "mantine-react-table"
import { useMemo } from "react";
import { Flex } from "@mantine/core";
import { BallisticSimDataPoint } from "../../../../Pages/BallisticCalculator/types";
import { useMediaQuery } from "@mui/material";

export function BallisticCalculatorResultTable({ result: tableData }: {result: BallisticSimDataPoint[]}) {
    const columns = useMemo<MRT_ColumnDef<BallisticSimDataPoint>[]>(
        () => [
            {
                id: "Distance",
                accessorKey: "Distance",
                header: 'Distance',
                Cell: ({ cell }) => {
                    return <div>{cell.getValue<number>()} m</div>;
                }
            },
            {
                id: "Penetration",
                accessorKey: "Penetration",
                header: 'Penetration',
                size:25,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: "Damage",
                accessorKey: "Damage",
                header: 'Damage',
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: "Speed",
                accessorKey: "Speed",
                header: 'Speed',
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} m/s</div>;
                }
            },
            {
                id: "Drop",
                accessorKey: "Drop",
                header: 'Drop',
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>() * 100).toFixed(3)} cm</div>;
                }
            },
            {
                id: "TimeOfFlight",
                accessorKey: "TimeOfFlight",
                header: 'Time Of Flight',
                size:25,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(2)} s</div>;
                }
            },
        ],
        [],
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
                pageIndex: 0, pageSize: 200
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
        mantinePaperProps:{
            style:{
                height: mobileView ? 300 : undefined
            }
            
        },
        mantineTableContainerProps: { 
            style:{
                height: mobileView ? 300 : undefined
            }
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
            <MantineReactTable table={table} />
        </>
    )
}