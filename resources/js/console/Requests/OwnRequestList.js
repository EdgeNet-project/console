import React, {useEffect, useState} from "react";
import {Group, Paper, Table, Text} from "@mantine/core";
import dayjs from "dayjs";
import axios from "axios";
import UserRequestType from "./UserRequestType";
import UserRequestStatus from "./UserRequestStatus";


export default ({requests, updateRequest}) => {
    const [ownRequests, setOwnRequests] = useState([]);

    useEffect(() => {
        axios.get('/api/user/requests')
            .then(({data}) => {
                setOwnRequests(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setOwnRequests([])
        }
    }, []);

    if (!ownRequests || ownRequests.length <= 0) {
        return null;
    }

    return (
        <>
            <Text>
                The following are the requests that you have initiated and their status.
            </Text>
            <Paper p="md">
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Request</Table.Th>
                            <Table.Th></Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {ownRequests.map((r) =>
                            <Table.Tr key={'own-request-' + r.id}>
                                <Table.Td>
                                    <Text c="dimmed" size="sm">{dayjs(r.created_at).format('DD/MM/YYYY HH:mm')}</Text>
                                    <UserRequestType request={r} />
                                </Table.Td>
                                <Table.Td>
                                    {r.message && <Text size="sm">{r.message}</Text>}
                                    {r.data && r.data.map((k, v) => <Group><Text size="sm" c="dimmed">{k}</Text><Text size="sm">{v}</Text></Group>)}
                                </Table.Td>
                                <Table.Td>
                                    <UserRequestStatus status={r.status} />
                                </Table.Td>
                            </Table.Tr>
                        )}
                    </Table.Tbody>
                </Table>
            </Paper>
        </>


    )
}