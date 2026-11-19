import { Box, Input, Table } from '@mantine/core';

const elements = [
    { distance: 50, angle: 0.060138054, radians: 0.0010496070513943334, milliradians: 1.0496070513943334 },
    { distance: 100, angle: 0.05551664, radians: 0.000968948185343091, milliradians: 0.968948185343091 },
    { distance: 200, angle: 0.08251202, radians: 0.0014401064400549498, milliradians: 1.4401064400549497 },
    { distance: 300, angle: 0.12179214, radians: 0.0021256738045605, milliradians: 2.1256738045605 },
    { distance: 400, angle: 0.16889931, radians: 0.002947849109493831, milliradians: 2.947849109493831 },
];

export function FAQ_AnglesTable() {
    const rows = elements.map((element) => (
        <tr key={element.distance}>
            <td>{element.distance}</td>
            <td>{element.angle.toFixed(4)}°</td>
            <td>{element.radians.toFixed(4)}</td>
            <td>{element.milliradians.toFixed(2)}</td>
        </tr>
    ));

    return (
        <Box miw={200} w={370} h={"auto"}>
            <Table highlightOnHover withBorder withColumnBorders fontSize={"xs"}>
                <thead>
                    <tr>
                        <th>Distance</th>
                        <th>Angle</th>
                        <th>Radians</th>
                        <th>Milliradians</th>
                    </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
            <Input.Description pb={4}>Calibration Angles for 7.62x51mm BCP with InitialSpeed 942.564 m/s</Input.Description>
        </Box>
    );
}