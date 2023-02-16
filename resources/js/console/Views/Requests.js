import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import {Paper, Stack, Text, Title} from "@mantine/core";
import axios from "axios";

export default function Requests() {
    const { user } = useAuthentication();
    const [ roleRequests, setRoleRequests ] = useState([])

    useEffect(() => {
        axios.get('/api/requests/roles', {
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

    return (
        <Stack spacing="sm">
            <Title>Requests</Title>
            <Text size="sm">Pending requests from users that ask to join your organization(s) will be shown here.</Text>
            <Paper shadow="xs" p="md">

            </Paper>
        </Stack>
    )
}