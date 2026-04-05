import {useEffect, useState} from "react";
import {
    Table,
    Text, Box
} from '@mantine/core';
import dayjs from "dayjs";
import axios from "axios";

export default () => {
    const [ flows, setFlows ] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/flow')
            .then(({data}) => {
                setFlows(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setFlows([])
        }
    }, [])

    const rows = flows.map((item) => (
        <Table.Tr key={'flow-' + item.id}>
            <Table.Td style={{verticalAlign:"top"}}>
                <Box>
                    <Text size="sm" fw={700}>{dayjs(item.flowStartSeconds).format('DD/MM/YYYY HH:mm:ss')}</Text>
                    <Text size="xs" c="dimmed">End: {dayjs(item.flowEndSeconds).format('DD/MM/YYYY HH:mm:ss')}</Text>
                    {item.flowEndReason && <Text size="xs" c="dimmed">Reason: {item.flowEndReason}</Text>}
                </Box>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Box>
                    <Text size="xs" fw={700}>Source:</Text>
                    <Text size="sm">{item.sourcePodNamespace}/{item.sourcePodName}</Text>
                    <Text size="xs" c="dimmed">{item.sourcePodLabels}</Text>

                    <Text size="xs" fw={700} mt="xs">Destination:</Text>
                    <Text size="sm">
                        {item.destinationPodName ? `${item.destinationPodNamespace}/${item.destinationPodName}` : 'External/Service'}
                    </Text>
                    <Text size="xs" c="dimmed">{item.destinationPodLabels}</Text>
                </Box>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Box>
                    <Text size="sm">{item.sourceNodeName}</Text>
                    <Text size="sm" fw={700}>{item.sourceIP}</Text>
                    <Text size="xs" c="dimmed">Port: {item.sourceTransportPort}</Text>
                </Box>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Box>
                    {item.destinationNodeName &&
                        <Text size="sm">Node: {item.destinationNodeName}</Text>
                    }
                    {item.egressNodeName &&
                        <Text size="xs" c="dimmed">Egress: {item.egressNodeName}</Text>
                    }
                    <Text size="sm" fw={700}>{item.destinationIP}</Text>
                    <Text size="xs" c="dimmed">Port: {item.destinationTransportPort}</Text>
                    {item.destinationClusterIP && (
                        <Text size="xs" c="dimmed">ClusterIP: {item.destinationClusterIP}</Text>
                    )}
                    {item.destinationServicePortName && (
                        <Text size="xs" c="dimmed">Svc: {item.destinationServicePortName} ({item.destinationServicePort})</Text>
                    )}
                </Box>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Box>
                    <Text size="xs" fw={700}>Traffic:</Text>
                    <Text size="sm">{item.octetTotalCount} bytes ({item.packetTotalCount} pkts)</Text>
                    {item.throughput > 0 && (
                        <Text size="xs" c="dimmed">TP: {item.throughput.toFixed(2)} bps</Text>
                    )}
                    <Text size="xs" fw={700} mt="xs">Protocol:</Text>
                    <Text size="sm">{item.protocolIdentifier} ({item.tcpState || 'N/A'})</Text>
                </Box>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Box>
                    {item.ingressNetworkPolicyName && (
                        <Box mb="xs">
                            <Text size="xs" fw={700} c="blue">Ingress Policy:</Text>
                            <Text size="xs">{item.ingressNetworkPolicyNamespace}/{item.ingressNetworkPolicyName}</Text>
                            <Text size="xs" c="dimmed">Rule: {item.ingressNetworkPolicyRuleName} ({item.ingressNetworkPolicyRuleAction === 1 ? 'Allow' : 'Drop'})</Text>
                        </Box>
                    )}
                    {item.egressNetworkPolicyName && (
                        <Box>
                            <Text size="xs" fw={700} c="orange">Egress Policy:</Text>
                            <Text size="xs">{item.egressNetworkPolicyNamespace}/{item.egressNetworkPolicyName}</Text>
                            <Text size="xs" c="dimmed">Rule: {item.egressNetworkPolicyRuleName} ({item.egressNetworkPolicyRuleAction === 1 ? 'Allow' : 'Drop'})</Text>
                        </Box>
                    )}
                </Box>
            </Table.Td>
        </Table.Tr>
    ));

    return (

        <Table.ScrollContainer minWidth={1200}>
            <Table verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Time / Duration</Table.Th>
                        <Table.Th>Pod (Src/Dst)</Table.Th>
                        <Table.Th>Source</Table.Th>
                        <Table.Th>Destination</Table.Th>
                        <Table.Th>Metrics / Protocol</Table.Th>
                        <Table.Th>Network Policy</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>

    );

}