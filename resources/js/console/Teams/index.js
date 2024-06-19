import {useParams} from "react-router";
import axios from "axios";
import {Alert, Anchor, Breadcrumbs, Button, Divider, Group, Paper, SimpleGrid, Stack, Text, Title} from "@mantine/core";
import {
    IconAlertCircle, IconAlertTriangle, IconArrowRight, IconCheck,
    IconServer, IconBox, IconUsers, IconUser, IconBoxPadding as IconWorkspace

} from "@tabler/icons";

import React, {useEffect, useState} from "react";
import TeamWorkspaces from "./TeamWorkspaces";
import TeamUsers from "./TeamUsers";


export default () => {
    const { id } = useParams()
    const [ team, setTeam ] = useState(null)

    const [ users, setUsers ] = useState([])
    const [ workspaces, setWorkspaces ] = useState([])

    // console.log('wp',workspace)

    useEffect(() => {
        axios.get('/api/tenants/' + id)
            .then(({data}) => {
                console.log(data)
                setTeam(data)
            })
    }, [id])

    // useEffect(() => {
    //     axios.get('/api/tenants/' + id + '/users')
    //         .then(({data}) => {
    //             console.log('users',data)
    //             setUsers(data)
    //         })
    // }, [team])
    //
    // useEffect(() => {
    //     axios.get('/api/tenants/' + id + '/subnamespaces')
    //         .then(({data}) => {
    //             console.log('workspaces',data)
    //             setWorkspaces(data)
    //         })
    // }, [team])

    if (!team) {
        return null;
    }

    return (
        <Stack>
            {/*<SimpleGrid cols={2}>*/}
            {/*    <Breadcrumbs separator="→" mt="xs">{workspace.shortname}</Breadcrumbs>*/}

            {/*    <Group align="center" position="right">*/}
            {/*        <JoinWorkspaceDialog />*/}
            {/*    </Group>*/}
            {/*</SimpleGrid>*/}
            <Stack my="lg">
                <Group justify="space-between">
                    <Title order={1}>Team → {team.shortname}</Title>
                    {/*<Button onClick={() => navigate('/nodes/create')}>Add a Node</Button>*/}
                </Group>
                <Text size="sm">
                    {team.fullname} <br />
                    {team.city}, {team.country} <br />
                    <Anchor target="_blank" href={team.url}>{team.url}</Anchor>
                </Text>
                <Text>

                </Text>
            </Stack>

            <SimpleGrid cols={2}>
                <TeamWorkspaces team={team} />
                <TeamUsers team={team} />
            </SimpleGrid>
        </Stack>
    )
}