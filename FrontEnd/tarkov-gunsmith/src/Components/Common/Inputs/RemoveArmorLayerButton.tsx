import { Button, Tooltip } from "@mantine/core";
import { IconShieldMinus, IconShieldPlus } from "@tabler/icons-react";
import { useBallisticSimulatorFormContext } from "../../../Pages/BallisticsSimulator/ballistic-simulator-form-context";

interface AddArmorLayerButtonProps{
    index: number
}

export function RemoveArmorLayerButton({index}: AddArmorLayerButtonProps){
    const form = useBallisticSimulatorFormContext();

    function handleRemoveLayer(){
        const layers = [...form.values.armorLayers.slice(0, index), ...form.values.armorLayers.slice(index + 1)];

        form.setValues({armorLayers: layers})

        // form.setFieldValue(`armorLayers.${index+1}`, {
        //     armorClass: 2,
        //     bluntDamageThroughput: .2,
        //     durability: 20,
        //     maxDurability: 20,
        //     armorMaterial: "Aramid"
        // })
    }

    return (
        <Tooltip label="Remove this layer" position={"bottom"} transitionProps={{ transition: 'slide-up', duration: 300 }} data-html2canvas-ignore>
            <Button color="red" variant="light" onClick={() => handleRemoveLayer()} data-html2canvas-ignore>
                <IconShieldMinus size="1.2rem" />&nbsp;&nbsp;Remove
            </Button>
        </Tooltip>
    )
}