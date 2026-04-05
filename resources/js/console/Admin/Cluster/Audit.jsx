import {useEffect, useState} from "react";
import {
    Table,
    Text, Box
} from '@mantine/core';
import dayjs from "dayjs";
import axios from "axios";

const ResponseStatus = ({code, reason}) => {
    const color =
            code.startsWith("2") ? "green" :
            code.startsWith("3")  ? "blue" :
            (code ? "red" : "gray");
    return <Text size="sm" c={color}>{code || '???'} {reason}</Text>
}

export default () => {
    const [ events, setEvents ] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/audit')
            .then(({data}) => {
                setEvents(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setEvents([])
        }
    }, [])

    const rows = events.map((item) => (
        <Table.Tr key={'user-' + item.id}>
            <Table.Td style={{verticalAlign:"top"}}>
                <Box>
                    <Text size="sm" fw={700}>{item.username}</Text>
                    <Text size="xs" c="dimmed" truncate="end">{item.user_agent}</Text>
                </Box>

                <Box mt="xs" w={300}>
                    <Text size="sm">{dayjs(item.request_received_at).format(' DD/MM/YYYY HH:mm:ssZ')}</Text>
                    <Text size="sm" c="dimmed" truncate="end">
                        {item.request_uri}
                    </Text>
                    <Text size="sm">
                        {item.source_ips.map(ip => <div>{ip}</div>)}
                    </Text>
                </Box>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <Box w={300}>
                    <Text size="sm" c="dimmed" truncate="end">
                        {item.namespace}
                    </Text>
                    <Text size="sm">
                        {item.verb} {item.resource}{item.resource_name && "/" + item.resource_name}{""}
                    </Text>
                </Box>
                <Box mt="xs">
                    <ResponseStatus code={item.response_code}
                                    reason={item.response_reason} />
                    <Text size="sm">
                        {item.response_status}
                    </Text>
                </Box>
            </Table.Td>
        </Table.Tr>
    ));

    return (

                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>User / Request</Table.Th>
                                <Table.Th>Resource / Response</Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>{rows}</Table.Tbody>
                    </Table>
                </Table.ScrollContainer>

    );

}