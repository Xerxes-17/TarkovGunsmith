import { Button, Tooltip, Space } from '@mantine/core';
import { IconShieldPlus } from "@tabler/icons-react";
import { useBallisticSimulatorFormContext } from "../../../Pages/BallisticsSimulator/ballistic-simulator-form-context";

interface AddArmorLayerButtonProps{
    index: number
}

export function AddArmorLayerButton({index}: AddArmorLayerButtonProps){
    const form = useBallisticSimulatorFormContext();

    function handleAddLayer(){
        form.setFieldValue(`armorLayers.${index+1}`, {
            armorClass: 2,
            bluntDamageThroughput: 20,
            durability: 20,
            maxDurability: 20,
            armorMaterial: "Aramid"
        })
    }

    return (
        <Tooltip label={`max of ${form.values.maxLayers} layers`} position={"bottom"} transitionProps={{ transition: 'slide-up', duration: 300 }} data-html2canvas-ignore>
            <Button variant="light" onClick={() => handleAddLayer()} data-html2canvas-ignore>
                <IconShieldPlus size="1.2rem" />&nbsp;&nbsp;Add
            </Button>
        </Tooltip>
    )
}