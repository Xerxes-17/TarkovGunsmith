
import { MRT_TableOptions, useMantineReactTable} from 'mantine-react-table';

export const tgNumColOptions = {
    columnFilterModeOptions: ['between', 'lessThan', 'greaterThan', 'lessThanOrEqualTo', 'greaterThanOrEqualTo', 'equals'],
    filterFn: "greaterThanOrEqualTo",
}

export const tgNameColOptions = {
    filterVariant: "text" as "text", 
    filterFn:"contains",
    columnFilterModeOptions: [],
}

export const tgMultiSelectColOptions = {
    filterVariant: "multi-select" as "multi-select",
    filterFn:"arrIncludesSome",
    columnFilterModeOptions: [],
}

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
        columnFilterDisplayMode:"popover",

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
        mantineTableContainerProps: { 
            // sx: 
            // { maxHeight: '500px' },
            className: "tgMainTableInAppShell"
        },

        ...options
    });

    return table;
}


