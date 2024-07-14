import {useState} from "react";
import {ActionIcon, Badge, Modal, ScrollArea, Stack, Table} from "@mantine/core";
import {UserInfo} from "./UserAvatar";
import {IconEdit} from "@tabler/icons";
import UserFormManage from "./UserFormManage";
import {useDisclosure} from "@mantine/hooks";
import {useAuthentication} from "../Authentication";
import UserEnabled from "./components/UserEnabled";
import UserAdmin from "./components/UserAdmin";


export default ({users}) => {
    const { user } = useAuthentication()
    const [ selectedUser, setSelectedUser ] = useState(null)
    const [opened, { open, close }] = useDisclosure(false, {
        // onOpen: () => console.log('Opened'),
        // onClose: () => setSelectedUser(null),
    });

    const handleUser = (user) => {
        setSelectedUser(user)
        open()
    }

    if (!users) {
        return null;
    }

    return (
        <>
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
                                    <UserAdmin admin={userItem.admin} />
                                    <UserEnabled enabled={userItem.enabled} />
                                    <Badge size="xs" color="pink" variant="light">
                                        {userItem.role}
                                    </Badge>
                                </Stack>
                            </td>
                            <td>
                                {user.id !== userItem.id && handleUser && <ActionIcon onClick={()=> handleUser(userItem)} variant="subtle" color="blue">
                                    <IconEdit size="1rem" />
                                </ActionIcon>}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </ScrollArea>
            <Modal opened={opened} onClose={close} title="Manage user">
                <UserFormManage user={selectedUser} close={close} />
            </Modal>
        </>
    )
}