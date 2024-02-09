import { Button, Tooltip } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";
import html2canvas from "html2canvas";

const handleImageDownload = async (elementId:string, fileName:string) => {
    const element: any = document.getElementById(elementId),
        canvas = await html2canvas(element, {backgroundColor: "#1A1B1E"}),
        data = canvas.toDataURL('image/png'),
        link = document.createElement('a');

    link.href = data;
    link.download = `${fileName}_${Date.now()}.png`

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

interface DownloadElementImageButtonProps {
    targetElementId: string
    fileName: string
}

export function DownloadElementImageButton({targetElementId, fileName}: DownloadElementImageButtonProps) {
    return (
        <Tooltip label="Download simulation as image" position={"bottom"} transitionProps={{ transition: 'slide-up', duration: 300 }} data-html2canvas-ignore>
            <Button variant="outline" leftIcon={<IconDownload size="1.2rem" />} onClick={() => handleImageDownload(targetElementId, fileName)} data-html2canvas-ignore>
                Download
            </Button>
        </Tooltip>
    )
}