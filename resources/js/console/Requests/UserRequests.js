import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import { Group, Paper, ScrollArea, Stack, Table, Text, Title} from "@mantine/core";
import {IconBoxPadding as IconWorkspace, IconBuilding, IconInfoCircle, IconUser} from "@tabler/icons";
import UserRequestList from "./UserRequestList";
import axios from "axios";


export default () => {
    const { user } = useAuthentication();
    const [userRequests, setUserRequests] = useState([]);

    useEffect(() => {
        // axios.get('/api/user/requests')
        //     .then(({data}) => {
        //         setUserRequests(data)
        //     })
        //     .catch((error) => {
        //         console.log(error)
        //     })
        //
        // return () => {
        //     setUserRequests([])
        // }
    }, []);

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

    return (
    <Stack>
        {user.requests && user.requests.length > 0 &&
        <Paper p="md">
            <Group mb="xs">
                <IconInfoCircle />
                <Stack gap={0}>
                    <Text>Requests</Text>
                    <Text size="sm" c="dimmed">Your requests status</Text>
                </Stack>
            </Group>
            <UserRequestList requests={user.requests} />
        </Paper>}

        {userRequests && userRequests.map(tenant => {

            return (<Paper p="md">
                <Group mb="xs">
                    <IconInfoCircle />
                    <Stack gap={0}>
                        <Text></Text>
                        <Text size="sm" c="dimmed">Pending requests for your Team, as an admin you can approve or deny the following requests</Text>
                    </Stack>
                </Group>
                <UserRequestList requests={userRequests} updateRequest={updateRequest} />
            </Paper>)
        })}

    </Stack>
    )
}