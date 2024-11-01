import {
    Badge,
    Text,
    Card,
    Group,
} from "@mantine/core";
import {IconEdit, IconUser, IconUsers} from "@tabler/icons-react";
import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import UserList from "./UserList";


export default ({title, users}) => {
    const { user } = useAuthentication()



    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="xs">
                <IconUsers color="teal" />
                <Text weight={500}>Users</Text>
                <Badge color="pink" variant="light">
                    {users.length}
                </Badge>
            </Group>

            <Text size="sm" color="dimmed">
                {title}
            </Text>
            <UserList users={users} />
            {/*<Stack>*/}
            {/*    <Divider my="md" />*/}
            {/*    <InviteUsersDialog />*/}
            {/*</Stack>*/}
        </Card>
    )
}