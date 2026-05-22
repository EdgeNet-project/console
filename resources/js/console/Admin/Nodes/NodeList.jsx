import {
    Table,
    Text,
    Group, Stack,
} from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import NodeStatus from "../../Nodes/components/NodeStatus.jsx";

export default function NodeList() {
    const [ nodes, setNodes ] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('/api/node/list')
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
                <Stack gap="sm">
                    <div>
                        <Text size="sm" fw={500}>
                            {item.name}
                        </Text>
                    </div>
                    {item.location && <div>
                        <Text size="xs" c="dimmed">
                            Location
                        </Text>
                        <Text size="sm">
                            {item.location.regionCode} {item.location.regionName} {item.location.countryCode}
                        </Text>
                        <Text size="sm" c="blue">
                            {item.location.latitude} {item.location.longitude}
                        </Text>
                    </div>}
                </Stack>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Stack gap="xs">
                    {item.ip_v4 && <div>
                        <Text size="xs" c="dimmed">
                            Node IPv4
                        </Text>
                        <Text size="sm">
                            {item.ip_v4}
                        </Text>
                    </div>}
                    {item.wiregard && item.wiregard.ip && <div>
                        <Text size="xs" c="dimmed">
                            Node wiregard IP
                        </Text>
                        <Text size="sm">
                            {item.wiregard.ip}
                        </Text>
                    </div>}
                    {item.public_ip_v4 && <div>
                        <Text size="xs" c="dimmed">
                            Public IPv4
                        </Text>
                        <Text size="sm">
                            {item.public_ip_v4}
                        </Text>
                    </div>}
                    {item.ipv6 && <div>
                        <Text size="xs" c="dimmed">
                            Node IPv6
                        </Text>
                        <Text size="sm">
                            {item.ip_v6}
                        </Text>
                    </div>}
                    {item.asn && <div>
                        <Text size="xs" c="dimmed">
                            ASN
                        </Text>
                        <Text size="sm">
                            {item.asn}
                        </Text>
                    </div>}
                </Stack>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <Stack gap="xs">
                    {item.last_seen_at && <div>
                        <Text size="xs" c="dimmed">
                            Last seen
                        </Text>
                        <Text size="sm">
                            {dayjs(item.last_seen_at).format(' DD/MM/YYYY HH:mm:ssZ')}
                        </Text>
                    </div>}
                    {item.updated_at && <div>
                        <Text size="xs" c="dimmed">
                            Updated
                        </Text>
                        <Text size="sm">
                            {dayjs(item.updated_at).format(' DD/MM/YYYY HH:mm:ssZ')}
                        </Text>
                    </div>}
                    {item.installed_at && <div>
                        <Text size="xs" c="dimmed">
                            Installed
                        </Text>
                        <Text size="sm">
                            {dayjs(item.installed_at).format(' DD/MM/YYYY HH:mm:ssZ')}
                        </Text>
                    </div>}
                    {item.created_at && <div>
                        <Text size="xs" c="dimmed">
                            Created
                        </Text>
                        <Text size="sm">
                            {dayjs(item.created_at).format(' DD/MM/YYYY HH:mm:ssZ')}
                        </Text>
                    </div>}
                </Stack>


            </Table.Td>
            <Table.Td>
                <Group gap="xs">
                    <NodeStatus status={item.status}/>
                </Group>
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Node</Table.Th>
                        <Table.Th>Network</Table.Th>
                        <Table.Th>Last active</Table.Th>
                        <Table.Th>Status</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    );

}