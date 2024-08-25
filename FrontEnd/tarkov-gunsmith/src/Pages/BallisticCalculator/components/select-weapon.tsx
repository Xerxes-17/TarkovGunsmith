import { Select, Text } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";


export function SelectDopeWeapon() {
    const form = useBallisticCalculatorFormContext();

    const selectedCaliber = form.values.dopeTableSelections.caliberName;
    const isCaliberNotSelected = selectedCaliber === "";
    const weapons = form.values.dopeTableOptions.calibers.find(x=>x.caliberName === selectedCaliber)?.weaponsOfCaliber;

    const options = weapons?.map(weapon => {
        return {
            value: weapon.id,
            label: weapon.shortName
        }
    }).sort((a, b) => a.label.localeCompare(b.label)) ?? [];

    const selectedWeapon = weapons?.find(x=>x.id === form.values.dopeTableSelections.weaponId);

    function handleWeaponSelection(value: string){
        if(form.values.dopeTableSelections.weaponId === value){
            return
        }
        
        const selectedWeapon = weapons?.find(x=>x.id === value);
        if(!selectedWeapon){
            console.log("No Weapon found with Id, go yell at Xerxes on the discord about it.")
            return
        }

        if (form.values.dopeTableSelections.weaponId !== value) {
            form.setFieldValue("dopeTableSelections.barrelId", null)
            form.setFieldValue("dopeTableSelections.barrelObj", undefined);
        }

        form.setFieldValue("dopeTableSelections.weaponId", value)
        form.setFieldValue("dopeTableSelections.weaponObj", selectedWeapon);
        form.setFieldValue("dopeTableSelections.defaultAmmo", selectedWeapon.defaultAmmo);
    }
    
        
    return (
        <Select
            w={200}
            disabled={isCaliberNotSelected}
            inputWrapperOrder={['label', 'input','description', 'error' ]}
            label="Select Weapon"
            placeholder="Step Two"
            data={options}
            description={
                <Text size="sm" opacity={0.70}>
                    Velocity Modifier: <b>{selectedWeapon?.velocityModifier ?? 0}</b>
                </Text>
            }
            {...form.getInputProps("dopeTableSelections.weaponId")}
            onChange={(value) => {
                if (typeof (value) === "string") {
                    handleWeaponSelection(value)
                }
            }}
        />
    )

}