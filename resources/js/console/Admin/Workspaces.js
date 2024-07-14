import {
    Table,
    Group,
    Title,
    Paper, Stack
} from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "axios";
import WorkspaceInfo from "../Workspaces/components/WorkspaceInfo";
import TeamInfo from "../Teams/components/TeamInfo";

export default () => {
    const [ workspaces, setWorkspaces ] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/workspaces')
            .then(({data}) => {
                setWorkspaces(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setWorkspaces([])
        }
    }, [])

    const rows = workspaces.map((item) => (
        <Table.Tr key={'node-' + item.name}>
            <Table.Td>
                <WorkspaceInfo workspace={item} />
            </Table.Td>
            <Table.Td>
                <TeamInfo team={item.tenant} />
            </Table.Td>
            <Table.Td>
            </Table.Td>
            <Table.Td>
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
                    <Title order={1}>EdgeNet Workspaces</Title>
                </Group>
            </Stack>
            <Paper p="md">
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Team</Table.Th>
                                <Table.Th></Table.Th>
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