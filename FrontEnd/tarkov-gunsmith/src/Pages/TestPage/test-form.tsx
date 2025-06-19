import { Button, Divider, Input, NumberInput, Select, Stack } from "@mantine/core"
import { TestFormContextProvider, TestFormValues, testFormYupValidator, useTestForm } from "./test-form-context"
import { useEffect, useRef } from "react";


export function TestForm({ setResult }: { setResult: React.Dispatch<React.SetStateAction<TestFormValues | undefined>> }) {


    const testData = [
        {
            "Distance": 10,
            "Penetration": 30.598825,
            "Damage": 53.301178,
            "Speed": 839.93726,
            "Drop": -0.052103616,
            "TimeOfFlight": 0.020100001,
            "MilliradiansOfDrop": -5.2103616,
            "MaxDispersion": 0.53
        },
        {
            "Distance": 20,
            "Penetration": 30.40494,
            "Damage": 52.963444,
            "Speed": 829.1516,
            "Drop": -0.03697155,
            "TimeOfFlight": 0.03015,
            "MilliradiansOfDrop": -1.8485775,
            "MaxDispersion": 1.06
        },
        {
            "Distance": 25,
            "Penetration": 30.40494,
            "Damage": 52.963444,
            "Speed": 829.1516,
            "Drop": -0.029818155,
            "TimeOfFlight": 0.03015,
            "MilliradiansOfDrop": -1.1927261999999998,
            "MaxDispersion": 1.325
        },
        {
            "Distance": 30,
            "Penetration": 30.21446,
            "Damage": 52.63164,
            "Speed": 818.55536,
            "Drop": -0.02321656,
            "TimeOfFlight": 0.040200002,
            "MilliradiansOfDrop": -0.7738853333333333,
            "MaxDispersion": 1.5899999999999999
        },
        {
            "Distance": 40,
            "Penetration": 30.02734,
            "Damage": 52.30569,
            "Speed": 808.14606,
            "Drop": -0.010871917,
            "TimeOfFlight": 0.05025,
            "MilliradiansOfDrop": -0.271797925,
            "MaxDispersion": 2.12
        },
        {
            "Distance": 50,
            "Penetration": 29.663,
            "Damage": 51.671032,
            "Speed": 787.878,
            "Drop": 0,
            "TimeOfFlight": 0.07035,
            "MilliradiansOfDrop": 0,
            "MaxDispersion": 2.65
        },
        {
            "Distance": 60,
            "Penetration": 29.485682,
            "Damage": 51.362156,
            "Speed": 778.0139,
            "Drop": 0.009162493,
            "TimeOfFlight": 0.0804,
            "MilliradiansOfDrop": 0.15270821666666667,
            "MaxDispersion": 3.1799999999999997
        },
        {
            "Distance": 70,
            "Penetration": 29.311533,
            "Damage": 51.0588,
            "Speed": 768.3262,
            "Drop": 0.016792953,
            "TimeOfFlight": 0.09045,
            "MilliradiansOfDrop": 0.23989932857142857,
            "MaxDispersion": 3.71
        },
        {
            "Distance": 75,
            "Penetration": 29.140774,
            "Damage": 50.76135,
            "Speed": 758.82697,
            "Drop": 0.020033814,
            "TimeOfFlight": 0.100499995,
            "MilliradiansOfDrop": 0.26711752,
            "MaxDispersion": 3.975
        },
        {
            "Distance": 80,
            "Penetration": 29.140774,
            "Damage": 50.76135,
            "Speed": 758.82697,
            "Drop": 0.022856027,
            "TimeOfFlight": 0.100499995,
            "MilliradiansOfDrop": 0.2857003375,
            "MaxDispersion": 4.24
        },
        {
            "Distance": 90,
            "Penetration": 28.807573,
            "Damage": 50.180935,
            "Speed": 740.29126,
            "Drop": 0.027109995,
            "TimeOfFlight": 0.12059999,
            "MilliradiansOfDrop": 0.3012221666666667,
            "MaxDispersion": 4.77
        },
        {
            "Distance": 100,
            "Penetration": 28.645113,
            "Damage": 49.897938,
            "Speed": 731.2536,
            "Drop": 0.029587977,
            "TimeOfFlight": 0.13064998,
            "MilliradiansOfDrop": 0.29587977000000004,
            "MaxDispersion": 5.3
        },
        {
            "Distance": 110,
            "Penetration": 28.485378,
            "Damage": 49.61969,
            "Speed": 722.3677,
            "Drop": 0.03036923,
            "TimeOfFlight": 0.1407,
            "MilliradiansOfDrop": 0.27608390909090913,
            "MaxDispersion": 5.83
        },
        {
            "Distance": 120,
            "Penetration": 28.173527,
            "Damage": 49.076466,
            "Speed": 705.0196,
            "Drop": 0.029096909,
            "TimeOfFlight": 0.1608,
            "MilliradiansOfDrop": 0.24247424166666667,
            "MaxDispersion": 6.359999999999999
        },
        {
            "Distance": 125,
            "Penetration": 28.02141,
            "Damage": 48.81149,
            "Speed": 696.5575,
            "Drop": 0.02786383,
            "TimeOfFlight": 0.17085,
            "MilliradiansOfDrop": 0.22291064,
            "MaxDispersion": 6.625
        },
        {
            "Distance": 130,
            "Penetration": 28.02141,
            "Damage": 48.81149,
            "Speed": 696.5575,
            "Drop": 0.025961034,
            "TimeOfFlight": 0.17085,
            "MilliradiansOfDrop": 0.19970026153846154,
            "MaxDispersion": 6.89
        },
        {
            "Distance": 140,
            "Penetration": 27.722864,
            "Damage": 48.29144,
            "Speed": 679.94946,
            "Drop": 0.020808272,
            "TimeOfFlight": 0.19094999,
            "MilliradiansOfDrop": 0.14863051428571428,
            "MaxDispersion": 7.42
        },
        {
            "Distance": 150,
            "Penetration": 27.576101,
            "Damage": 48.03579,
            "Speed": 671.78516,
            "Drop": 0.013506696,
            "TimeOfFlight": 0.20099999,
            "MilliradiansOfDrop": 0.09004464,
            "MaxDispersion": 7.95
        },
        {
            "Distance": 160,
            "Penetration": 27.289324,
            "Damage": 47.53624,
            "Speed": 655.832,
            "Drop": 0.0041198954,
            "TimeOfFlight": 0.22109999,
            "MilliradiansOfDrop": 0.025749346250000003,
            "MaxDispersion": 8.48
        },
        {
            "Distance": 170,
            "Penetration": 27.149364,
            "Damage": 47.292442,
            "Speed": 648.04614,
            "Drop": -0.007607449,
            "TimeOfFlight": 0.23114999,
            "MilliradiansOfDrop": -0.044749699999999996,
            "MaxDispersion": 9.01
        },
        {
            "Distance": 180,
            "Penetration": 26.872448,
            "Damage": 46.81007,
            "Speed": 632.64154,
            "Drop": -0.021600846,
            "TimeOfFlight": 0.25125,
            "MilliradiansOfDrop": -0.12000469999999999,
            "MaxDispersion": 9.54
        },
        {
            "Distance": 190,
            "Penetration": 26.734602,
            "Damage": 46.56995,
            "Speed": 624.97314,
            "Drop": -0.03802688,
            "TimeOfFlight": 0.2613,
            "MilliradiansOfDrop": -0.2001414736842105,
            "MaxDispersion": 10.07
        },
        {
            "Distance": 200,
            "Penetration": 26.468855,
            "Damage": 46.107037,
            "Speed": 610.18994,
            "Drop": -0.05702174,
            "TimeOfFlight": 0.2814,
            "MilliradiansOfDrop": -0.2851087,
            "MaxDispersion": 10.6
        }
    ]

    const form = useTestForm({
        initialValues: {
            stringField: "springField",
            numberField: 230,
            dispersionCm: 11.5,
            dropCm: 7.14,
            zoom: 1,
            milsMultiplier: 1,
            reticleType: "Mil Lines"
        },
        validate: testFormYupValidator
    })

    function onClickSubmitForm() {
        const validation = form.validate();
        if (validation.hasErrors) {
            return
        }
        setResult(form.values)
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const zoom = form.values.zoom;

    useEffect(() => {

        const dispersionRadiusCm = form.values.dispersionCm;
        const distanceM = form.values.numberField;
        const zoom = form.values.zoom;
        const milsMultiplier = form.values.milsMultiplier;

        const paddingLeft = 40 * zoom
        const paddingTop = 40 * zoom

        const milAt100mInCm = 2.909;
        const centerOfFaceX = 150 + paddingLeft;
        const centerOfFaceY = 60 + paddingTop;

        const centerOfMassX = 137 + paddingLeft;
        const centerOfMassY = 160 + paddingTop;

        const crosshairLength = 10; // Half-length of each line (so total 20px long)

        const lengthCm = 16;
        const pixels = 45;
        const pixelsPerCm = pixels / lengthCm;

        const dispersionRadiusPx = pixelsPerCm * dispersionRadiusCm;


        function drawMilCrosshatchCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, multiplier: number) {

            const milsCount = 15;

            const milSpacing = milAt100mInCm * pixelsPerCm * zoom * multiplier
            const crosshairLength = milAt100mInCm * pixelsPerCm * milsCount * zoom * multiplier;
            const offset = 2 * zoom;

            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            const fontSize = 15 + (zoom * 1.5);
            ctx.font = `${fontSize}px Arial`;        // Set font and size

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - crosshairLength, y);
            ctx.lineTo(x + crosshairLength, y);
            ctx.stroke();

            for (let i = 1; i <= milsCount; i++) {

                const crossHatchSize = i % 5 !== 0 ? offset : offset * 2

                ctx.beginPath();
                ctx.moveTo(x - (i * milSpacing), y - crossHatchSize);
                ctx.lineTo(x - (i * milSpacing), y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x - (i * milSpacing), y + crossHatchSize * 3);
                }

                ctx.beginPath();
                ctx.moveTo(x + (i * milSpacing), y - crossHatchSize);
                ctx.lineTo(x + (i * milSpacing), y + crossHatchSize);
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + (i * milSpacing), y + crossHatchSize * 3.5);
                }
            }

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - crosshairLength);
            ctx.lineTo(x, y + crosshairLength);
            ctx.stroke();

            for (let i = 1; i <= milsCount; i++) {

                const crossHatchSize = i % 5 !== 0 ? offset : offset * 2

                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y - (i * milSpacing));
                ctx.lineTo(x + crossHatchSize, y - (i * milSpacing));
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + crossHatchSize, y - (i * milSpacing));
                }



                ctx.beginPath();
                ctx.moveTo(x - crossHatchSize, y + (i * milSpacing));
                ctx.lineTo(x + crossHatchSize, y + (i * milSpacing));
                ctx.stroke();
                if (i % 5 === 0) {
                    ctx.fillText(`${i}`, x + crossHatchSize, y + (i * milSpacing));
                }
            }
        }

        function drawMilDotCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyle: string, multiplier: number) {
            const milsCount = 4;

            const milSpacing = milAt100mInCm * pixelsPerCm * zoom * multiplier
            const crosshairLength = milAt100mInCm * pixelsPerCm * (milsCount + 1) * zoom * multiplier;

            const offset = 1.8 * zoom;
            const recBarSize = 7.5 * zoom

            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = strokeStyle;

            // Horizontal line
            ctx.beginPath();
            ctx.moveTo(x - crosshairLength, y);
            ctx.lineTo(x + crosshairLength, y);
            ctx.stroke();

            for (let i = 1; i <= milsCount; i++) {
                ctx.beginPath();
                ctx.arc(x - (i * milSpacing), y, offset, 0, 2 * Math.PI);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x + (i * milSpacing), y, offset, 0, 2 * Math.PI);
                ctx.fill();
            }

            ctx.fillRect(x - (5 * milSpacing), y - (recBarSize / 2), - 300, recBarSize);
            ctx.fillRect(x + (5 * milSpacing), y - (recBarSize / 2), 300, recBarSize);

            // Vertical line
            ctx.beginPath();
            ctx.moveTo(x, y - crosshairLength);
            ctx.lineTo(x, y + crosshairLength);
            ctx.stroke();

            for (let i = 1; i <= milsCount; i++) {
                ctx.beginPath();
                ctx.arc(x, y - (i * milSpacing), offset, 0, 2 * Math.PI);
                ctx.fill();

                ctx.beginPath();
                ctx.arc(x, y + (i * milSpacing), offset, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.fillRect(x - (recBarSize / 2), y + (5 * milSpacing), recBarSize, 300);
            ctx.fillRect(x - (recBarSize / 2), y - (5 * milSpacing), recBarSize, -300);
            // ctx.fillRect(x + (5 * milSpacing), y - (recBarSize / 2), 300, recBarSize);

        }

        function drawUnfilledMilDotCrosshair(ctx: CanvasRenderingContext2D, x: number, y: number, strokeStyleInner: string, multiplier: number) {
            const milsCount = 4;

            const milSpacing = milAt100mInCm * pixelsPerCm * zoom * multiplier

            const offset = 1.4 * zoom;
            const recBarSize = 7.5 * zoom

            ctx.strokeStyle = strokeStyleInner;

            for (let i = 0; i <= milsCount; i++) {
                // first mil dot steps
                if (i === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x - (i * milSpacing), y);
                    ctx.lineTo(x - ((i + 1) * milSpacing) + offset, y);
                    ctx.stroke();

                    // Right
                    ctx.beginPath();
                    ctx.moveTo(x + (i * milSpacing), y);
                    ctx.lineTo(x + ((i + 1) * milSpacing) - offset, y);
                    ctx.stroke();
                }
                // middile mildot steps
                else if (i > 0 && i < milsCount) {
                    ctx.beginPath();
                    ctx.moveTo(x - (i * milSpacing) - offset, y);
                    ctx.lineTo(x - ((i + 1) * milSpacing) + offset, y);
                    ctx.stroke();

                    // Right
                    ctx.beginPath();
                    ctx.moveTo(x + (i * milSpacing) + offset, y);
                    ctx.lineTo(x + ((i + 1) * milSpacing) - offset, y);
                    ctx.stroke();
                }
                else if (i === milsCount) {
                    ctx.beginPath();
                    ctx.moveTo(x - (i * milSpacing) - offset, y);
                    ctx.lineTo(x - ((i + 1) * milSpacing), y);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x + (i * milSpacing) + offset, y);
                    ctx.lineTo(x + ((i + 1) * milSpacing), y);
                    ctx.stroke();
                }
                if (i > 0) {
                    ctx.beginPath();
                    ctx.arc(x - (i * milSpacing), y, offset, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(x + (i * milSpacing), y, offset, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }



            // Vertical line
            ctx.strokeStyle = strokeStyleInner;
            for (let i = 0; i <= milsCount; i++) {
                if (i === 0) {
                    ctx.beginPath();
                    ctx.moveTo(x, y - (i * milSpacing));
                    ctx.lineTo(x, y - ((i + 1) * milSpacing) + offset);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x, y + (i * milSpacing));
                    ctx.lineTo(x, y + ((i + 1) * milSpacing) - offset);
                    ctx.stroke();
                }
                else if (i > 0 && i < milsCount) {
                    ctx.beginPath();
                    ctx.moveTo(x, y - (i * milSpacing) - offset);
                    ctx.lineTo(x, y - ((i + 1) * milSpacing) + offset);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x, y + (i * milSpacing) + offset);
                    ctx.lineTo(x, y + ((i + 1) * milSpacing) - offset);
                    ctx.stroke();
                }
                else if (i === milsCount) {
                    ctx.beginPath();
                    ctx.moveTo(x, y - (i * milSpacing) - offset);
                    ctx.lineTo(x, y - ((i + 1) * milSpacing));
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.moveTo(x, y + (i * milSpacing) + offset);
                    ctx.lineTo(x, y + ((i + 1) * milSpacing));
                    ctx.stroke();
                }
                if (i > 0) {
                    ctx.beginPath();
                    ctx.arc(x, y - (i * milSpacing), offset, 0, 2 * Math.PI);
                    ctx.stroke();

                    ctx.beginPath();
                    ctx.arc(x, y + (i * milSpacing), offset, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }


            ctx.strokeStyle = "black"
            ctx.beginPath();
            ctx.rect(x - (5 * milSpacing), y - (recBarSize / 2), - 300, recBarSize);
            ctx.stroke();

            ctx.rect(x + (5 * milSpacing), y - (recBarSize / 2), 300, recBarSize);
            ctx.stroke();

            ctx.rect(x - (recBarSize / 2), y + (5 * milSpacing), recBarSize, 300);
            ctx.stroke();

            ctx.rect(x - (recBarSize / 2), y - (5 * milSpacing), recBarSize, -300);
            ctx.stroke();

        }

        function drawDropCircle(ctx: CanvasRenderingContext2D, droppedY: number, dispersionRadiusCm: number, fillStyle: string) {

            const dispersionRadiusPx = pixelsPerCm * dispersionRadiusCm;

            ctx.beginPath();
            ctx.arc(centerOfFaceX * zoom, droppedY * zoom, dispersionRadiusPx * zoom, 0, 2 * Math.PI);      // x=100, y=75, radius=50
            ctx.fillStyle = fillStyle;                                       // Set fill color
            ctx.fill();                                                                     // Fill the circle

            ctx.strokeStyle = 'white';                                                      // Outline color
            ctx.lineWidth = 1;                                                              // Optional: line thickness
            ctx.stroke();
        }


        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas?.getContext('2d');
        if (!ctx) return;

        const image = new Image();
        image.src = '/scav_acc_template.png';

        const data80m = testData[9];
        const data100m = testData[11];
        const data150m = testData[17];
        const data200m = testData[22];

        const selectedDrop = data80m


        const dropCM = selectedDrop.Drop * 100;
        const dispersionCm = selectedDrop.MaxDispersion;



        image.onload = () => {
            ctx.fillStyle = 'rgb(20, 26, 34)';
            ctx.fillRect(0 , 0 , canvas.width, canvas.height)

            ctx.drawImage(image, 0 + paddingLeft, 0 + paddingTop, canvas.width * zoom, canvas.height * zoom); // Draw the image to fill the canvas

            const droppedY = centerOfFaceY - (dropCM * pixelsPerCm)


            // const droppedY_200m = centerOfFaceY - (data200m.Drop * 100 * pixelsPerCm)

            drawDropCircle(ctx, droppedY, dispersionCm, 'rgba(0, 110, 255, 0.10)')

            drawDropCircle(ctx, droppedY, dispersionCm * .75, 'rgba(9, 255, 0, 0.25)')

            drawDropCircle(ctx, droppedY, dispersionCm * .5, 'rgba(255, 0, 0, 0.5)')

            drawDropCircle(ctx, droppedY, dispersionCm * .25, 'rgba(255, 251, 0, .75)')

            drawDropCircle(ctx, droppedY, dispersionCm * .10, 'rgba(0, 0, 0, 0.8)')


            ctx.lineWidth = 2;
            // // Horizontal line
            // ctx.beginPath();
            // ctx.moveTo(centerOfFaceX - crosshairLength, centerOfFaceY);
            // ctx.lineTo(centerOfFaceX + crosshairLength, centerOfFaceY);
            // ctx.stroke();

            // // Vertical line
            // ctx.beginPath();
            // ctx.moveTo(centerOfFaceX, centerOfFaceY - crosshairLength);
            // ctx.lineTo(centerOfFaceX, centerOfFaceY + crosshairLength);
            // ctx.stroke();

            drawMilCrosshatchCrosshair(ctx, centerOfFaceX * zoom, centerOfFaceY * zoom, 'rgba(255, 0, 221, 0.25)', 1);
            if (form.values.reticleType === "Mil Lines") {
                drawMilCrosshatchCrosshair(ctx, centerOfFaceX * zoom, centerOfFaceY * zoom, 'rgb(255, 255, 255, 1)', milsMultiplier);
            }
            else if (form.values.reticleType === "Mil Dots") {
                drawMilDotCrosshair(ctx, centerOfFaceX * zoom, centerOfFaceY * zoom, 'rgba(255, 255, 255, 1)', milsMultiplier);
            }
            else if (form.values.reticleType === "Unfilled Mil Dots") {
                drawUnfilledMilDotCrosshair(ctx, centerOfFaceX * zoom, centerOfFaceY * zoom, 'rgb(255, 0, 0)', milsMultiplier);
            }

            ctx.fillStyle = 'white';        // Set text color to white
            ctx.font = '18px Arial';        // Set font and size
            // ctx.fillText('Distance: NUMBER', 250, 210);
            // ctx.fillText(`Distance: ${distanceM}m`, 250, 210);
            // ctx.fillText(`Dispersion Radius: ${dispersionRadiusCm}cm`, 250, 230);

            // // ctx.fillText('Tarkov MOA: NUMBER', 250, 230); // Draw text at (x=50, y=100)
            // ctx.fillText('Real Mils: NUMBER', 250, 250); // Draw text at (x=50, y=100)
            // ctx.fillText('Real MOA: NUMBER', 250, 270); // Draw text at (x=50, y=100)
            ctx.fillText('www.tarkovgunsmith.com/ballistic_calculator', 50, 500); // Draw text at (x=50, y=100)
        };
    }, [form])


    return (
        <>
            <TestFormContextProvider form={form}>
                <Stack spacing={"xs"} w={502}>
                    <Divider label="The Form!" labelPosition="center" />
                    <Input
                        {...form.getInputProps("stringField")}
                    />
                    <NumberInput
                        label="Distance"
                        {...form.getInputProps("numberField")}
                    />
                    <NumberInput
                        label="Drop cm"
                        {...form.getInputProps("dropCm")}
                    />
                    <NumberInput
                        label="Dispersion cm"
                        {...form.getInputProps("dispersionCm")}
                    />
                    <NumberInput
                        label="Zoom"
                        precision={2}
                        step={.1}
                        {...form.getInputProps("zoom")}
                    />
                    <NumberInput
                        label="Scope Mils Multiplier"
                        precision={2}
                        step={.01}
                        {...form.getInputProps("milsMultiplier")}
                    />

                    <Select
                        data={["Mil Lines", "Mil Dots", "Unfilled Mil Dots"]}
                        {...form.getInputProps("reticleType")}
                    />
                    {/* <Button
                        onClick={onClickSubmitForm}
                    >
                        Submit Form
                    </Button> */}
                </Stack>
                <canvas ref={canvasRef} width={600} height={600} style={{ border: '1px solid black' }} />
            </TestFormContextProvider>


        </>
    )
}