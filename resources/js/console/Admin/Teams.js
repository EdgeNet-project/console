import {
    Table,
    Group,
    Title,
    Paper, Stack
} from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "axios";
import TeamInfo from "../Teams/components/TeamInfo";
import {UserInfo} from "../User/components/UserAvatar";
import WorkspaceInfo from "../Workspaces/components/WorkspaceInfo";
import UserRole from "../User/components/UserRole";

export default function TeamList() {
    const [ teams, setTeams ] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/teams')
            .then(({data}) => {
                setTeams(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setTeams([])
        }
    }, [])

    const rows = teams.map((item) => (
        <Table.Tr key={'team-' + item.id}>
            <Table.Td style={{verticalAlign:"top"}}>
                <TeamInfo team={item} />
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <Stack>
                    {item.users.map(user => <UserInfo user={user} role={user.pivot?.role} />)}
                </Stack>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <Stack>
                    {item.sub_namespaces.map(workspace => <WorkspaceInfo workspace={workspace} />)}
                </Stack>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                {/*<Group gap="xs">*/}
                {/*    <NodeStatus status={item.status}/>*/}
                {/*</Group>*/}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Stack my="lg">
                <Group justify="space-between">
                    <Title order={1}>EdgeNet Teams</Title>
                </Group>
            </Stack>
            <Paper p="md">
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Users</Table.Th>
                                <Table.Th>Workspaces</Table.Th>
                                <Table.Th></Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>
            </Paper>
        </>
    );

}