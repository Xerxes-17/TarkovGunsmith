import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import {
    Button,
    Image,
    Text,
    Grid,
} from '@mantine/core';
import { Box } from "@mui/material";
import { MwbContext } from "../../Context/ContextMWB";
import { useCallback, useContext, useMemo } from 'react';
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { PurchasedModsEntry } from './types';
import { currencyStringToSymbol } from '../Common/helpers';

export default function AttachedModsList() {
    const {
        result,
        pagination,
        picturesYesNo,
        rowSelectionAttached,
        setRowSelectionAttached,
        handleAddToExcludedMods,
    } = useContext(MwbContext);

    const costToolTipElement = useCallback((rowOriginal: any) => {
        var included = false;
        if (result?.BasePreset?.WeaponMods.some((x) => x.Id === rowOriginal.WeaponMod.Id)) {
            included = true;
        }

        const temp = rowOriginal.PurchaseOffer?.PriceRUB ?? "n/a";
        let resultStr = `${temp}`;

        if (temp !== "n/a") {
            resultStr = `₽ ${temp.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}`
        }

        let tooltipContent = <>n/a - Probably only comes with a weapon</>;
        if (included) {
            tooltipContent = <>n/a - Comes with preset</>;
        }


        if (rowOriginal.PurchaseOffer !== null) {
            if (rowOriginal.PurchaseOffer.OfferType !== 3) {
                const currency = currencyStringToSymbol(rowOriginal.PurchaseOffer.Currency);

                tooltipContent = (
                    <>
                        {rowOriginal.PurchaseOffer.Vendor} level {rowOriginal.PurchaseOffer.MinVendorLevel}
                        <br />
                        {currency} {rowOriginal.PurchaseOffer.Price.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                        <br />
                        {included === true && (
                            <>
                                Comes with preset
                            </>
                        )}
                    </>
                )
            }
            else {
                tooltipContent = (
                    <>
                        {rowOriginal.PurchaseOffer.Vendor} level {rowOriginal.PurchaseOffer.MinVendorLevel}
                        <br />
                        Barter of equivalent to: ₽{rowOriginal.PurchaseOffer.PriceRUB.toLocaleString("en-US", { maximumFractionDigits: 0, minimumFractionDigits: 0 })}
                        <br />
                        {included === true && (
                            <>
                                Comes with preset
                            </>
                        )}
                    </>
                )
            }

        }


        const renderTooltip = (props: any) => (
            <Tooltip id="button-tooltip" {...props}>
                {tooltipContent}
            </Tooltip>
        );

        return (
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 400 }}
                overlay={renderTooltip}
            >
                <span>
                    {included === false && typeof (temp) === "string" && (
                        <>
                            {resultStr}
                        </>
                    )}
                    {included === true && typeof (temp) === "string" && (
                        <Text>{resultStr}</Text>
                    )}

                    {included === false && typeof (temp) === "number" && (
                        <Text>{resultStr}</Text>
                    )}
                    {included === true && typeof (temp) === "number" && (
                        <Text td="line-through">{resultStr}</Text>
                    )}

                </span>
            </OverlayTrigger>
        )
    }, [result?.BasePreset?.WeaponMods])

    const columns = useMemo<MRT_ColumnDef<PurchasedModsEntry>[]>(
        () => [
            {
                id: 'name',
                accessorFn: (row) => row.WeaponMod.Name,
                header: 'Name',
                size: 300,
                muiTableHeadCellProps: {
                    align: 'left',
                },
                muiTableBodyCellProps: {
                    align: 'left',
                },
                Cell: ({ renderedCellValue, row }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        {picturesYesNo === true &&
                            <Image
                                src={`https://assets.tarkov.dev/${row.original.WeaponMod.Id}-grid-image.jpg`}
                                alt="avatar"
                                height={50}
                                maw={200}
                                fit="scale-down"
                            />
                        }
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span>{renderedCellValue}</span>
                    </Box>
                ),
            },
            {
                id: 'ergonomics',
                accessorFn: (row) => row.WeaponMod.Ergonomics,
                header: 'Ergonomics',
                size: 50,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                id: 'recoil',
                accessorFn: (row) => row.WeaponMod.Recoil,
                header: 'Recoil',
                size: 50,
                muiTableHeadCellProps: {
                    align: 'center',
                },
                muiTableBodyCellProps: {
                    align: 'center',
                },
            },
            {
                id: 'cost',
                accessorFn: (row) => row.PurchaseOffer?.PriceRUB ?? 'Default Value',
                header: 'Cost',
                size: 50,
                muiTableHeadCellProps: {
                    align: 'right',
                },
                muiTableBodyCellProps: {
                    align: 'right',
                },
                Cell: ({ row }) => {
                    return (
                        <>
                            {costToolTipElement(row.original)}
                        </>
                    )
                },
            },
        ],
        [picturesYesNo, costToolTipElement],
    );

    if (result !== undefined) {
        return (
            <>
                <MaterialReactTable
                    getRowId={(originalRow) => originalRow.WeaponMod.Id}
                    columns={columns}
                    data={result.PurchasedMods.List}
                    renderTopToolbarCustomActions={() => (
                        <>
                            <h3 style={{ paddingTop: 6, marginBottom: 0 }}>Attached Mods</h3>
                            <div className="ms-auto" style={{ paddingTop: 4 }}>
                                <Button variant="light" onClick={
                                    () => {
                                        handleAddToExcludedMods();
                                    }}>Add to exclusions & Rebuild</Button>
                            </div>
                        </>
                    )}
                    positionToolbarAlertBanner="none"
                    enableToolbarInternalActions={false}
                    enableColumnActions={false}


                    enableSelectAll={false}
                    enableGlobalFilter={false}
                    enableFilters={false}
                    enableFullScreenToggle={false}
                    enableDensityToggle={false}
                    enableTableHead
                    enableBottomToolbar={false}
                    positionExpandColumn={"first"}
                    enableStickyHeader
                    muiTableContainerProps={{ sx: { maxHeight: '60vh' } }}
                    enableRowSelection
                    onRowSelectionChange={setRowSelectionAttached}
                    state={{ rowSelection: rowSelectionAttached }}

                    initialState={{
                        density: "compact",
                        pagination: pagination,
                        columnOrder: [
                            'mrt-row-expand',
                            'name',
                            'ergonomics',
                            'recoil',
                            'cost',
                            'mrt-row-select', //move the built-in selection column to the end of the table
                        ],
                    }}
                    displayColumnDefOptions={{
                        'mrt-row-select': {
                            header: 'Exclude?',
                            muiTableHeadCellProps: {
                                align: 'center',
                            },
                            muiTableBodyCellProps: {
                                align: 'center',
                            },
                        }
                    }}
                    renderDetailPanel={({ row }) => (
                        <Grid>
                            <Grid.Col span={2}>
                                <Image
                                    src={`https://assets.tarkov.dev/${row.original.WeaponMod.Id}-grid-image.webp`}
                                    alt="avatar"
                                    height={50}
                                    maw={200}
                                    fit="scale-down" />
                            </Grid.Col>
                            <Grid.Col span={10}>
                                {row.original.WeaponMod.Description}
                            </Grid.Col>
                        </Grid>
                    )} />

            </>
        )
    }
    else {
        return <></>
    }

}