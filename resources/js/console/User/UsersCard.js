import {
    Badge,
    Text,
    Card,
    Group,
    Table,
    ScrollArea,
    Divider,
    Stack,
    Switch,
    Modal,
    ActionIcon,
    Center, Box, SegmentedControl, Button, Radio, Checkbox
} from "@mantine/core";
import {IconEdit, IconUser, IconUsers} from "@tabler/icons";
import React, {useEffect, useState} from "react";
import InviteUsersDialog from "./InviteUsersDialog";
import {UserInfo} from "./components/UserAvatar";
import {useDisclosure} from "@mantine/hooks";
import {useForm} from "@mantine/form";
import {IconUserShield, IconUserUp} from "@tabler/icons-react";
import UserFormManage from "./UserFormManage";
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