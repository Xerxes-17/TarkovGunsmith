import { Group, Select, Text } from "@mantine/core";
import { useBallisticSimulatorFormContext } from
    "../../../Pages/BallisticsSimulator.tsx/ballistic-simulator--form-context";

import { forwardRef } from "react";
import { mockMaterials } from "../../../Types/ArmorTypes";

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
    image: string;
    label: string;
    destructibility: string;
    explosionDestructibility: string;
}

const SelectItem = forwardRef<HTMLDivElement, ItemProps>(
    ({ image, label, destructibility, ...others }: ItemProps, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                <div>
                    <Text size="sm">{label}</Text>
                    <Text size="xs" opacity={0.65}>
                        Destructibility: {destructibility}
                    </Text>
                </div>
            </Group>
        </div>
    )
);

const sortedMockMats = mockMaterials.sort((a,b) => a.destructibility - b.destructibility)

export function ArmorMaterialSelect() {
    const form = useBallisticSimulatorFormContext();

    return (
        <Select
            inputWrapperOrder={['label', 'error', 'input', 'description']}
            label="Armor Material"
            description={
                <Text size="sm">
                    Destructibility: <b>{mockMaterials.find(x => x.label === form.values.armorMaterial)!.destructibility} </b>
                </Text>
            }
            placeholder="Pick one"
            dropdownPosition="flip"
            itemComponent={SelectItem}
            data={sortedMockMats}
            {...form.getInputProps('armorMaterial')}
        />
    )
}