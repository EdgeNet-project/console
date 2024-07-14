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

import NodeStatus from "../Nodes/components/NodeStatus";
import NodeType from "../Nodes/components/NodeType";
import NodeAddresses from "../Nodes/components/NodeAddresses";
import NodeCapacity from "../Nodes/components/NodeCapacity";
import NodeInfo from "../Nodes/components/NodeInfo";

export default function NodeList() {
    const [ nodes, setNodes ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/admin/nodes')
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
        <Table.Tr key={'node-' + item.name}>
            <Table.Td>
                <Group gap="sm">
                    <NodeType type={item.type} />
                    <div>
                        <Text size="sm" fw={500}>
                            <Anchor component={Link} to={"/admin/nodes/" + item.name}>
                                {item.name}
                            </Anchor>
                        </Text>
                        <NodeAddresses addresses={item.status?.addesses} />
                    </div>
                </Group>
            </Table.Td>

            <Table.Td>
                <Text size="sm">
                    <NodeCapacity capacity={item.status?.capacity} />
                </Text>
            </Table.Td>
            <Table.Td>
                <NodeInfo nodeInfo={item.status?.nodeInfo} />
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
                    <Title order={1}>EdgeNet Nodes</Title>
                </Group>
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