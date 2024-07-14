import {
    Table,
    Text,
    Group,
    Title,
    Paper, Stack
} from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "axios";
import {UserInfo} from "../User/components/UserAvatar";
import TeamInfo from "../Teams/components/TeamInfo";
import UserAdmin from "../User/components/UserAdmin";
import UserEnabled from "../User/components/UserEnabled";
import WorkspaceInfo from "../Workspaces/components/WorkspaceInfo";
import UserRole from "../User/components/UserRole";

export default () => {
    const [ users, setUsers ] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/users')
            .then(({data}) => {
                setUsers(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setUsers([])
        }
    }, [])

    const rows = users.map((item) => (
        <Table.Tr key={'user-' + item.id}>
            <Table.Td style={{verticalAlign:"top"}}>
                <Group gap="sm">
                    <div>
                        <Text size="sm" fw={500}>
                            <UserInfo user={item} />
                        </Text>
                    </div>
                </Group>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Stack>
                    {item.tenants.map(team => <div>
                        <TeamInfo team={team} />
                        <UserRole role={team.pivot?.role} />
                    </div>)}
                </Stack>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <Stack>
                    {item.sub_namespaces.map(workspace => <div>
                        <WorkspaceInfo workspace={workspace} />
                        <UserRole role={workspace.pivot?.role} />
                    </div>)}
                </Stack>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <UserAdmin admin={item.admin} />
                <UserEnabled enabled={item.enabled} />
            </Table.Td>

        </Table.Tr>
    ));

    return (
        <>
            <Stack my="lg">
                <Group justify="space-between">
                    <Title order={1}>EdgeNet Users</Title>
                </Group>
            </Stack>
            <Paper p="md">
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Teams</Table.Th>
                                <Table.Th>Workspaces</Table.Th>
                                <Table.Th>Status</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>
        </>
    );

}