
import {MRT_TableOptions, useMantineReactTable} from 'mantine-react-table';

export const useTgTable = <T extends {}>(tableOptions: MRT_TableOptions<T>) => {
    const {initialState, state, ...options } = tableOptions;

    const table = useMantineReactTable<T>({
        positionGlobalFilter: "none",
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
        positionToolbarAlertBanner: "none",

        enableRowSelection: false,
        columnFilterDisplayMode: "subheader",
        positionPagination: "bottom",
        mantinePaginationProps: {
            rowsPerPageOptions: ["10", "25", "50", "75", "100", "150", "200"],
        },

        defaultColumn:{
            minSize: 20, //allow columns to get smaller than default
            maxSize: 75, //allow columns to get larger than default
            size: 20, //make columns wider by default
        },

        initialState: {
            ...initialState
        },
        state: {
            ...state
        },

        ...options
    });

    return table;
}