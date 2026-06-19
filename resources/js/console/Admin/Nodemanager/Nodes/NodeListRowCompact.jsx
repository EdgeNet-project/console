import {
    Table,
    Text,
    Group, Stack, Popover, Button, Image,
} from '@mantine/core';
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

import NodeEnabled from "../../../Nodes/components/NodeEnabled";
import NodeStatus from "../../../Nodes/components/NodeStatus";

export default function NodeListRowCompact({item, handleEnable}) {

    return (
        <Table.Tr key={'node-' + item.name}>
            <Table.Td style={{verticalAlign:"top"}}>
                <div>
                    <Text size="sm" fw={500}>
                        {item.name}
                    </Text>
                    {item.location &&
                    <Group gap="xs">
                        {item.location && item.location.countryCode &&
                            <Image src={"/flags/4x3/"+item.location.countryCode.toLowerCase()+".svg"} width={20} height={12} />
                        }
                        <Text size="sm">
                            {item.location.regionCode} {item.location.regionName} {item.location.countryCode}
                        </Text>
                    </Group>}
                    {item.os &&
                    <Text size="sm">
                        {item.os.distro} {item.os.version}
                    </Text>}
                </div>
            </Table.Td>

            <Table.Td style={{verticalAlign:"top"}}>
                <div>
                    {item.public_ip_v4 &&
                    <Text size="sm">
                        {item.public_ip_v4}
                    </Text>}
                    {item.ipv6 &&
                    <Text size="sm">
                        {item.ip_v6}
                    </Text>}
                    {item.asn && <Group>
                        <Text size="sm" c="dimmed">
                            ASN
                        </Text>
                        <Text size="sm">
                            {item.asn}
                        </Text>
                    </Group>}
                </div>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <div>
                    {item.last_seen_at &&
                    <Text size="sm">
                        Last seen {dayjs(item.last_seen_at).fromNow()}
                    </Text>}
                </div>
            </Table.Td>
            <Table.Td>
                <Stack gap={5}>
                    <NodeStatus status={item.status}/>
                    <Popover width={200} position="bottom" withArrow shadow="md">
                        <Popover.Target>
                            <div style={{cursor: 'pointer'}}>
                                <NodeEnabled enabled={item.enabled} />
                            </div>
                        </Popover.Target>
                        <Popover.Dropdown>
                            <Stack gap="xs">
                                <Text size="sm">Manage node state</Text>
                                <Button
                                    size="xs"
                                    color={item.enabled ? "red" : "green"}
                                    onClick={() => handleEnable(item.id, !item.enabled)}
                                >
                                    {item.enabled ? "Disable" : "Enable"}
                                </Button>
                            </Stack>
                        </Popover.Dropdown>
                    </Popover>
                </Stack>
            </Table.Td>
        </Table.Tr>
    )
}