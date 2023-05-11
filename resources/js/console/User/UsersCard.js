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
import {UserInfo} from "./UserAvatar";
import {useDisclosure} from "@mantine/hooks";
import {useForm} from "@mantine/form";
import {IconUserShield, IconUserUp} from "@tabler/icons-react";
import UserFormManage from "./UserFormManage";
import {useAuthentication} from "../Authentication";


export default ({team, users}) => {
    const [ selectedUser, setSelectedUser ] = useState(null)
    const [opened, { open, close }] = useDisclosure(false, {
        // onOpen: () => console.log('Opened'),
        // onClose: () => setSelectedUser(null),
    });
    const { user } = useAuthentication()

    useEffect(() => {
        if (selectedUser) {
            // form.setValues({
            //     enabled: selectedUser.enabled,
            //     role: 'collaborator',
            // })
        }
    }, [selectedUser])



    const manageUser = (user) => {
        setSelectedUser(user)
        open()
    }

    console.log(selectedUser)

    return (
        <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Group mb="xs">
                    <IconUsers color="teal" />
                    <Text weight={500}>Users</Text>
                    <Badge color="pink" variant="light">
                        {users.length}
                    </Badge>
                </Group>

                <Text size="sm" color="dimmed">
                    Users under {team?.name}
                </Text>

                <ScrollArea>
                    <Table highlightOnHover verticalSpacing="xs">
                        <tbody>
                        {users.map(userItem =>
                            <tr key={userItem.id}>
                                <td>
                                    <UserInfo user={userItem} />
                                </td>
                                <td>
                                    <Stack align="flex-start" justify="flex-start" spacing="xs">
                                        {userItem.enabled ?
                                            <Badge size="xs">Enabled</Badge> :
                                            <Badge size="xs" color="gray">Disabled</Badge>
                                        }
                                        <Badge size="xs" color="pink" variant="light">
                                            {userItem.role}
                                        </Badge>
                                    </Stack>
                                </td>
                                <td>
                                    {(user.id !== userItem.id && user.role !== 'collaborator') && <ActionIcon onClick={()=> manageUser(userItem)} variant="subtle" color="blue">
                                        <IconEdit size="1rem" />
                                    </ActionIcon>}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </Table>
                </ScrollArea>

                <Stack>
                    <Divider my="md" />
                    <InviteUsersDialog />
                </Stack>
            </Card>
            <Modal opened={opened} onClose={close} title="Manage user">
                <UserFormManage user={selectedUser} close={close} />
            </Modal>
        </>
    )
}