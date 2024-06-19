import React, {useEffect, useState} from "react";
import {Badge, Box, Button, Group, LoadingOverlay, Modal, Paper, Stack, Table, Text} from "@mantine/core";
import dayjs from "dayjs";
import {UserInfo} from "../User/UserAvatar";
import axios from "axios";
import {useDisclosure} from "@mantine/hooks";
import UserRequestType from "./UserRequestType";
import UserRequestStatus from "./UserRequestStatus";

const UserRequestManage = ({request, onClose}) => {
    const [visible, { toggle }] = useDisclosure(false);

    const manageRequest = (action, message) => {
        toggle()
        axios.patch('/api/requests/' + request.id, {
                action: action
            })
            .then(({data}) => {
                updateRequest(data)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                onClose()
            })
    }
    const approveRequest = () => manageRequest('approve')

    const denyRequest = () => manageRequest('deny')

    return (
        <Modal opened={true} onClose={onClose} title="Manage Request" centered>
            <Box pos="relative">
                <LoadingOverlay visible={visible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Stack>
                    <UserInfo user={request.user} />
                    <UserRequestType request={request} />

                    <Group>
                        <Button color="green" onClick={approveRequest}>Approve</Button>
                        <Button color="red" onClick={denyRequest}>Deny</Button>
                        <Button color="gray" variant="subtle" onClick={onClose}>Cancel</Button>
                    </Group>
                </Stack>
            </Box>
        </Modal>
    )
}



export default () => {
    const [ moderateRequest, setModerateRequest ] = useState(null);
    const [userRequests, setUserRequests] = useState([]);

    useEffect(() => {
        axios.get('/api/requests')
            .then(({data}) => {
                setUserRequests(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setUserRequests([])
        }
    }, []);

    const updateRequest = (request) => {
        const idx = userRequests.findIndex(i => i.id === request.id);
        if (idx !== -1) {
            setUserRequests(
                userRequests.slice(0, idx)
                    .concat([request])
                    .concat(userRequests.slice(idx + 1))
            );
        }
    }

    if (!userRequests || userRequests.length <= 0) {
        return null;
    }

    return (
        <>
            <Text>
                You are an admin for one or more of the teams you are part of, as such you can manage
                pending requests from other users for your team.
            </Text>
            <Paper p="md">
                <Table>
                    <Table.Thead>
                    <Table.Tr>
                        <Table.Th>User</Table.Th>
                        <Table.Th>Request</Table.Th>
                        <Table.Th></Table.Th>
                        <Table.Th>Status</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                    {userRequests.map((r) =>
                        <Table.Tr key={'user-request-' + r.id}>
                            <Table.Td>
                                <UserInfo user={r.user} />
                            </Table.Td>
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
                            <Table.Td>
                                <Button size="xs" variant="subtle" onClick={() => setModerateRequest(r)}>Manage</Button>
                            </Table.Td>
                        </Table.Tr>
                    )}
                    </Table.Tbody>
                </Table>
            </Paper>
            {moderateRequest && <UserRequestManage request={moderateRequest}
                                                   updateRequest={updateRequest}
                                                   onClose={() => setModerateRequest(null)} />}
        </>

    )
}