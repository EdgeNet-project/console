import {ActionIcon, Text, Image, Stack, Table, Group} from "@mantine/core";
import React from "react";
import {GithubIcon} from "@mantinex/dev-icons";


const UserOAuth = ({user}) => {
    return (
        <Stack>
            You are authenticated with the following services:
            <Group justify="flex-start">
                {user.slices_info &&
                    <Image h={24} src="/images/slices/slices-ri-black-color.png" />
                }
                {user.github_id && <Group gap="xs"><GithubIcon size={24} /><Text>GitHub</Text></Group> }
            </Group>
        </Stack>

    )
}

export default UserOAuth;