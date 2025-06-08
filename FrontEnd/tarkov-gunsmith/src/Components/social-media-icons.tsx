import { Group, Center, UnstyledButton, ActionIcon } from "@mantine/core";
import { IconBrandDiscordFilled, IconBrandGithubFilled, IconBrandXFilled } from "@tabler/icons-react";

export function SocialMediaIcons() {

    return (
        <Group>
            <Center inline>
                <Group spacing={"xs"}>
                    <UnstyledButton
                        component="a"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://discord.gg/F7GZE4H7fq"
                    >
                        <ActionIcon
                            variant="filled"
                            color='blurple.3'
                            size={"30px"}
                        >
                            <IconBrandDiscordFilled size="1.5rem" />
                        </ActionIcon>
                    </UnstyledButton>

                    <UnstyledButton
                        component="a"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://github.com/Xerxes-17/TarkovGunsmith"
                    >
                        <ActionIcon
                            variant="filled"
                            radius={"sm"}
                            size={"30px"}
                        >
                            <IconBrandGithubFilled size="1.5rem" />
                        </ActionIcon>
                    </UnstyledButton>

                    <UnstyledButton
                        component="a"
                        target="_blank"
                        rel="noopener noreferrer"
                        href="https://x.com/TarkovGunsmith"
                    >
                        <ActionIcon variant="filled" color='dark' size={"30px"}>
                            <IconBrandXFilled size="1.5rem" />
                        </ActionIcon>
                    </UnstyledButton>
                </Group>
            </Center>
        </Group>
    )
}