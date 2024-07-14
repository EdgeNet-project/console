import React, {useEffect, useState} from "react";
import {useParams} from "react-router";
import axios from "axios";
import {Alert, Anchor, Breadcrumbs, Button, Divider, Group, Paper, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import {
    IconAlertCircle, IconAlertTriangle, IconArrowRight, IconCheck,
} from "@tabler/icons";
import WorkspaceUsers from "./WorkspaceUsers";
import WorkspaceKubeConfig from "./WorkspaceKubeConfig";
import {Link} from "react-router-dom";
import {useAuthentication} from "../Authentication";
import WorkspaceInfo from "./WorkspaceInfo";
import WorkspacePods from "./WorkspacePods";


const RequestsAlert = () => {
    const {user, userRequests} = useAuthentication();

    if (user.requests.length <= 0 && userRequests <= 0) {
        return null;
    }

    return (
        <Alert icon={<IconAlertTriangle size="1.5rem"/>} title="Pending requests" color="orange" variant="light">
            {user.requests.length > 0 && <Text size="sm">
                You have <Anchor component={Link} to="/requests">{user.requests.length} {user.requests.length > 1 ? 'requests' : 'request'}</Anchor> pending for review.
            </Text>}
            {userRequests.length > 0 && <Text size="sm">
                You are managing one or more Teams and you have <Anchor component={Link} to="/requests">{userRequests.length} pending {userRequests.length > 1 ? 'requests' : 'request'}</Anchor> to review.
            </Text>}
        </Alert>
    )
}

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
                    <Title order={1}></Title>
                    <WorkspaceKubeConfig workspace={workspace} />
                    {/*<Button onClick={() => navigate('/nodes/create')}>Add a Node</Button>*/}
                </Group>
                <WorkspaceInfo workspace={workspace} />

            </Stack>

            <SimpleGrid cols={2}>
                <WorkspaceUsers workspace={workspace} />
                <WorkspacePods workspace={workspace} />
            </SimpleGrid>
        </Stack>
    )
}