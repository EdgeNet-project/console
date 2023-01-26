import React, {useEffect, useState} from "react";
import { useAuthentication } from "../Authentication";
import {Button, Group, Text} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UserProfile() {
    const { user, logout } = useAuthentication();
    const navigate = useNavigate();
    const [ namespaces, setNamespaces ] = useState()

    useEffect(() => {
        axios.get('/api/namespaces', {
            // params: { ...queryParams, page: current_page + 1 },
            // paramsSerializer: qs.stringify,
        })
            .then(({data}) => {
                console.log(data)
                setNamespaces(data);
                // this.setState({
                //     ...data, loading: false
                // });
            })
            .catch(error => {
                console.log(error)
            });
    }, [])

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <Group position="apart">
            <div>
                <Text size="lg" weight={500}>
                    {user.firstname} {user.lastname}
                </Text>
                <Text size="xs" color="dimmed">
                    {user.email}
                </Text>
            </div>

                <Button color="red" onClick={handleLogout}>Logout</Button>


        </Group>
    );
}