import {
    Table,
    Text,
    Group, Stack, Image, ActionIcon,
} from '@mantine/core';
import {IconMapPinFilled} from '@tabler/icons-react';

import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime);

import NodeEnabled from "../../console/Nodes/components/NodeEnabled";
import NodeStatus from "../../console/Nodes/components/NodeStatus";

const Row = ({item}) => {

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
                                {item.location.cityName} {item.location.regionName && "(" + item.location.regionName + ")"} {item.location.countryName}
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
                    {item.created_at &&
                        <Text size="sm">
                            Created {dayjs(item.created_at).fromNow()}
                        </Text>}
                    {item.last_seen_at &&
                        <Text size="sm">
                            Last seen {dayjs(item.last_seen_at).fromNow()}
                        </Text>}
                    {item.uptime &&
                        <Text size="sm">
                            Uptime {dayjs(item.uptime).fromNow()}
                        </Text>}
                </div>
            </Table.Td>
            <Table.Td>
                <Stack gap={5}>
                    <NodeStatus status={item.status}/>
                </Stack>
            </Table.Td>
        </Table.Tr>
    )
}

const List = ({nodes}) => {

    return (
        <Table.ScrollContainer minWidth={800} maxHeight="80vh">
            <Table verticalSpacing="sm">
                {nodes.map((node) => <Row item={node} />)}
            </Table>
        </Table.ScrollContainer>
    )
}

export default List;