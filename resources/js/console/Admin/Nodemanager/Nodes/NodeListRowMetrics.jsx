import {
    Table,
    Text,
    Group, Stack, Image, ActionIcon,
} from '@mantine/core';

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

import NodeEnabled from "../../../Nodes/components/NodeEnabled";
import NodeStatus from "../../../Nodes/components/NodeStatus";
import {IconMapPinFilled} from "@tabler/icons-react";

export default function NodeListRowMetrics({item, handleEnable}) {
    const metrics = item.current_metrics;

    const formatBytes = (bytes) => {
        if (!bytes && bytes !== 0) return 'N/A';
        const numericBytes = parseFloat(bytes);
        if (isNaN(numericBytes) || numericBytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(numericBytes) / Math.log(k));
        return parseFloat((numericBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatRate = (bytesPerSec) => {
        if (!bytesPerSec && bytesPerSec !== 0) return 'N/A';
        const numericBytes = parseFloat(bytesPerSec);
        if (isNaN(numericBytes) || numericBytes === 0) return '0 B';
        return formatBytes(numericBytes) + '/s';
    };

    return (
        <Table.Tr key={'node-' + item.name}>
            <Table.Td style={{verticalAlign:"top"}}>
                <div>
                    <Text size="sm" fw={500}>
                        {item.name}
                    </Text>
                    {item.last_seen_at &&
                    <Text size="xs" c="dimmed">
                        Last seen {dayjs(item.last_seen_at).fromNow()}
                    </Text>}
                    {item.location && <Group gap="xs">
                        {item.location && item.location.countryCode &&
                            <Image src={"/flags/4x3/"+item.location.countryCode.toLowerCase()+".svg"} width={20} height={12} />
                        }
                        <Text size="sm">
                            {item.location.regionCode} {item.location.regionName} {item.location.countryCode}
                            <ActionIcon component="a" href={" https://www.google.com/maps/place/"+item.location.latitude+","+item.location.longitude+"/@"+item.location.latitude+","+item.location.longitude+",6z"} target="_blank" rel="noreferrer" variant="subtle" aria-label="Google Maps">
                                <IconMapPinFilled color="pink" size={14} />
                            </ActionIcon>
                        </Text>
                    </Group>}
                </div>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Stack gap={0}>
                    <Text size="sm">
                        {metrics?.cpu_usage_percent ? (
                        <>
                            <span style={{
                                display: 'inline-block',
                                width: '8px',
                                height: '8px',
                                borderRadius: '50%',
                                marginRight: '6px',
                                marginBottom: '1px',
                                backgroundColor:
                                    metrics.cpu_usage_percent > 90 ? '#fa5252' :
                                    metrics.cpu_usage_percent > 70 ? '#fd7e14' :
                                    metrics.cpu_usage_percent > 50 ? '#fab005' :
                                    '#51cf66'
                            }} />
                            CPU: {metrics.cpu_usage_percent}%
                        </>
                        ) : 'CPU: N/A'}
                    </Text>
                    <Text size="xs" c="dimmed">
                        Load: {metrics?.load_1 ?? 'N/A'} {metrics?.load_5 ?? 'N/A'} {metrics?.load_15 ?? 'N/A'}
                    </Text>
                </Stack>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Stack gap={0}>
                    <Text size="sm">
                        RX: {formatRate(metrics?.network_rx_bytes_per_sec)}
                    </Text>
                    <Text size="sm">
                        TX: {formatRate(metrics?.network_tx_bytes_per_sec)}
                    </Text>
                </Stack>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <Stack gap={0}>
                    <Text size="sm">
                        Read: {formatRate(metrics?.disk_read_bytes_per_sec)}
                    </Text>
                    <Text size="sm">
                        Write: {formatRate(metrics?.disk_write_bytes_per_sec)}
                    </Text>
                </Stack>
            </Table.Td>

            <Table.Td>
                <Stack gap={5}>
                    <NodeStatus status={item.status}/>
                    <NodeEnabled enabled={item.enabled} />
                </Stack>
            </Table.Td>
        </Table.Tr>
    )
}
