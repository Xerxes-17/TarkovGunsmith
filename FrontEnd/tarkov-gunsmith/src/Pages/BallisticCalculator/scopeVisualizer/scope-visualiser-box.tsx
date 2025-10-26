import { Box, Group, NumberInput, Select, Stack, Switch } from "@mantine/core";
import { BallisticCalculatorTableRow } from "../types";
import { useScopeVisualizerForm, scopeVisualizerFormYupValidator } from './scope-visualizer-form-context';
import { useEffect, useRef, useState } from "react";

export interface ScopeVisualizerBoxProps {
    selectedCalibration: string;
    resultData: BallisticCalculatorTableRow[]
    distanceMemory: number
    setDistanceMemory: React.Dispatch<React.SetStateAction<number>>

}

export function ScopeVisualizerBox({ resultData: chartData, selectedCalibration, distanceMemory, setDistanceMemory }: ScopeVisualizerBoxProps) {

    const calibrationNumber = parseInt(selectedCalibration) ?? -1

    const boxWidth = 575;
    const boxHeight = 550;

    const chartDataWithoutZeroM = chartData.slice(1);

    const distances = chartDataWithoutZeroM.map(x => {
        return {
            value: `${x.Distance}`,
            label: `${x.Distance}m`
        }
    }).sort()

    const selectedData = chartDataWithoutZeroM.find(x => x.Distance === distanceMemory)
    const data100mFallback = chartDataWithoutZeroM[11];

    console.log("calibrationNumber", calibrationNumber)
    // console.log("chartData", chartData)
    // console.log("distanceMemory", distanceMemory)
    // console.log("selectedData", selectedData)
    // console.log("data100mFallback", data100mFallback)

    const form = useScopeVisualizerForm({
        initialValues: {
            selectedDistance: `${distanceMemory}`,
            distance: distanceMemory,
            dropCm: (selectedData?.Drop ?? data100mFallback.Drop) * 100,
            dispersionCm: selectedData?.MaxDispersion ?? data100mFallback.MaxDispersion,
            zoom: 1,
            opticMarkFudgeFactor: 1.42,
            reticleType: "MOA lines",
            showRealMoaScale: true
        },
        validate: scopeVisualizerFormYupValidator
    })

    useEffect(()=>{
        form.setFieldValue("dropCm", (selectedData?.Drop ?? data100mFallback.Drop) * 100)
    },[selectedData])

    
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const CM_PER_MOA_AT_100M = 2.909;

        const dispersionRadiusCm = form.values.dispersionCm;
        const distanceM = form.values.distance;
        const zoom = form.values.zoom;
        const milsMultiplier = form.values.opticMarkFudgeFactor;
        const dropCM = form.values.dropCm

        console.log("dropCM", dropCM)

        const CANVAS_CENTERLINE_X = boxWidth / 2;
        const CANVAS_CENTERLINE_Y = boxHeight / 2;

        const PIXELS_PER_CM_AT_100M = 1.97104;
        const REFERENCE_DISTANCE = 100;

        const pixelsPerCmAtCurrentDistanceAndZoom = PIXELS_PER_CM_AT_100M * (REFERENCE_DISTANCE / distanceM) * zoom;

        const cmPerMOAAtCurrentDistance = ((distanceM / REFERENCE_DISTANCE) * CM_PER_MOA_AT_100M);
        const cmPerMILAtCurrentDistance = ((distanceM / 1000) * 100)

        const pixelsPerMilAtCurrentDistanceAndZoom = (cmPerMOAAtCurrentDistance * pixelsPerCmAtCurrentDistanceAndZoom);

        const superElevationYPx = CANVAS_CENTERLINE_Y + (dropCM * pixelsPerCmAtCurrentDistanceAndZoom);

        function drawReferenceScale5cm(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string){
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const minorCrosshatchSize = 5;
            const majorCrosshatchSize = 10;
            const fontSizePx = 1.7 * pixelsPerCmAtCurrentDistanceAndZoom;

            ctx.font = `${fontSizePx}px Arial`;

            const scaleLengthM = 100;
            const scaleLengthCm = scaleLengthM * 100;
            const divisions = 10

            const pixelLength = scaleLengthCm * pixelsPerCmAtCurrentDistanceAndZoom;

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - pixelLength, y);
            ctx.lineTo(x + pixelLength, y);
            ctx.stroke();

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - pixelLength);
            ctx.lineTo(x, y + pixelLength);
            ctx.stroke();

            // Crosshatching
            for (let i = 1; i <= scaleLengthCm / divisions; i++) {
                var crossHatchSize = minorCrosshatchSize;
                if (i % 50 === 0) {
                    crossHatchSize = majorCrosshatchSize * 2;
                }
                else if (i % 5 === 0) {
                    crossHatchSize = majorCrosshatchSize;
                }

                // Horizontal
                // Left
                ctx.beginPath();
                ctx.moveTo(x - (i * pixelsPerCmAtCurrentDistanceAndZoom), y - crossHatchSize);
                ctx.lineTo(x - (i * pixelsPerCmAtCurrentDistanceAndZoom), y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x - (i * pixelsPerCmAtCurrentDistanceAndZoom), y + ((crossHatchSize) * 2.5));
                }

                // Right
                ctx.beginPath();
                ctx.moveTo(x + (i * pixelsPerCmAtCurrentDistanceAndZoom), y - crossHatchSize);
                ctx.lineTo(x + (i * pixelsPerCmAtCurrentDistanceAndZoom), y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + (i * pixelsPerCmAtCurrentDistanceAndZoom), y + ((crossHatchSize) * 2.5));
                }

                // Vertical
                // Top
                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y - (i * pixelsPerCmAtCurrentDistanceAndZoom));
                ctx.lineTo(x + crossHatchSize, y - (i * pixelsPerCmAtCurrentDistanceAndZoom));
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + ((crossHatchSize) * 1.5), y - (i * pixelsPerCmAtCurrentDistanceAndZoom));
                }

                // Bottom
                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y + (i * pixelsPerCmAtCurrentDistanceAndZoom));
                ctx.lineTo(x + crossHatchSize, y + (i * pixelsPerCmAtCurrentDistanceAndZoom));
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + ((crossHatchSize) * 1.5), y + (i * pixelsPerCmAtCurrentDistanceAndZoom));
                }
            }
        }

        function drawReferenceHeadBox(ctx: CanvasRenderingContext2D) {
            const sizeInCm = 16; // 16cm a side for the head box
            const apparentSizePx = (sizeInCm * pixelsPerCmAtCurrentDistanceAndZoom)

            const centerlinePlacement = CANVAS_CENTERLINE_X - (apparentSizePx / 2);
            const centerlinePlacementY = CANVAS_CENTERLINE_Y - (apparentSizePx / 2);

            ctx.fillStyle = 'rgb(117, 167, 1)';
            ctx.fillRect(centerlinePlacement, centerlinePlacementY, apparentSizePx, apparentSizePx)
        }

        function drawReferenceTorsoBox(ctx: CanvasRenderingContext2D) {
            const widthInCm = 48;
            const heightInCm = 70;

            const apparentWidthInCm = widthInCm * pixelsPerCmAtCurrentDistanceAndZoom;
            const apparentHeightInCm = heightInCm * pixelsPerCmAtCurrentDistanceAndZoom;

            const centerlinePlacement = CANVAS_CENTERLINE_X - (apparentWidthInCm / 2);
            const offsetFromHorizontalPlacement = CANVAS_CENTERLINE_Y + (8 * pixelsPerCmAtCurrentDistanceAndZoom); // half of the head box size
            ctx.fillStyle = 'rgb(117, 167, 120)';
            ctx.fillRect(centerlinePlacement, offsetFromHorizontalPlacement, apparentWidthInCm, apparentHeightInCm)
        }

        function drawReferenceLegsBox(ctx: CanvasRenderingContext2D) {
            const widthInCm = 32;
            const heightInCm = 170 - (16 + 70);

            const apparentWidthInCm = widthInCm * pixelsPerCmAtCurrentDistanceAndZoom;
            const apparentHeightInCm = heightInCm * pixelsPerCmAtCurrentDistanceAndZoom;

            const centerlinePlacement = CANVAS_CENTERLINE_X - (apparentWidthInCm / 2);
            const offsetFromHorizontalPlacement = CANVAS_CENTERLINE_Y + ((8 + 70) * pixelsPerCmAtCurrentDistanceAndZoom); // half of the head box size + tosro
            ctx.fillStyle = 'rgb(117, 167, 163)';
            ctx.fillRect(centerlinePlacement, offsetFromHorizontalPlacement, apparentWidthInCm, apparentHeightInCm)
        }

        function drawPmcHeightRefScale(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, dropCm: number) {
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const dropInPixels = dropCm * pixelsPerCmAtCurrentDistanceAndZoom;
            const foo = ((16 * pixelsPerCmAtCurrentDistanceAndZoom) / 2)

            const majorCrosshatchSize = .5 * pixelsPerMilAtCurrentDistanceAndZoom;

            const lengthPx = 170 * pixelsPerCmAtCurrentDistanceAndZoom;

            const widthInCm = 48;
            const apparentWidthInCm = widthInCm * pixelsPerCmAtCurrentDistanceAndZoom;
            const torsoBoxX = CANVAS_CENTERLINE_X - (apparentWidthInCm / 2);;

            const milsFromCenterPx = 1 * pixelsPerMilAtCurrentDistanceAndZoom;

            const localX = torsoBoxX - (milsFromCenterPx)
            const localY = y - foo - dropInPixels;

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(localX, localY);
            ctx.lineTo(localX, localY + lengthPx);
            ctx.stroke();

            // Horizontal lines
            // Top
            ctx.beginPath();
            ctx.moveTo(localX - majorCrosshatchSize, localY);
            ctx.lineTo(localX + majorCrosshatchSize, localY);
            ctx.stroke();

            // Bottom
            ctx.beginPath();
            ctx.moveTo(localX - majorCrosshatchSize, localY + lengthPx);
            ctx.lineTo(localX + majorCrosshatchSize, localY + lengthPx);
            ctx.stroke();

            const fontSizePx = 1.7 * pixelsPerMilAtCurrentDistanceAndZoom;
            ctx.font = `${fontSizePx}px Arial`;
            ctx.fillText(`170cm`, localX - (7 * majorCrosshatchSize), localY + lengthPx + (2 * pixelsPerMilAtCurrentDistanceAndZoom));
        }

        function drawDispersionCircle(ctx: CanvasRenderingContext2D, x: number, y: number, dispersionRadiusCm: number, fillStyle: string) {
            const pxRadius = dispersionRadiusCm * pixelsPerCmAtCurrentDistanceAndZoom;

            ctx.beginPath();
            ctx.arc(x, y, pxRadius, 0, 2 * Math.PI);
            ctx.fillStyle = fillStyle;
            ctx.fill();

            ctx.strokeStyle = 'white';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        function drawDropReferenceLine(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, dropCm: number, multiplier: number) {
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const majorCrosshatchSize = 10;

            const dropInPixels = dropCm * pixelsPerCmAtCurrentDistanceAndZoom;

            const milsToRightOfCenter = 5 * pixelsPerMilAtCurrentDistanceAndZoom;

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x + milsToRightOfCenter, y);
            ctx.lineTo(x + milsToRightOfCenter, y - dropInPixels);
            ctx.stroke();

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x + milsToRightOfCenter - majorCrosshatchSize, y - dropInPixels);
            ctx.lineTo(x + milsToRightOfCenter + majorCrosshatchSize, y - dropInPixels);
            ctx.stroke();

            const fontSizePx = 1.7 * pixelsPerMilAtCurrentDistanceAndZoom;

            ctx.font = `${fontSizePx}px Arial`;

            ctx.fillText(`Drop: ${dropCm.toFixed(1)}cm`, x + milsToRightOfCenter + majorCrosshatchSize + 3, y - dropInPixels + 10);
            

            const dropInMOA_real = dropCM / cmPerMOAAtCurrentDistance;
            const dropInMOA_adjusted = dropCM / (cmPerMOAAtCurrentDistance * multiplier)

            const dropInMIL_real = dropCM / cmPerMILAtCurrentDistance
            const dropInMIL_adjusted = dropInMIL_real * 2.41
            
            
            console.log("dropInMOA_real", dropInMOA_real)
            console.log("dropInMOA_adjusted", dropInMOA_adjusted)

            console.log("dropInMIL_real", dropInMIL_real)
            console.log("dropInMIL_adjusted", dropInMIL_adjusted)

            console.log("targetHeightsOfDrop", dropCM/170)
        }

        function drawDeadAssSimpleCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string) {
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const milsCount = 30;
            const lengthCrosshairs = pixelsPerMilAtCurrentDistanceAndZoom * milsCount;

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - lengthCrosshairs, y);
            ctx.lineTo(x + lengthCrosshairs, y);
            ctx.stroke();

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - lengthCrosshairs);
            ctx.lineTo(x, y + lengthCrosshairs * 2);
            ctx.stroke();
        }

        function drawMOACrosshatchCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, multiplier: number) {
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const localPixelsPerMilAtCurrentDistanceAndZoom = pixelsPerMilAtCurrentDistanceAndZoom * multiplier;

            const milsCount = 30;
            const lengthCrosshairs = localPixelsPerMilAtCurrentDistanceAndZoom * milsCount;

            const minorCrosshatchSize = .25 * localPixelsPerMilAtCurrentDistanceAndZoom;
            const majorCrosshatchSize = .5 * localPixelsPerMilAtCurrentDistanceAndZoom;
            const fontSizePx = 1.7 * pixelsPerMilAtCurrentDistanceAndZoom;

            ctx.font = `${fontSizePx}px Arial`;

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - lengthCrosshairs, y);
            ctx.lineTo(x + lengthCrosshairs, y);
            ctx.stroke();

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - lengthCrosshairs);
            ctx.lineTo(x, y + lengthCrosshairs * 2);
            ctx.stroke();

            // Crosshatching
            for (let i = 1; i <= milsCount; i++) {
                const crossHatchSize = i % 5 !== 0 ? minorCrosshatchSize : majorCrosshatchSize;
                const iterationPixels = i * localPixelsPerMilAtCurrentDistanceAndZoom;

                // Horizontal
                // Left
                ctx.beginPath();
                ctx.moveTo(x - iterationPixels, y - crossHatchSize);
                ctx.lineTo(x - iterationPixels, y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x - iterationPixels, y + ((crossHatchSize) * 3.7));
                }

                // Right
                ctx.beginPath();
                ctx.moveTo(x + iterationPixels, y - crossHatchSize);
                ctx.lineTo(x + iterationPixels, y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + iterationPixels, y + ((crossHatchSize) * 3.7));
                }

                // Vertical
                // Top
                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y - iterationPixels);
                ctx.lineTo(x + crossHatchSize, y - iterationPixels);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + ((crossHatchSize) * 1.5), y - iterationPixels);
                }

            }

            for (let i = 1; i <= milsCount * 2; i++) {
                const crossHatchSize = i % 5 !== 0 ? minorCrosshatchSize : majorCrosshatchSize;
                const iterationPixels = i * localPixelsPerMilAtCurrentDistanceAndZoom;
                // Bottom
                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y + iterationPixels);
                ctx.lineTo(x + crossHatchSize, y + iterationPixels);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + ((crossHatchSize) * 1.5), y + iterationPixels);
                }
            }
        }



        ctx.fillStyle = 'rgb(20, 26, 34)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (dispersionRadiusCm > 9) {
            drawDispersionCircle(ctx, CANVAS_CENTERLINE_X, CANVAS_CENTERLINE_Y, dispersionRadiusCm, 'rgba(255, 253, 111, 0.9)');
        }

        drawReferenceHeadBox(ctx);
        drawReferenceTorsoBox(ctx);
        drawReferenceLegsBox(ctx);

        if (dispersionRadiusCm <= 9) {
            drawDispersionCircle(ctx, CANVAS_CENTERLINE_X, CANVAS_CENTERLINE_Y, dispersionRadiusCm, 'rgba(0, 110, 255, 0.90)');
        }

        if (form.values.reticleType === "Simple Crosshair") {
            drawDeadAssSimpleCrosshair(ctx, CANVAS_CENTERLINE_X, superElevationYPx, 'rgba(0, 0, 0, 1)')
        }

        const showReferenceMOA =
            form.values.opticMarkFudgeFactor !== 1 &&
            form.values.reticleType !== "Simple Crosshair" &&
            form.values.showRealMoaScale

        if (showReferenceMOA) {
            drawMOACrosshatchCrosshair(ctx, CANVAS_CENTERLINE_X, superElevationYPx, 'rgba(255, 0, 221, 0.75)', 1);
        }

        if (form.values.reticleType === "MOA lines") {
            drawMOACrosshatchCrosshair(ctx, CANVAS_CENTERLINE_X, superElevationYPx, 'rgba(255, 255, 255, 1)', milsMultiplier)
        }

        if (Math.abs(dropCM) > 1) {
            drawDropReferenceLine(ctx, CANVAS_CENTERLINE_X, superElevationYPx, 'rgb(0, 0, 255)', dropCM, milsMultiplier)
        }
        drawPmcHeightRefScale(ctx, CANVAS_CENTERLINE_X, superElevationYPx, 'rgba(255, 255, 255, 1)', dropCM)

        // drawReferenceScale5cm(ctx, CANVAS_CENTERLINE_X, superElevationYPx, 'rgba(94, 255, 0, 1)')

    }, [form, calibrationNumber, distanceMemory])

    const canvasRef = useRef<HTMLCanvasElement>(null);

    return (
        <Box w={boxWidth}>
            <Stack spacing={"xs"}>
                <Group>
                    <Select
                        w={110}
                        label="Select Distance"
                        data={distances}
                        {...form.getInputProps("selectedDistance")}
                        onChange={(value) => {
                            if (!value) {
                                return
                            }
                            const asNumber = parseInt(value)
                            form.setFieldValue('distance', asNumber)
                            setDistanceMemory(asNumber)

                            const foo = chartDataWithoutZeroM.find(x => x.Distance === asNumber)
                            if (!foo) {
                                return
                            }
                            form.setFieldValue('dispersionCm', foo.MaxDispersion)
                            form.setFieldValue('dropCm', foo.Drop * 100)

                            form.setFieldValue('selectedDistance', value)

                        }}
                    />
                    <NumberInput
                        w={100}
                        label="Drop cm"
                        disabled
                        precision={2}
                        {...form.getInputProps("dropCm")}
                    />
                    <NumberInput
                        w={100}
                        label="Dispersion cm"
                        disabled
                        precision={2}
                        {...form.getInputProps("dispersionCm")}
                    />
                </Group>
                <Group>
                    <NumberInput
                        w={80}
                        label="Zoom"
                        precision={2}
                        step={.1}
                        {...form.getInputProps("zoom")}
                    />
                    <NumberInput
                        w={150}
                        label="Scope MOA Multiplier"
                        precision={2}
                        step={.01}
                        {...form.getInputProps("opticMarkFudgeFactor")}
                    />

                    <Select
                        w={160}
                        label="Reticle Type"
                        data={["MOA lines", "Simple Crosshair"]}
                        {...form.getInputProps("reticleType")}
                    />
                    <Switch
                        w={180}
                        label="Show Real MOA"
                        defaultChecked={form.values.showRealMoaScale}
                        {...form.getInputProps("showRealMoaScale")}
                    />
                </Group>

                <canvas ref={canvasRef} width={boxWidth} height={boxHeight} style={{ border: '1px solid black' }} />
            </Stack>

        </Box>
    )
}