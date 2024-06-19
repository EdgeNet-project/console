import {
    Table,
    Progress,
    Anchor,
    Text,
    Group,
    ScrollArea,
    Badge,
    Container,
    Button,
    Title,
    ActionIcon, Paper, Stack
} from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "axios";
import {IconInfoCircle, IconServer} from "@tabler/icons";
import {Link, useNavigate} from "react-router-dom";
import NodeStatus from "./NodeStatus";
import NodeType from "./NodeType";

const NodeAddresses = ({addresses}) => addresses.map((address, i) => <div key={'n-address-'+i}>
        <i>{address.type}</i> {address.address}</div>)

const NodeCapacity = ({capacity}) => <>
    <i>CPUs</i> {capacity.cpu}, <i>RAM</i> {capacity.memory}<br />
    <i>Storage</i> {capacity['ephemeral-storage']}<br />
    <i>PODs</i> {capacity.pods}
</>

const NodeInfo = ({nodeInfo}) => <>
    <i>Architecture</i> {nodeInfo.architecture}<br />
    <i>OS</i> {nodeInfo.operatingSystem}&nbsp;{nodeInfo.osImage}<br />
    <i>Version</i> {nodeInfo.kubeletVersion}
</>

export default function NodeList() {
    const [ nodes, setNodes ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/nodes')
            .then(({data}) => {
                setNodes(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setNodes([])
        }
    }, [])

    const rows = nodes.map((item) => (
        <Table.Tr key={'node-' + item.id}>
            <Table.Td>
                <Group gap="sm">
                    <NodeType type={item.type} />
                    <div>
                        <Text fz="sm" fw={500}>
                            <Anchor component={Link} to={"/nodes/" + item.id}>
                                {item.name ? item.name : "awaiting installation"}
                            </Anchor>
                        </Text>
                        <Text fz="xs" c="dimmed">
                            {item.ip_v4}
                        </Text>
                        <Text fz="xs" c="dimmed">
                            {item.ip_v6}
                        </Text>
                    </div>
                </Group>
            </Table.Td>

            <Table.Td>
                <Text fz="sm" fw={500}>
                    {item.type}
                </Text>
                <Text fz="xs" c="dimmed">

                </Text>
                {/*<Select*/}
                {/*    data={rolesData}*/}
                {/*    defaultValue={item.role}*/}
                {/*    variant="unstyled"*/}
                {/*    allowDeselect={false}*/}
                {/*/>*/}
            </Table.Td>
            <Table.Td>{item.lastActive}</Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <NodeStatus status={item.status}/>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            <Stack my="lg">
                <Group justify="space-between">
                    <Title order={1}>Nodes</Title>
                    <Button onClick={() => navigate('/nodes/create')}>Add a Node</Button>
                </Group>
                <Text>
                    The list of nodes you have contributed to EdgeNet.
                </Text>
            </Stack>
            <Paper p="md">
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Node</Table.Th>
                                <Table.Th>Type</Table.Th>
                                <Table.Th>Last active</Table.Th>
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