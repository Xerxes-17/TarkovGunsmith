import { NumberInput, Slider, Text } from "@mantine/core";
import { useBallisticSimulatorFormContext } from
    "../../../Pages/BallisticsSimulator.tsx/ballistic-simulator--form-context";
import { mockMaterials } from "../../../Types/ArmorTypes";

export function DurabilityAndMaxPair() {
    const form = useBallisticSimulatorFormContext();

    return (
        <>
            <div>
                <NumberInput
                    inputWrapperOrder={['label', 'error', 'input', 'description']}
                    label={
                        <Text size="sm">
                            Durability: <b>{((form.values.durability / form.values.maxDurability) * 100).toFixed(2)}%</b>
                        </Text>
                    }
                    description={
                        <>
                            <Slider
                                label={null}
                                precision={2}
                                max={form.values.maxDurability}
                                min={0}
                                step={1}
                                {...form.getInputProps('durability')}
                            />
                            <Text size="sm">
                                Effective Durability: <b>{(form.values.durability / mockMaterials.find(x => x.label === form.values.armorMaterial)!.destructibility).toFixed(2)} </b>
                            </Text>
                        </>
                    }
                    precision={2}
                    max={form.values.maxDurability}
                    min={0}
                    step={1}
                    {...form.getInputProps('durability')}
                />


            </div>
            <div >
                <NumberInput
                    label="Max Durability"
                    type="number"
                    precision={2}
                    max={90}
                    min={6}
                    step={1}
                    {...form.getInputProps('maxDurability')}
                    onChange={(value) => {
                        if (value) {
                            if (form.values.durability > value) {
                                form.setValues({ durability: value })
                            }
                            else if (form.values.durability === form.values.maxDurability) {
                                form.setValues({ durability: value })
                            }
                            form.setFieldValue("maxDurability", value);
                        }
                    }}
                />
                <Slider
                    label={null}
                    precision={2}
                    max={90}
                    min={6}
                    step={1}
                    {...form.getInputProps('maxDurability')}
                    onChange={(maxDura) => {
                        if (maxDura) {
                            if (form.values.durability > maxDura) {
                                form.setValues({ durability: maxDura })
                            }
                            else if (form.values.durability === form.values.maxDurability) {
                                form.setValues({ durability: maxDura })
                            }
                            form.setFieldValue("maxDurability", maxDura);
                        }
                    }}
                    onChangeEnd={(value) => {
                        if (value) {
                            if (form.values.durability > value) {
                                form.setValues({ durability: value })
                            }
                            form.setFieldValue("maxDurability", value);
                        }
                    }}
                />
            </div>
        </>
    )
}