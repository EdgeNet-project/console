import {useEffect, useState} from "react";
import {
    Table,
    Text,
    Group,
    Title,
    Paper, Stack
} from '@mantine/core';
import dayjs from "dayjs";
import axios from "axios";

import {UserInfo} from "../User/components/UserAvatar";

import ActivitySeverity from "../Activity/components/ActivitySeverity";
import ActivitySubject from "../Activity/components/ActivitySubject";

export default () => {
    const [ activity, setActivity ] = useState([]);

    useEffect(() => {
        axios.get('/api/admin/activity')
            .then(({data}) => {
                setActivity(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setActivity([])
        }
    }, [])

    const rows = activity.map((item) => (
        <Table.Tr key={'user-' + item.id}>
            <Table.Td style={{verticalAlign:"top"}}>
                {item.causer && <UserInfo user={item.causer} />}
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <Text size="sm">
                    {item.description}
                </Text>
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <ActivitySubject subject={item.subject} type={item.subject_type} />
            </Table.Td>
            <Table.Td style={{verticalAlign:"top"}}>
                <Stack>
                    <ActivitySeverity severity={item.properties.severity} />
                    <Text c="dimmed" size="sm">{dayjs(item.created_at).format(' DD/MM/YYYY HH:mm:ssZ')}</Text>
                </Stack>
            </Table.Td>

        </Table.Tr>
    ));

    return (
        <>
            <Stack my="lg">
                <Group justify="space-between">
                    <Title order={1}>Activity</Title>
                </Group>
            </Stack>
            <Paper p="md">
                <Table.ScrollContainer minWidth={800}>
                    <Table verticalSpacing="sm">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th>Name</Table.Th>
                                <Table.Th>Teams</Table.Th>
                                <Table.Th>Workspaces</Table.Th>
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