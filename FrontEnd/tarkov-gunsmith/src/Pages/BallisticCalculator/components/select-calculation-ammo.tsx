import { Select } from "@mantine/core";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";
import { AmmoSelectItem } from "./ammo-select-item";


export function SelectCalculationDopeAmmo() {
    const form = useBallisticCalculatorFormContext();
    const ammos = form.values.dopeTableSelections.caliberObj?.allAmmosOfCaliber;

    const options = ammos?.map(data => {
        return {
            value: data.stats.id,
            // label: `${data.ammoLabel} - ${data.stats.initialSpeed.toFixed(0)} m/s` ,
            label: `${data.ammoLabel}` ,
            description: `Speed: ${data.stats.initialSpeed.toFixed(0)} m/s, Pen: ${data.stats.penetration}, Dam: ${data.stats.damage}`
        }
    }).sort((a, b) => a.label.localeCompare(b.label)) ?? []

    function handleAmmoSelection(value: string){
        if(form.values.dopeTableSelections.calculationAmmoId === value){
            return
        }
        const newAmmoObj = ammos?.find(x => x.stats.id === value)
        if(!newAmmoObj){
            console.log("No calc-ammo found with Id, go yell at Xerxes on the discord about it.")
            return
        }
        form.setFieldValue("dopeTableSelections.calculationAmmoId", value)
        form.setFieldValue("dopeTableSelections.calculationAmmoObj", newAmmoObj);
    }

    return (
        <Select
            disabled = {form.values.dopeTableSelections.caliberName === ""}
            label="Calculation Ammo"
            placeholder="Step Four"
            data={options}

            itemComponent={AmmoSelectItem}

            {...form.getInputProps("dopeTableSelections.calculationAmmoId")}
            onChange={(value) => {
                if (typeof (value) === "string") {
                    handleAmmoSelection(value)
                }
            }}
        />
    )

}
