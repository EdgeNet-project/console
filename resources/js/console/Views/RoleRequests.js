import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import {Button, Group, Paper, ScrollArea, Stack, Table, Text, Title} from "@mantine/core";
import axios from "axios";
import {IconBuilding, IconUser} from "@tabler/icons";

const RoleRequest = ({item}) => {

    return (
        <tr key={item.metadata.name}>
            <td>
                <Group spacing="sm">
                    <IconUser size={20}/>
                    <div>
                        <Text size="sm" weight={500}>
                            {item.spec.firstname} {item.spec.lastname}
                        </Text>
                        <Text size="xs" color="dimmed">
                            {item.spec.email}
                        </Text>
                    </div>
                </Group>
            </td>
            <td>
                {item.spec.roleref.name}
            </td>
            <td>
                <Text size="sm" weight={500}>
                    {item.status.state}
                </Text>
                <Text size="xs" color="dimmed">
                    {item.status.message}
                </Text>
                <Text size="xs" color="dimmed">
                    {item.status.expiry}
                </Text>
            </td>
            <td>
                <Group>
                <Button color="teal">Approve</Button>
                <Button color="red">Deny</Button>
                </Group>
            </td>
        </tr>

    )
}

export default function RoleRequests() {
    const { user } = useAuthentication();
    const [ roleRequests, setRoleRequests ] = useState([])

    useEffect(() => {
        axios.get('/api/requests/roles/cslash', {
            // params: { ...queryParams, page: current_page + 1 },
            // paramsSerializer: qs.stringify,
        })
            .then(({data}) => {
                console.log(data)
                setRoleRequests(data);
                // this.setState({
                //     ...data, loading: false
                // });
            })
            .catch(error => {
                console.log(error)
            });
    }, []);
    //console.log(roleRequests)
    return (
        <Stack spacing="sm">
            <Title>Requests</Title>
            <Text size="sm">Pending requests from users that ask to join your organization(s) will be shown here.</Text>
            {user.tenants.map(tenant =>
                <Paper key={tenant.id} shadow="xs" p="md">
                    <Text size="md"><IconBuilding size={20} /> {tenant.fullname}</Text>
                    <ScrollArea>
                        <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Role</th>
                                <th></th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {roleRequests.map((item) => <RoleRequest key={item.metadata.name} item={item} />)}
                            </tbody>
                        </Table>
                    </ScrollArea>
                </Paper>
            )}
        </Stack>
    )
}