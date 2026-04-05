import {
    Table,
    Text,
    Group,
} from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";

import NodeType from "../../Nodes/components/NodeType";
import NodeAddresses from "../../Nodes/components/NodeAddresses";
import NodeCapacity from "../../Nodes/components/NodeCapacity";
import NodeInfo from "../../Nodes/components/NodeInfo";

const TempNodeInfo = ({node}) => {
    switch (node) {
        case 'be-west-01.nodes.planetlab.io':
            return <Text size="sm" c="dimmed">
                IMEC - SLICES<br />
                Belgium

            </Text>
        case 'br-east-01.nodes.planetlab.io':
            return <Text size="sm" c="dimmed">
                Universidade Federal de Mato Grosso do Sul<br />
                Brasil
            </Text>
        case 'de-ni-5793.edge-net.io':
            return <Text size="sm" c="dimmed">
                Universität Passau<br />
                Germany
            </Text>
        case 'jp-west-01.nodes.planetlab.io':
            return <Text size="sm" c="dimmed">
                Kyoto University<br />
                Japan
            </Text>
        case 'eurydice.edge-net.io':
        case 'hades.edge-net.io':
        case 'orpheus.edge-net.io':
            return <Text size="sm" c="dimmed">
                Sorbonne Université<br />
                France
            </Text>
    }
}
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
            <Table.Td style={{verticalAlign:"top"}}>
                <Group gap="sm">
                    <NodeType type={item.type} />
                    <div>
                        <Text size="sm" fw={500}>
                                {item.name}
                        </Text>
                        <NodeAddresses addresses={item.status?.addesses} />
                        <TempNodeInfo node={item.name} />
                    </div>
                </Group>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Text size="sm">
                    <NodeCapacity capacity={item.status?.capacity} />
                </Text>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
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
    );

}