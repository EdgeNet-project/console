import React, {useState, useEffect} from "react";
import {useWorkspace} from "../Application/Workspace";
import {useAuthentication} from "../Authentication";
import axios from "axios";
import {Avatar, Box, Button, Grid, Group, Paper, Stack, Table, Text, Title} from "@mantine/core";
import {IconBuilding, IconUser} from "@tabler/icons";
import Gravatar from "react-gravatar";

const Users = () => {
    const [ users, setUsers ] = useState([])
    const {namespace} = useWorkspace()

    useEffect(() => {
        if (namespace) {
            axios.get('/api/tenants/' + namespace + '/users', {
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
        }
    }, [namespace]);

    return (
        <Paper shadow="xs" p="md">
            <Stack>
                <Text>Users</Text>
                {users.map((user) => <Group key={user.id}>
                    <Gravatar email={user.email} />

                    <div style={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            {user.firstname} {user.lastname}
                        </Text>

                        <Text color="dimmed" size="xs">
                            {user.email}
                        </Text>
                    </div>

                    {/*{icon || <IconChevronRight size="0.9rem" stroke={1.5} />}*/}
                </Group>)}
                <Box>
                    <Button leftIcon={<IconUser size={20} />} onClick={null}>Invite</Button>
                </Box>
            </Stack>
        </Paper>
    )
}

const Dashboard = () => {


    // useEffect(() => {
    //     get('kubernetes/config')
    //         .then(data => console.log(data))
    // }, [])

    return (
        <Grid>
            <Grid.Col span={6}>
                <Users />
            </Grid.Col>
        </Grid>
    )
}

export default Dashboard;