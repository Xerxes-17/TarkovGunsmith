import { Button, Tooltip } from "@mantine/core";
import { IconCopy } from "@tabler/icons-react";
import { copyImageToClipboard } from "copy-image-clipboard";
import html2canvas from "html2canvas";

const handleCopyImage = async (elementId:string) => {
    try {
        const element: any = document.getElementById(elementId),
            canvas = await html2canvas(element, {backgroundColor: "#1A1B1E"}),
            data = canvas.toDataURL('image/png');

        if (data) await copyImageToClipboard(data)
    } catch (e: any) {
        if (e?.message) alert(e.message)
    }
}

interface DownloadElementImageButtonProps {
    targetElementId: string
}

export function CopyElementImageButton({targetElementId}: DownloadElementImageButtonProps) {
    return (
        <Tooltip label="Copy simulation as image to clipboard" position={"bottom"} transitionProps={{ transition: 'slide-up', duration: 300 }} data-html2canvas-ignore>
            <Button variant="outline" leftIcon={<IconCopy size="1.2rem" />} onClick={() => handleCopyImage(targetElementId)} data-html2canvas-ignore>
                Copy
            </Button>
        </Tooltip>
    )
}