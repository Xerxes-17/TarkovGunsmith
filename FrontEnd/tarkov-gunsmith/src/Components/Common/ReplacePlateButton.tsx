import { forwardRef } from 'react';
import { Group, Avatar, Text, Select, Menu, Button } from '@mantine/core';
import { IconArrowsLeftRight, IconMessageCircle, IconPhoto, IconRowRemove, IconSearch, IconSettings, IconTrash } from '@tabler/icons-react';

export function ReplacePlateButton(props: any) {
    const compatibleInSlotIds = props.compatibleInSlotIds;

    
  return (
    <Menu shadow="md" width={200} withinPortal={true}>
      <Menu.Target>
        <Button size={'sm'} compact>Replace</Button>
      </Menu.Target>

      <Menu.Dropdown >
        <Menu.Item>Settings</Menu.Item>
        <Menu.Item>Messages</Menu.Item>
        <Menu.Item>Gallery</Menu.Item>
        <Menu.Item color="red" icon={<IconRowRemove size={14} />}>No Plate</Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}