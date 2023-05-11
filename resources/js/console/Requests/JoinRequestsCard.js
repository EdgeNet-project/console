import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import {Button, Group, Paper, ScrollArea, Stack, Table, Text, Title} from "@mantine/core";
import axios from "axios";
import {IconBoxPadding as IconWorkspace, IconBuilding, IconUser} from "@tabler/icons";
import {UserInfo} from "../User/UserAvatar";

const RoleRequest = ({item, handleRequest}) => {



    return (
        <tr key={item.metadata.name}>
            <td>
                <UserInfo user={item.spec} />
            </td>
            <td>
                {item.spec.roleref.name}
            </td>
            <td>
                <Text size="sm" weight={500}>
                    {item.status?.state}
                </Text>
                <Text size="xs" color="dimmed">
                    {item.status?.message}
                </Text>
                <Text size="xs" color="dimmed">
                    {item.status?.expiry}
                </Text>
            </td>
            <td>
                <Group>
                <Button color="teal" onClick={() => handleRequest(item, true)}>Approve</Button>
                <Button color="red" onClick={() => handleRequest(item, false)}>Deny</Button>
                </Group>
            </td>
        </tr>

    )
}

export default ({tenant}) => {
    const { user } = useAuthentication();
    const [ roleRequests, setRoleRequests ] = useState([])

    useEffect(() => {
        loadRequests()
    }, []);

    const loadRequests = () => {
        axios.get('/api/requests/roles/' + tenant.name, {
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
    }

    const handleRequest = (item, approved) => {
        axios.patch('/api/requests/roles/' + item.metadata.namespace + '/' + item.metadata.name, {
            approved: approved
        })
            .then(({data}) => {

                loadRequests()
                // this.setState({
                //     ...data, loading: false
                // });
            })
            .catch(error => {
                console.log(error)
            });
    }

    //console.log(roleRequests)
    return (
        <Paper shadow="xs" p="md">
            <Group mb="xs">
                <IconWorkspace />
                <Text weight={500}>{tenant.fullname}</Text>
                {/*<Badge color="pink" variant="light">*/}
                {/*    On Sale*/}
                {/*</Badge>*/}
            </Group>
            {/*<Text size="md"><IconBuilding size={20} /> {tenant.fullname}</Text>*/}
            <ScrollArea>
                <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {roleRequests.map((item) => <RoleRequest key={item.metadata.name}
                                                             item={item}
                                                             handleRequest={handleRequest}
                                                />)}
                    </tbody>
                </Table>
            </ScrollArea>
        </Paper>

    )
}