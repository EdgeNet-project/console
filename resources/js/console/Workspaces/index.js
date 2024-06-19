import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import axios from "axios";
import {Alert, Anchor, Breadcrumbs, Button, Divider, Group, Paper, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import {
    IconAlertCircle, IconAlertTriangle, IconArrowRight, IconCheck,
} from "@tabler/icons";
import WorkspaceUsers from "./WorkspaceUsers";


export default () => {
    const { id } = useParams()
    const [ workspace, setWorkspace ] = useState(null)

    useEffect(() => {
        axios.get('/api/subnamespaces/' + id)
            .then(({data}) => {
                setWorkspace(data)
            })
    }, [id])

    if (!workspace) {
        return null;
    }

    return (
        <Stack>

            <Stack my="lg">
                <Group justify="space-between">
                    <Title order={1}>Workspace → {workspace.name}</Title>
                    {/*<Button onClick={() => navigate('/nodes/create')}>Add a Node</Button>*/}
                </Group>
                <Text size="sm">
                    {workspace.team.fullname} <br />
                    {workspace.team.city}, {workspace.team.country} <br />
                    <Anchor target="_blank" href={workspace.team.url}>{workspace.team.url}</Anchor>
                </Text>
                <Text>

                </Text>
            </Stack>


            {/*<TeamCard team={teamResource} />*/}
            {/*<WorkspaceCard workspace={workspaceResource} />*/}


            <SimpleGrid cols={2}>
                <WorkspaceUsers workspace={workspace} />
                {/*<UsersCard title={'Users under ' + workspace?.name} users={users} />*/}
                {/*<WorkspacesCard team={workspace} workspaces={subnamespaces} />*/}
            </SimpleGrid>
        </Stack>
    )
}