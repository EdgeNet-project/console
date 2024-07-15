import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import axios from "axios";
import {Group, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import WorkspaceUsers from "./WorkspaceUsers";
import WorkspaceKubeConfig from "./WorkspaceKubeConfig";
import {useAuthentication} from "../Authentication";
import WorkspaceInfo from "./components/WorkspaceInfo";
import WorkspacePods from "./WorkspacePods";
import PanelGrid from "../Components/PanelGrid";


export default () => {
    const {user} = useAuthentication()
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
                    <WorkspaceKubeConfig workspace={workspace} />
                    {/*<Button onClick={() => navigate('/nodes/create')}>Add a Node</Button>*/}
                </Group>
                <WorkspaceInfo workspace={workspace} />
                <Text size="sm">
                    A workspace is a logical unit to organize your projects and DevOps projects and
                    manage app templates and app repositories. It is the place for you to control
                    resource access and share resources within your team in a secure way.
                </Text>
            </Stack>

            <PanelGrid>
                <WorkspaceUsers workspace={workspace} />
                <WorkspacePods workspace={workspace} />
            </PanelGrid>
        </Stack>
    )
}