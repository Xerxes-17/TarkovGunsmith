import { useMediaQuery } from "@mantine/hooks";
import { useTgTable } from "../../Components/Common/Tables/use-tg-table";
import { DisplayRowAEC } from "./types";
import { Flex } from "@mantine/core";
import { MantineReactTable, MRT_ColumnDef, MRT_GlobalFilterTextInput, MRT_ToggleFullScreenButton } from "mantine-react-table";
import { useMemo } from "react";

export function AmmoEffectivenessTable({tableData: data}:{tableData: DisplayRowAEC[]}) {

    const columns = useMemo<MRT_ColumnDef<DisplayRowAEC>[]>(
        () => [
            {
                id: "ammoId",
                accessorKey: "ammoId",
                header: 'Ammo Id',
                size: 30,
            },
            {
                id: "ammoName",
                accessorKey: "ammoName",
                header: 'Ammo Name',
                size: 30,
            },
            {
                id: "AC 3",
                accessorKey: "avgHtkAc3",
                header: 'AC 3',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: "AC 4",
                accessorKey: "avgHtkAc4",
                header: 'AC 4',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: "AC 5",
                accessorKey: "avgHtkAc5",
                header: 'AC 5',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
            {
                id: "AC 6",
                accessorKey: "avgHtkAc6",
                header: 'AC 6',
                size: 30,
                Cell: ({ cell }) => {
                    return <div>{(cell.getValue<number>()).toFixed(1)} </div>;
                }
            },
        ]
        ,[]
    );

    const mobileView = useMediaQuery('(max-width: 766px)');

    const table = useTgTable({
        columns,
        data: data,

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
            <MantineReactTable table={table} />
        </>
    )
}