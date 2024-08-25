import { Select, Text } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";

export function SelectDopeBarrel() {
    const form = useBallisticCalculatorFormContext();

    const selectedCaliber = form.values.dopeTableSelections.caliberName;
    const weapons = form.values.dopeTableOptions.calibers.find(x => x.caliberName === selectedCaliber)?.weaponsOfCaliber;
    const selectedWeapon = form.values.dopeTableSelections.weaponId;

    const isWeaponNotSelected = selectedWeapon === "";
    const barrels = weapons?.find(x => x.id === selectedWeapon)?.possibleBarrels;

    const options = barrels?.map(barrel => {
        return {
            value: barrel.id,
            label: barrel.shortName
        }
    }).sort((a, b) => a.label.localeCompare(b.label)) ?? [];

    const isNoBarrels = options.length === 0;
    if(isNoBarrels){
        options.push({
            value: "n/a",
            label: "n/a"
        })

        if(form.values.dopeTableSelections.barrelId !== "n/a"){
            form.setFieldValue("dopeTableSelections.barrelId", "n/a")
            form.setFieldValue("dopeTableSelections.barrelObj", undefined)
        }
    }

    const selectedBarrel = barrels?.find(x => x.id === form.values.dopeTableSelections.barrelId);

    function handleBarrelSelection(value: string){
        if(form.values.dopeTableSelections.barrelId === value){
            return
        }

        const newBarrel = barrels?.find(x => x.id === value);

        if(!newBarrel){
            console.log("No barrel found with Id, go yell at Xerxes on the discord about it.")
            return
        }

        form.setFieldValue("dopeTableSelections.barrelId", value)
        form.setFieldValue("dopeTableSelections.barrelObj", newBarrel);
    }
    
    return (
        <Select
            disabled={isWeaponNotSelected || isNoBarrels}
            inputWrapperOrder={['label', 'input','description', 'error' ]}
            label="Select Barrel"
            placeholder="Step Three"
            data={options}
            description={
                <Text size="sm" opacity={0.70}>
                    Velocity Modifier: <b>{selectedBarrel?.velocityModifier ?? 0} </b>
                </Text>
            }
            {...form.getInputProps("dopeTableSelections.barrelId")}
            onChange={(value) => {
                if (typeof (value) === "string") {
                    handleBarrelSelection(value)
                }
            }}
        />
    )

}