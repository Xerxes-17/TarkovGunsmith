import {MRT_TableOptions, MRT_TablePagination, MRT_ToggleFullScreenButton, useMantineReactTable} from 'mantine-react-table';
import { RowSelection } from '../../MWB/types';
import { FocusTrap} from '@mantine/core';

export const useBaseSearchSelectTable = <T extends {}>(tableOptions: MRT_TableOptions<T>) => {
    const {initialState, state, ...options } = tableOptions;

    const table = useMantineReactTable<T>({
        positionGlobalFilter: "left",
        enableStickyHeader: true,
        enableGlobalFilter: true,
        enableColumnFilterModes: true,

        layoutMode: "semantic",

        enableColumnOrdering: true,
        enableColumnFilters: true,

        enableToolbarInternalActions: true,
        enableHiding: false,
        enableSorting: true,
        enableMultiSort: true,

        enableColumnActions: false,
        enableColumnDragging: false,
        enableFacetedValues: true,
        enableGrouping: true,
        enablePinning: true,

        enableDensityToggle: false,
        positionToolbarAlertBanner: "bottom",

        enableRowSelection: false,
        columnFilterDisplayMode: "subheader",
        positionPagination: "bottom",
        mantinePaginationProps: {
            showRowsPerPage: false,
            // rowsPerPageOptions: ["10", "12", "15", "17", "20"],
        },
        globalFilterFn: 'includesString',

        defaultColumn:{
            // minSize: 20, //allow columns to get smaller than default
            // maxSize: 75, //allow columns to get larger than default
            size: 60, //make columns wider by default
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
        // mantineSearchTextInputProps:{
        //     "data-autofocus" : true, //seems we can't have this for now
        // },

        mantineTableHeadCellProps: {
            style: {
                verticalAlign: "bottom"
            },
            sx: {
                '& .mantine-Paper-root': {
                    verticalAlign: "bottom",
                },
                // // ! Did these two to get the actions group ahead of the label
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

        renderToolbarInternalActions: ({ table }) => (
            <>
                {/* <MRT_TablePagination table={table} /> */}
                {/* <MRT_ToggleFullScreenButton table={table} /> */}
            </>
        ),

        initialState: {
            ...initialState
        },
        state: {
            showGlobalFilter: true,
            ...state
        },

        ...options
    });

    return table;
}