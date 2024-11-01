import {Link, useNavigate} from "react-router-dom";
import {Alert, Anchor, Button, Divider, Group, Paper, Stack, Table, Text, Title} from "@mantine/core";
import {IconInfoCircle, IconServer} from "@tabler/icons-react";
import axios from "axios";
import {useEffect, useState} from "react";
import NodeStatus from "../Nodes/components/NodeStatus";

const UserNodesAlert = () => {

    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have any nodes yet!" color="blue">
            <Text size="sm">
                You can contribute new nodes to the EdgeNet cluster. We support Virtual Machines,
                bare metal servers or single board computers.
                <br />
                You can add a new node here:
                <br />
                <Anchor component={Link} to="/nodes/create">
                    Add a new node
                </Anchor>
            </Text>

        </Alert>
    )
}

const UserNodes = () => {
    const [ nodes, setNodes ] = useState([]);

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

    if (!nodes || nodes.length <= 0) {
        return <UserNodesAlert />
    }

    return (
        <Table>
            <Table.Tbody>
                {nodes.map(node =>
                    <Table.Tr key={"usernodes_"+node.id}>
                        <Table.Td>
                            <Text size="xs" c="dimmed">
                                {node.ip_v4}
                            </Text>
                            <Text size="md">
                                <Anchor component={Link} to={"/nodes/" + node.name}>{node.name}</Anchor>
                            </Text>
                        </Table.Td>
                        <Table.Td>
                            <NodeStatus status={node.status} />
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    )
}


export default () => {
    const navigate = useNavigate();

    return (
        <Paper p="md">
            <Stack>
                <Group justify="flex-start">
                    <IconServer />
                    <Title order={2} size="h4">Your nodes</Title>
                </Group>
                <UserNodes />
                <Divider />
                <Group justify="flex-end">
                    <Button size="xs" onClick={() => navigate('/nodes/create')}>Add a Node</Button>
                </Group>
            </Stack>
        </Paper>
    )
}