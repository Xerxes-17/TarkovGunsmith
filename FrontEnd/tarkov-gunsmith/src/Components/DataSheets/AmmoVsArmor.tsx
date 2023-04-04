import { Box } from "@mui/material"
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table"
import { useState, useEffect, useMemo } from "react"
import { Col, Card, Form, Button, Container } from "react-bootstrap"
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { API_URL } from "../../Util/util"
import { requestAmmoEffectivenessData } from "../../Context/Requests";
import { AmmoOption } from "../ADC/AmmoData";
import SelectAmmo from '../ADC/SelectAmmo';
import { effectivenessDataRow } from "./DataSheetTypes";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AMMO_VS_ARMOR, DAMAGE_SIMULATOR } from "../../Util/links";

export default function DataSheetEffectivenessAmmo(props: any) {
    const navigate = useNavigate();
    const { id_ammo } = useParams();

    //! Armor Selection List
    // Selector - Init
    const [AmmoOptions, setAmmoOptions] = useState<AmmoOption[]>([]);
    const [defaultSelection, setDefaultSelection] = useState<AmmoOption>();

    const ammo = async () => {
        const response = await fetch(API_URL + '/GetAmmoOptionsList');
        setAmmoOptions(await response.json())
    }
    useEffect(() => {
        ammo();
    }, [])

    useEffect(() => {
        if (id_ammo !== undefined && AmmoOptions.length > 0) {
            getAmmoVsArmorData(id_ammo);
            
            var temp = AmmoOptions.find((x) => x.value === id_ammo)
            if (temp !== undefined) {
                handleAmmoSelection(temp);
                setDefaultSelection(temp);
            }
        }
    }, [AmmoOptions, id_ammo])

    // Selector - Selection
    const [ammoId, setAmmoId] = useState("");

    function handleAmmoSelection(selectedOption: AmmoOption) {
        setAmmoId(selectedOption.value);
        navigate(`${AMMO_VS_ARMOR}/${selectedOption?.value}`)
    }

    const getAmmoVsArmorData = (id: string) => {
        requestAmmoEffectivenessData(id).then(response => {
            // console.log(response)
            setTableData(response);

        }).catch(error => {
            alert(`The error was: ${error}`);
            // console.log(error);
        });
    }

    // If using TypeScript, define the shape of your data (optional, but recommended)
    // strongly typed if you are using TypeScript (optional, but recommended)

    const [TableData, setTableData] = useState<effectivenessDataRow[]>([]);

    // https://www.material-react-table.com/docs/examples/aggregation-and-grouping

    //column definitions - strongly typed if you are using TypeScript (optional, but recommended)
    const columns = useMemo<MRT_ColumnDef<effectivenessDataRow>[]>(
        () => [
            {
                accessorKey: 'armorName', //simple recommended way to define a column
                header: 'Name',
                muiTableHeadCellProps: { sx: { color: 'white' } }, //custom props
                size: 10, //small column
                enableSorting: true,
                Cell: ({ renderedCellValue, row }) => (
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                        }}
                    >
                        <img
                            alt="avatar"
                            height={40}
                            src={`https://assets.tarkov.dev/${row.original.armorId}-icon.jpg`}
                            loading="lazy"
                        />
                        {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
                        <span><Link to={`${DAMAGE_SIMULATOR}/${row.original.armorId}/${row.original.ammoId}`}>{renderedCellValue}</Link></span>
                    </Box>
                ),
            },
            {
                accessorKey: 'armorType',
                header: 'Type',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
            },
            {
                accessorKey: 'armorClass',
                header: 'AC',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
            },

            {
                accessorKey: 'firstShot_PenChance',
                header: 'First Shot PenChance',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'firstShot_PenDamage',
                header: 'First Shot PenDamage',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'firstShot_BluntDamage',
                header: 'First Shot BluntDamage',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'firstShot_ArmorDamage',
                header: 'First Shot ArmorDamage',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
            },
            {
                accessorKey: 'expectedShotsToKill',
                header: 'Shots To Kill',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
                aggregationFn: 'mean',
                //required to render an aggregated cell, show the average salary in the group
                AggregatedCell: ({ cell, table }) => (
                    <>
                        Average by{' '}
                        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
                        <Box sx={{ color: 'success.main', fontWeight: 'bold' }}>
                            {cell.getValue<number>()?.toLocaleString?.('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })}
                        </Box>
                    </>
                ),
            },
            {
                accessorKey: 'expectedKillShotConfidence',
                header: 'Kill shot Confidence',
                muiTableHeadCellProps: { sx: { color: 'white' } },
                size: 10, //small column
                Cell: ({ cell }) => (
                    <span>{(cell.getValue<number>()).toLocaleString()}</span>
                ),
                aggregationFn: 'mean',
                AggregatedCell: ({ cell, table }) => (
                    <>
                        Average by{' '}
                        {table.getColumn(cell.row.groupingColumnId ?? '').columnDef.header}:{' '}
                        <Box sx={{ color: 'success.main', fontWeight: 'bold' }}>
                            <>{cell.getValue<number>()?.toLocaleString?.('en-US', {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                            })} %
                            </>
                        </Box>
                    </>
                ),
            },
        ],
        [],
    );

    //store pagination state in your own state
    const [pagination] = useState({
        pageIndex: 0,
        pageSize: 200, //customize the default page size
    });

    const darkTheme = createTheme({
        palette: {
            mode: 'dark',
        },
    });

    return (
        <Container className='main-app-container'>
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Col xxl>
                    <Card bg="dark" border="secondary" text="light" className="xxl">
                        <Card.Header as="h2" >
                            Ammo vs Armor
                        </Card.Header>

                        <Card.Body>
                            <>
                                <Form>
                                    <strong>Available Choices:</strong> {AmmoOptions.length} <br />
                                    <Form.Text>You can search by the name by selecting this box and typing. </Form.Text>
                                    <SelectAmmo handleAmmoSelection={handleAmmoSelection} ammoOptions={AmmoOptions} selectedId={ammoId} defaultSelection={defaultSelection} />
                                </Form>
                            </>
                        </Card.Body>
                        <Card.Footer>
                            This table starts with a few columns hidden by default. Press "Show/Hide Columns" on the right to change what is visible. <br />
                            This table starts with Amor grouped by Armor Class.  <br />
                            Drag and drop a column to move it or to the top bar with the '=' to add it to the grouping. <br />
                        </Card.Footer>
                    </Card>

                    <MaterialReactTable
                        renderTopToolbarCustomActions={({ table }) => (
                            <Box sx={{ display: 'flex', gap: '1rem', p: '4px' }}>
                                <Button
                                    disabled
                                    size='sm'
                                    className="mb-2"
                                    variant="outline-info"
                                >
                                    Displaying data for: {(TableData.at(0)?.ammoName)} @ 10m
                                </Button>
                            </Box>
                        )}
                        columns={columns}
                        data={TableData}

                        enableRowSelection={false}//enable some features
                        enableSelectAll={false}

                        enableColumnOrdering
                        enableGrouping
                        enablePinning
                        enableMultiSort={true}
                        enableGlobalFilter={true} //turn off a feature
                        enableDensityToggle={false}
                        initialState={{
                            density: 'compact',
                            columnVisibility: {
                                firstShot_PenChance: false,
                                firstShot_PenDamage: false,
                                firstShot_BluntDamage: false,
                                firstShot_ArmorDamage: false,
                            },
                            pagination: pagination,

                            grouping: ['armorClass', 'armorType'], //an array of columns to group by by default (can be multiple)
                            expanded: true, //expand all groups by default
                            sorting: [{ id: 'armorClass', desc: false }, { id: 'expectedShotsToKill', desc: false }, { id: 'expectedKillShotConfidence', desc: true }], //sort by state by default
                        }} //hide AmmoRec column by default

                        defaultColumn={{
                            minSize: 10, //allow columns to get smaller than default
                            maxSize: 40, //allow columns to get larger than default
                            size: 10, //make columns wider by default
                        }}
                        enableStickyHeader

                        sortDescFirst
                        muiTablePaginationProps={{
                            rowsPerPageOptions: [10, 25, 50, 75, 100, 150, 200],
                        }}
                    />
                </Col>
            </ThemeProvider>
        </Container>

    )
}