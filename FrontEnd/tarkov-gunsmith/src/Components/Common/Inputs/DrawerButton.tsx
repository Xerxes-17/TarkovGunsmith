import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Group, Title, Tooltip } from '@mantine/core';
import { ReactNode } from 'react';
import { SearchSelectAmmoTable } from '../Tables/SearchSelectAmmoTable';
import { SearchSelectArmorTable } from '../Tables/SearchSelectArmorTable';


export interface DrawerButtonProps {
    buttonLabel: string | ReactNode
    leftIcon?: ReactNode
    ammorOrArmor: "ammo" | "armor"
    armorIndex?: number
}



export function DrawerButton({ buttonLabel, leftIcon, ammorOrArmor, armorIndex }: DrawerButtonProps) {
    const [opened, { open, close }] = useDisclosure(false);

    const ammoContent = (
        <>
            <Drawer.Header>
                <Drawer.Title><Title order={4}>Search Projectile - Click to select</Title></Drawer.Title>
                <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body >

                <SearchSelectAmmoTable CloseDrawerCb={close} />
            </Drawer.Body>
        </>
    )

    const armorContent = (
        <>
            <Drawer.Header>
                <Drawer.Title><Title order={4}>Search Armor - Click to select</Title></Drawer.Title>
                <Drawer.CloseButton />
            </Drawer.Header>
            <Drawer.Body >
                <SearchSelectArmorTable CloseDrawerCb={close} layerIndex={armorIndex !== undefined ? armorIndex : 1} />
            </Drawer.Body>
        </>
    )

    return (
        <>
            <Drawer.Root opened={opened} onClose={close} zIndex={2001} size={ammorOrArmor === "ammo" ? "lg" : "1300px"}>
                <Drawer.Overlay zIndex={1000} />
                <Drawer.Content>
                    {ammorOrArmor === "ammo" && (
                        ammoContent
                    )}
                    {ammorOrArmor === "armor" && (
                        armorContent
                    )}
                </Drawer.Content>
            </Drawer.Root>

            <Tooltip label="Search" transitionProps={{ transition: 'slide-up', duration: 300 }} data-html2canvas-ignore>
                <Group position="center">
                    <Button variant='light' size={"xs"} onClick={open}>{leftIcon}</Button>
                </Group>
            </Tooltip>

        </>
    );
}