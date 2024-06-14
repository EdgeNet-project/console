import {Link, useNavigate} from "react-router-dom";
import {Alert, Anchor, Button, Divider, Group, Paper, Stack, Text} from "@mantine/core";
import {IconAlertTriangle, IconInfoCircle, IconServer} from "@tabler/icons";
import {useAuthentication} from "../Authentication";
import axios from "axios";
import {useEffect, useState} from "react";
import NodeStatus from "../Node/NodeStatus";

const UserNodes = () => {
    const { user } = useAuthentication();


}

const NodesAlert = () => {

    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have any nodes yet!" color="blue">
            <Text mt="xl">
                You can contribute new nodes to the EdgeNet cluster. We support Virtual Machines,
                bare metal servers or single board computers.
            </Text>
            <Text mt="xl">
                You can add a new node here:
            </Text>
            <Anchor component={Link} to="/nodes/create">
                Add a new node
            </Anchor>

        </Alert>
    )
}
export default () => {
    const [ nodes, setNodes ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/nodes')
            .then(({data}) => {
                console.log(data)
                setNodes(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setNodes([])
        }
    }, [])

    return (
        <Paper p="md">
            <Stack>
                <Group justify="flex-start">
                    <IconServer />
                    <Text size="sm">Your Nodes</Text>
                </Group>

                {!nodes ? <NodesAlert /> : nodes.map((node) =>
                    <Group justify="space-between">
                        <div>
                            <Text fz="sm" fw={500}>
                                <Anchor component={Link} to={"/nodes/" + node.hostname}>{node.hostname}</Anchor>
                            </Text>
                            <Text fz="xs" c="dimmed">
                                {node.public_ip_v4}
                            </Text>
                        </div>
                        <NodeStatus />
                    </Group>
                )}
                <Divider />
                <Group justify="flex-end">
                <Button size="xs" onClick={() => navigate('/nodes/create')}>Add a Node</Button>
                </Group>
            </Stack>
        </Paper>
    )
}