import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { useContext } from "react";
import { OverlayTrigger } from "react-bootstrap";
import { MwbContext } from "../../Context/ContextMWB";
import WavingHandIcon from '@mui/icons-material/WavingHand';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';


interface WeaponStatProps {
    statCurrent: number;
    statPreset: number;
    statBase: number;
    decimalPlaces: number;
}

function WeaponStat({
    statCurrent,
    statPreset,
    statBase,
    decimalPlaces,
}: WeaponStatProps) {
    let tooltipContent = (
        <>
            Preset: {statPreset.toFixed(decimalPlaces)} <br />
            Base: {statBase.toFixed(decimalPlaces)}
        </>
    );

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
                {statCurrent.toFixed(decimalPlaces)}
            </span>
        </OverlayTrigger>
    );
}


export default function MainStatsLine() {

    const {
        result,
    } = useContext(MwbContext);

    if (result !== undefined) {


        const headersRow1 =
            <>
                <TableCell align="center">Weight</TableCell>
                <TableCell align="center">Ergonomics</TableCell>
                <TableCell align="center">Recoil</TableCell>
                <TableCell align="center">Convergence</TableCell>
            </>
        const headersRow2 =
            <>
                <TableCell align="center">Recoil Dispersion</TableCell>
                <TableCell align="center">Recoil Angle</TableCell>
                <TableCell align="center">Camera Recoil</TableCell>
                <TableCell align="center">Camera Snap</TableCell>
            </>

        const bodyRow1 =
            <>
                <TableCell align="center">
                    <WeaponStat
                        statCurrent={result.Weight!}
                        statPreset={result.BasePreset!.Weight}
                        statBase={result.BasePreset!.Weapon.Weight}
                        decimalPlaces={2}
                    />
                    {' '}
                    kg
                </TableCell>
                <TableCell align="center">
                    <WavingHandIcon style={{ fontSize: "15px" }} />
                    {' '}
                    <WeaponStat
                        statCurrent={result.Ergonomics!}
                        statPreset={result.BasePreset!.Ergonomics}
                        statBase={result.BasePreset!.Weapon.Ergonomics}
                        decimalPlaces={1}
                    />
                </TableCell>
                <TableCell align="center">
                    <FileUploadIcon fontSize='small' />
                    {' '}
                    <WeaponStat
                        statCurrent={result.Recoil_Vertical!}
                        statPreset={result.BasePreset!.Recoil_Vertical}
                        statBase={result.BasePreset!.Weapon.RecoilForceUp}
                        decimalPlaces={1}
                    />
                </TableCell>
                <TableCell align="center"><FileDownloadIcon fontSize='small' /> {result.BasePreset?.Weapon.Convergence.toFixed(2)}</TableCell>
            </>
        const bodyRow2 =
            <>
                <TableCell align="center">
                    <FileUploadIcon fontSize='small' style={{ rotate: "270deg" }} />
                    <FileUploadIcon fontSize='small' style={{ rotate: "90deg" }} />
                    {' ' + result.BasePreset?.Weapon.RecolDispersion}
                </TableCell>
                <TableCell align="center"><TrendingFlatIcon style={{ rotate: `${-result.BasePreset?.Weapon.RecoilAngle}deg` }} />{result.BasePreset?.Weapon.RecoilAngle}</TableCell>
                <TableCell align="center">{result.BasePreset?.Weapon.CameraRecoil}</TableCell>
                <TableCell align="center">{result.BasePreset?.Weapon.CameraSnap}</TableCell>
            </>

        return (
            <>
                <Paper elevation={1}>
                    <TableContainer className='WideWeaponSummary'>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    {headersRow1}
                                    {headersRow2}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    {bodyRow1}
                                    {bodyRow2}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableContainer className='NarrowWeaponSummary'>
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    {headersRow1}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    {bodyRow1}
                                </TableRow>

                            </TableBody>
                        </Table>

                    </TableContainer>
                    <TableContainer className='NarrowWeaponSummary' >
                        <Table aria-label="simple table">
                            <TableHead>
                                <TableRow >
                                    {headersRow2}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow >
                                    {bodyRow2}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </>
        )
    }
    else{
        return <></>
    }
}
