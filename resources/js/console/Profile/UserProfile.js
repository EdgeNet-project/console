import React, {useEffect, useState} from "react";
import { useAuthentication } from "../Authentication";
import {Button, Group, Text, Stack, Paper, Divider} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {IconBuilding} from "@tabler/icons";
import UserProfileOrganizations from "../Views/UserProfileOrganizations";
import {UserInfo} from "../User/UserAvatar";
import UserTeams from "./UserTeams";
import UserProfileEdit from "./UserProfileEdit";

export default function UserProfile() {
    const { user, logout } = useAuthentication();
    const navigate = useNavigate();
    const [ namespaces, setNamespaces ] = useState()

    // useEffect(() => {
    //     axios.get('/api/namespaces', {
    //         // params: { ...queryParams, page: current_page + 1 },
    //         // paramsSerializer: qs.stringify,
    //     })
    //         .then(({data}) => {
    //             console.log(data)
    //             setNamespaces(data);
    //             // this.setState({
    //             //     ...data, loading: false
    //             // });
    //         })
    //         .catch(error => {
    //             console.log(error)
    //         });
    // }, [])

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <Stack spacing="xl">
            <Group position="apart">
                <Group>
                    <UserInfo user={user} />
                    <UserProfileEdit />
                </Group>
                <Button color="red" onClick={handleLogout}>Logout</Button>
            </Group>

            <UserTeams />
            {/*<Paper shadow="xs" p="md">*/}
            {/*    <Text>My Teams</Text>*/}
            {/*    <Divider />*/}
            {/*    <Stack>*/}
            {/*        <Text>Sorbonne</Text>*/}
            {/*        <Divider />*/}

            {/*        <Button>Create a new Team</Button>*/}
            {/*    </Stack>*/}
            {/*</Paper>*/}
            {/*<UserProfileOrganizations organizations={user.tenants} />*/}
        </Stack>
    );
}