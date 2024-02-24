import { MRT_TableOptions, useMantineReactTable } from 'mantine-react-table';

export const useBaseSearchSelectTable = <T extends {}>(tableOptions: MRT_TableOptions<T>) => {
    const { initialState, state, ...options } = tableOptions;

    const table = useMantineReactTable<T>({
        enableGlobalFilter: true,
        positionGlobalFilter: "left",

        enableStickyHeader: true,

        enableToolbarInternalActions: true,
        enableHiding: false,
        enableSorting: true,
        enableMultiSort: true,
        
        layoutMode: "semantic",

        enableColumnOrdering: true,
        enableColumnFilters: true,

        enableColumnFilterModes: true,
        enableColumnActions: false,
        enableColumnDragging: false,
        enableFacetedValues: true,
        enableGrouping: true,
        enablePinning: true,

        enableDensityToggle: false,
        positionToolbarAlertBanner: "bottom",

        enableRowSelection: false,
        columnFilterDisplayMode: "popover",
        positionPagination: "bottom",
        mantinePaginationProps: {
            showRowsPerPage: false,
            // rowsPerPageOptions: ["10", "12", "15", "17", "20"],
        },
        globalFilterFn: 'includesString',

        defaultColumn: {
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
                verticalAlign: "bottom",
                zIndex: "auto"
            },
            sx: {
                '& .mantine-Paper-root': {
                    verticalAlign: "bottom",
                },
                position: "relative",
                zIndex: 3500,
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
        initialState: {
            ...initialState
        },
        state: {
            showGlobalFilter: true,
            ...state
        },
        mantineTableBodyCellProps:{
            sx:{
                cursor:"pointer"
            }
        },

        ...options
    });

    return table;
}