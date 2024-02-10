import { useDisclosure } from '@mantine/hooks';
import { Drawer, Button, Group, Title } from '@mantine/core';
import { ReactNode } from 'react';
import { SearchSelectAmmoTable } from '../Tables/SearchSelectAmmoTable';


export interface DrawerButtonProps {
    buttonLabel: string
    leftIcon?: ReactNode
}

export function DrawerButton({ buttonLabel, leftIcon }: DrawerButtonProps) {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Drawer.Root opened={opened} onClose={close} zIndex={2001} size="lg">
                <Drawer.Overlay zIndex={1000}/>
                <Drawer.Content>
                    <Drawer.Header>
                        <Drawer.Title><Title order={4}>Search Projectile - Click to select</Title></Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
                    <Drawer.Body >
                        <SearchSelectAmmoTable CloseDrawerCb={close}/>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>

            <Group position="center">
                <Button variant='light' onClick={open} leftIcon={leftIcon}>{buttonLabel}</Button>
            </Group>
        </>
    );
}