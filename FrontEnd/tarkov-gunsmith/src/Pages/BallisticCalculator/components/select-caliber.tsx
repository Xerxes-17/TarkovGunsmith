import { Select, Text } from "@mantine/core";
import { mapAmmoCaliberFullNameToLabel } from "../../../Types/AmmoTypes";
import { useBallisticCalculatorFormContext } from "../ballistic-calculator-form-context";
import {  IconSearch } from "@tabler/icons-react";

export function SelectDopeCaliber() {
    const form = useBallisticCalculatorFormContext();
    
    const options = form.values.dopeTableOptions.calibers.map(caliber => {
        return {
            value: caliber.caliberName,
            label: mapAmmoCaliberFullNameToLabel(caliber.caliberName)
        }
    }).sort((a, b) => a.label.localeCompare(b.label));

    function handleCaliberSelection(value: string) {
        if (form.values.dopeTableSelections.caliberName === value) {
            return
        }

        const selectedCaliber = form.values.dopeTableOptions.calibers?.find(x => x.caliberName === value);

        if (!selectedCaliber) {
            console.log("No caliber found with Id, go yell at Xerxes on the discord about it.")
            return
        }

        if (form.values.dopeTableSelections.caliberName !== "") {
            form.reset()
        }
        form.setFieldValue("dopeTableSelections.caliberName", value)
        form.setFieldValue("dopeTableSelections.caliberObj", selectedCaliber);
    }

    return (
        <Select
            w={210}
            inputWrapperOrder={['label', 'input', 'description', 'error'  ]}
            label="Select Caliber"
            placeholder="Step One"
            data={options}
            description={
                <Text size="sm" opacity={0.70}>
                    <br/>
                </Text>
            }
            icon={<IconSearch size={16}/>}
            searchable
            {...form.getInputProps("dopeTableSelections.caliberName")}
            onChange={(value) => {
                if (typeof (value) === "string") {
                    handleCaliberSelection(value)
                }
            }}
        />
    )

}
