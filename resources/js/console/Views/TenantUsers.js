import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import {Group, Paper, ScrollArea, Stack, Table, Text, Title} from "@mantine/core";
import axios from "axios";
import {IconBuilding, IconUser} from "@tabler/icons";
import {useWorkspace} from "../Application/Workspace";

const User = ({item}) => {

    return (
        <tr>
            <td>
                <Group spacing="sm">
                    <IconUser size={20}/>
                    <div>
                        <Text size="sm" weight={500}>
                            {item.firstname} {item.lastname}
                        </Text>
                        <Text size="xs" color="dimmed">
                            {item.email}
                        </Text>
                    </div>
                </Group>
            </td>
            <td>
                {item.pivot.roles.map(role=>role)}
            </td>
            <td>

            </td>
            <td>
                <Text size="sm" weight={500}>
                </Text>
                <Text size="xs" color="dimmed">
                </Text>
                <Text size="xs" color="dimmed">
                </Text>
            </td>
        </tr>

    )
}

export default function TenantUsers() {
    const { user } = useAuthentication();
    const [ users, setUsers ] = useState([])
    const {namespace} = useWorkspace()

    useEffect(() => {
        axios.get('/api/tenants/'+namespace+'/users', {
            // params: { ...queryParams, page: current_page + 1 },
            // paramsSerializer: qs.stringify,
        })
            .then(({data}) => {
                console.log(data)
                setUsers(data);
                // this.setState({
                //     ...data, loading: false
                // });
            })
            .catch(error => {
                console.log(error)
            });
    }, []);

    return (
        <Stack spacing="sm">
            <Title>Users</Title>
            <Text size="sm">

            </Text>
            {user.tenants.map(tenant =>
                <Paper key={tenant.id} shadow="xs" p="md">
                    <Text size="md"><IconBuilding size={20} /> {tenant.fullname}</Text>
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
                        {users.map((item) => <User key={item.id} item={item} />)}
                        </tbody>
                    </Table>
                </Paper>
            )}
        </Stack>
    )
}