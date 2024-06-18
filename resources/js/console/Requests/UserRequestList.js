import React, {useState} from "react";
import {Badge, Box, Button, Group, LoadingOverlay, Modal, Stack, Table, Text} from "@mantine/core";
import dayjs from "dayjs";
import {UserInfo} from "../User/UserAvatar";
import axios from "axios";
import {useDisclosure} from "@mantine/hooks";

const UserRequestType = ({request}) => {
    switch(request.type) {
        case 'CreateTeam':
            return <Text>Create Team</Text>;
        case 'CreateWorkspace':
            return <Text>Create Workspace</Text>;
        case 'JoinTeam':
            return <Text size="sm">
                {request.user.firstname} is asking to join the Team {request.object?.fullname} ({request.object?.shortname})
            </Text>;
        case 'JoinWorkspace':
            return <Text>
                {request.user.firstname} is asking to join the Workspace
                {request.object?.name}</Text>;
    }

}

const UserRequestManage = ({request, onClose, updateRequest}) => {
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

const UserRequestStatus = ({status}) => {
    switch (status) {
        case 'Approved':
            return <Badge color="green" size="xs">{status}</Badge>;
        case 'Denied':
            return <Badge color="red" size="xs">{status}</Badge>;
        case 'Pending':
        default:
            return <Badge size="xs">{status}</Badge>;
    }
}

export default ({requests, updateRequest}) => {
    const [ moderateRequest, setModerateRequest ] = useState(null);

    return (
        <>
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
                {requests.map((r) =>
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
            {moderateRequest && <UserRequestManage request={moderateRequest}
                                                   updateRequest={updateRequest}
                                                   onClose={() => setModerateRequest(null)} />}
        </>

    )
}