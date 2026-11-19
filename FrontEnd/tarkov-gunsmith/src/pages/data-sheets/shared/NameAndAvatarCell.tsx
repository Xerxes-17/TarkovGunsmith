import { MRT_Cell, MRT_Row } from "mantine-react-table";
import { createHitZoneValues_ArmorTableRow } from "../../../utils/armorHelpers";
import { Avatar, Box } from "@mantine/core";
import { lightShield, heavyShield, noneShield } from "../../../components/tgIcons";
import { NewArmorTableRow } from "../../../types/armorTypes";

export function NameAndAvatarCell(
    renderedCellValue: React.ReactNode,
    row: MRT_Row<NewArmorTableRow>,
    showAvatar: boolean
) {
    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
            }}
        >
            <Avatar
                alt="avatar"
                size={'md'}
                src={`https://assets.tarkov.dev/${row.original.id}-icon.webp`}
                // style={{ display: pix && manualGrouping.length === 0 ? "block" : "none" }}
                hidden={!showAvatar}
            >
                {row.original.type === "Light" && lightShield}
                {row.original.type === "Heavy" && heavyShield}
                {row.original.type === "None" && noneShield}
            </Avatar>
            <span>{renderedCellValue}</span>
        </Box>
    )
}