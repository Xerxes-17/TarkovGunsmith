import { useEffect, useMemo, useState } from "react"
import { requestAmmoEffectivenessChart, requestAmmoEffectivenessTimestamp } from "../../Context/Requests"
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { Button, Form, Stack, ToggleButton, ToggleButtonGroup } from "react-bootstrap";
import { TraderToolTipElement, damageConditionalColour, dealWithMultiShotAmmo, deltaToolTip, deltaToolTipElement, fragmentationConditionalColour, fragmentationCutoff, getEffectivenessColorCode, getTraderConditionalCell, greenRedOrNothing, negativeGreen_PositiveRed_OrNothing, penetrationConditionalColour, RenameCaliber, trimCaliber, positiveGreenOrNothing_Percent, ArmorDamageToolTipElement } from "./AEC_Helper_Funcs";
import { AEC, AEC_Row, TargetZoneDisplayAEC } from "./AEC_Interfaces";
import AECTableIntroSection from "./AEC_TableIntroSection";
import { Link } from "react-router-dom";
import { LINKS } from "../../Util/links";
import { Margin } from "@mui/icons-material";
import html2canvas from "html2canvas";
import { copyImageToClipboard } from "copy-image-clipboard";
import { AEC_LS_KEY } from "../../Util/util";

export default function AmmoEffectivenessChartPage(props: any) {
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 200, //customize the default page size
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    const handleImageDownload = async () => {
        const element: any = document.getElementById('print'),
            canvas = await html2canvas(element),
            data = canvas.toDataURL('image/png'),
            link = document.createElement('a');

        link.href = data;
        link.download = `TarkovGunsmith_AEC_Chart_${Date.now()}.png`

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleCopyImage = async () => {
        try {
            const element: any = document.getElementById('print'),
                canvas = await html2canvas(element),
                data = canvas.toDataURL('image/png');

            if (data) await copyImageToClipboard(data)
        } catch (e: any) {
            if (e?.message) alert(e.message)
        }
    }

    const [targetZone, setTargetZone] = useState<TargetZoneDisplayAEC>(TargetZoneDisplayAEC.Classic);
    const TargetZones: TargetZoneDisplayAEC[] = [TargetZoneDisplayAEC.Classic, TargetZoneDisplayAEC.Thorax, TargetZoneDisplayAEC.Head, TargetZoneDisplayAEC.Legs];
    const handleTargetZoneChange = (val: any) => {
        // console.log("val: ", val)
        setTargetZone(val);

        var temp = TargetZones.findIndex((element) => element === val)
        // console.log("temp: ", temp)
    }

    const [picturesYesNo, setPicturesYesNo] = useState(false);

    const [distance, setDistance] = useState(10);
    const distances: number[] = [1, 10, 25, 50, 75, 100, 110, 125, 150, 200, 250, 300, 350, 400, 450, 500, 600];
    const [distanceIndex, setDistanceIndex] = useState(1);
    const handleDistanceChange = (val: any) => {
        // console.log("val: ", val)
        setDistance(val);

        var temp = distances.findIndex((element) => element === val)
        // console.log("temp: ", temp)
        setDistanceIndex(temp)
    }

    const [AECData, setAECData] = useState<AEC>();
    useEffect(() => {
        // console.log(AEC_LS_KEY)
        const data = JSON.parse(localStorage.getItem(AEC_LS_KEY)!);
        if (data) {
          // Check if outdated
          var remoteVersionNum = 0;
          requestAmmoEffectivenessTimestamp()
            .then(response => {
              remoteVersionNum = response;
              if(remoteVersionNum > data.GenerationTimeStamp){
                requestAmmoEffectivenessChart()
                  .then(response => {
                    localStorage.setItem(AEC_LS_KEY, JSON.stringify(response));
                    setAECData(response);
                  })
                  .catch(error => {
                    console.error(error);
                  });
              }
              else{
                setAECData(data);
              }
            })
            .catch(error => {
              console.error(error);
            });
        }
        else {
          requestAmmoEffectivenessChart()
            .then(response => {
              localStorage.setItem(AEC_LS_KEY, JSON.stringify(response));
              setAECData(response);
            })
            .catch(error => {
              console.error(error);
            });
        }
      }, []);

    const [filteredAECData, setFilteredAECData] = useState<AEC_Row[]>([]);
    useEffect(() => {
        const filtered = AECData?.Rows.filter((row: AEC_Row) =>
            row.Details.some(details => details.Distance === distance)
        )
        setFilteredAECData(filtered!);
    }, [AECData, distance])

    interface CustomCellProps {
        value: any;
        row: any;
    }
    const NameCell = ({ value, row }: CustomCellProps) => {
        return (
            <>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                    }}
                >
                    {picturesYesNo === true &&
                        <img
                            alt="avatar"
                            height={40}
                            src={`https://assets.tarkov.dev/${row.original.Ammo.Id}-icon.jpg`}
                            loading="lazy"
                        />
                    }

                    {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                    <span><Link to={`${LINKS.AMMO_VS_ARMOR}/${row.original.Ammo.Id}`}>{value}</Link></span>
                </Box>
            </>
        );
    };

    const CaliberCell = ({ value, row }: CustomCellProps) => {
        return (
            <>
                {trimCaliber(value)}
            </>
        );
    };
    const PenetrationCell = ({ value, row }: CustomCellProps) => {
        return (
            <>
                {deltaToolTipElement(value, row.original.Ammo.PenetrationPower, penetrationConditionalColour(value))}
            </>
        );
    };
    const ArmorDamageCell = ({ value, row }: CustomCellProps) => {
        return (
            <>
                {ArmorDamageToolTipElement(value, row.original.Ammo.ArmorDamage)}
            </>
        );
    };

    const DamageCell = ({ value, row }: CustomCellProps) => {
        return (
            <>
                {deltaToolTipElement(value, row.original.Ammo.Damage, damageConditionalColour(value))}
                {(row.original.Ammo.ProjectileCount > 1 && (
                    <>
                        &nbsp;x{row.original.Ammo.ProjectileCount}
                    </>
                ))}
            </>
        );
    };
    const SpeedCell = ({ value, row }: CustomCellProps) => {
        return (
            <>
                {deltaToolTip(value, row.original.Ammo.InitialSpeed, "m/s")}
            </>
        );
    };
    const FragCell = ({ value, row }: CustomCellProps) => {
        return (
            <>
                {fragmentationConditionalColour(fragmentationCutoff(value, row.original.Ammo.PenetrationPower))}
            </>
        );
    };
    const GreenRedOrNothingCell = ({ value, row }: CustomCellProps) => {
        return (
            <span style={{ display: "inline-block" }}>
                {greenRedOrNothing(value)}
            </span>
        );
    };
    const positiveGreenOrNothing_PercentCell = ({ value, row }: CustomCellProps) => {
        return (
            <span style={{ display: "inline-block" }}>
                {positiveGreenOrNothing_Percent(value)}
            </span>
        );
    };

    const negativeGreen_PositiveRed_OrNothingCell = ({ value, row }: CustomCellProps) => {
        return (
            <span style={{ display: "inline-block" }}>
                {negativeGreen_PositiveRed_OrNothing(value)}
            </span>
        );
    };
    const AC_Rating_Cell = ({ value, row }: CustomCellProps) => {
        return (
            <Box
                component="span"
                sx={() => ({
                    backgroundColor: getEffectivenessColorCode(targetZone, value, row.original.Ammo.ProjectileCount),
                    borderRadius: '0.25rem',
                    color: '#fff',
                    maxWidth: '9ch',
                    p: '0.25rem',
                })}
            >
                <>
                    {dealWithMultiShotAmmo(targetZone, value!, row.original, distanceIndex)}
                </>

            </Box>
        );
    };
    const Trader_Cell = ({ value, row }: CustomCellProps) => {
        return (
            <>
                {(TraderToolTipElement(value))}
            </>
        );
    };

    type Alignment = "left" | "center" | "right" | "justify" | "inherit" | undefined;

    function CustomCell_Column(
        accessorKey: string,
        header: string,
        id: string,
        align: Alignment,
        CustomCellComponent: React.ComponentType<{ value: any, row: any }>,

    ): MRT_ColumnDef<AEC_Row> {
        return {
            accessorKey: accessorKey as keyof AEC_Row,
            header,
            id,
            size: 8,
            enableSorting: true,
            filterFn: 'fuzzy',
            muiTableHeadCellProps: {
                sx:
                {
                    color: 'white',
                }
            },
            muiTableBodyCellProps: {
                align: align,
            },
            Cell: ({ cell, row }) => <CustomCellComponent value={cell.getValue()} row={row} />
        };
    }

    
    function Standard_Column(accessorKey: string, header: string, id: string): MRT_ColumnDef<AEC_Row> {
        return {
            accessorKey: accessorKey as keyof AEC_Row,
            header,
            id,
            size: 5,
            muiTableHeadCellProps: { sx: { color: 'white' } },
            enableSorting: true,
            filterFn: 'fuzzy',
            muiTableBodyCellProps: {
                align: 'left',
            },
        };
    }

    const columns = useMemo<MRT_ColumnDef<AEC_Row>[]>(
        () => [
            CustomCell_Column("Ammo.ShortName", "Name", "Name", 'left', NameCell),

            CustomCell_Column(`Ammo.Caliber`, "Cal.", "Caliber", 'left', CaliberCell),

            CustomCell_Column(`Details.${distanceIndex}.Speed`, "Speed", "Speed", 'left', SpeedCell),
            CustomCell_Column(`Details.${distanceIndex}.Penetration`, "PEN", "Penetration", 'left', PenetrationCell),
            CustomCell_Column(`Details.${distanceIndex}.Damage`, "DMG", "Damage", 'left', DamageCell),
            CustomCell_Column(`Details.${distanceIndex}.Penetration`, "Armor DMG", "ArmorDamage", 'left', ArmorDamageCell),

            CustomCell_Column(`Ammo.FragmentationChance`, "Frag %", "Frag", 'left', FragCell),
            CustomCell_Column(`Ammo.LightBleedingDelta`, "LBC Δ %", "LBD", 'left', positiveGreenOrNothing_PercentCell),
            CustomCell_Column(`Ammo.HeavyBleedingDelta`, "HBC Δ %", "HBD", 'left', positiveGreenOrNothing_PercentCell),

            CustomCell_Column(`Ammo.AmmoAccuracy`, "Ammo Acc %", "Accuracy", 'left', GreenRedOrNothingCell),
            CustomCell_Column(`Ammo.AmmoRec`, "Recoil", "Recoil", 'left', negativeGreen_PositiveRed_OrNothingCell),

            CustomCell_Column(`Details.${distanceIndex}.Ratings.0`, "AC1", "AC1", 'center', AC_Rating_Cell),
            CustomCell_Column(`Details.${distanceIndex}.Ratings.1`, "AC2", "AC2", 'center', AC_Rating_Cell),
            CustomCell_Column(`Details.${distanceIndex}.Ratings.2`, "AC3", "AC3", 'center', AC_Rating_Cell),
            CustomCell_Column(`Details.${distanceIndex}.Ratings.3`, "AC4", "AC4", 'center', AC_Rating_Cell),
            CustomCell_Column(`Details.${distanceIndex}.Ratings.4`, "AC5", "AC5", 'center', AC_Rating_Cell),
            CustomCell_Column(`Details.${distanceIndex}.Ratings.5`, "AC6", "AC6", 'center', AC_Rating_Cell),

            CustomCell_Column(`PurchaseOffer`, "Trader $ Level", "Trader", 'left', Trader_Cell),
        ],
        [picturesYesNo, distanceIndex, targetZone]
    )
    return (
        <>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline>
                    <AECTableIntroSection />
                </CssBaseline>
                <div id="print">
                    <MaterialReactTable
                        renderBottomToolbarCustomActions={({ table }) => (
                            <Form.Text>
                                This chart was generated on: {new Date().toUTCString()} and is from https://tarkovgunsmith.com{LINKS.AMMO_EFFECTIVENESS_CHART}
                            </Form.Text>
                        )
                        }
                        renderTopToolbarCustomActions={({ table }) => (
                            <>
                                <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                                    <ToggleButton
                                        size='sm'
                                        className="mb-2"
                                        id="toggle-check"
                                        type="checkbox"
                                        variant="outline-primary"
                                        checked={picturesYesNo}
                                        value="1"
                                        onChange={(e) => setPicturesYesNo(e.currentTarget.checked)}
                                    >
                                        Ammo Pictures on/off
                                    </ToggleButton>
                                    <div className='mb-2'>
                                        <ToggleButtonGroup size="sm" type="radio" value={distance} onChange={handleDistanceChange} name="distanceMode">
                                            <ToggleButton size='sm' variant='outline-success' disabled id={"dummy"} value={"dummy"}>
                                                Distance:
                                            </ToggleButton>
                                            {distances.map((item: any, i: number) => {
                                                return (
                                                    <ToggleButton size='sm' key={JSON.stringify(item)} variant='outline-success' id={`tbg-btn-dist-${item}`} value={item}>
                                                        {item}
                                                    </ToggleButton>
                                                )
                                            })}
                                        </ToggleButtonGroup>
                                    </div>
                                    <div className='mb-2'>
                                        <ToggleButtonGroup size="sm" type="radio" value={targetZone} onChange={handleTargetZoneChange} name="TargetZoneMode">
                                            <ToggleButton size='sm' variant='outline-warning' disabled id={"dummy"} value={"dummy"}>
                                                Target Zone:
                                            </ToggleButton>
                                            {TargetZones.map((item: any, i: number) => {
                                                return (
                                                    <ToggleButton size='sm' key={`TargetZoneMode-${item}`} variant='outline-warning' id={`tbg-btn-TargetZoneMode-${item}`} value={item}>
                                                        {item}
                                                    </ToggleButton>
                                                )
                                            })}
                                        </ToggleButtonGroup>
                                    </div>


                                </Box>
                                <div className="ms-auto" style={{paddingTop: 4}}>

                                    <Stack direction='horizontal' gap={2}>
                                        <Button size='sm' variant="outline-info" onClick={handleImageDownload}>Download 📩</Button>
                                        <Button size='sm' variant="outline-info" onClick={handleCopyImage}>Copy 📋</Button>
                                    </Stack>
                                </div>
                            </>
                        )}

                        data={filteredAECData}
                        columns={columns}

                        enableRowSelection={false}//enable some features
                        enableSelectAll={false}

                        //enableRowActions
                        enableColumnFilterModes

                        enableColumnOrdering
                        enableGrouping
                        enablePinning
                        enableMultiSort={true}
                        enableGlobalFilter={true} //turn off a feature
                        enableDensityToggle={false}

                        initialState={{
                            columnVisibility: {
                                AC1: false,
                            },
                            density: 'compact',
                            columnPinning: {
                                left: ['Name']
                            },
                            pagination: pagination,
                            expanded: true,
                            grouping: ['Caliber'],
                            sorting: [{ id: 'Penetration', desc: true }], //sort by state by default
                        }}
                        enableStickyHeader

                    />
                </div>
            </ThemeProvider>
        </>
    )
}