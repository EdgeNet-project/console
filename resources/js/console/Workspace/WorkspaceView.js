import {useParams} from "react-router";
import axios from "axios";
import {Alert, Anchor, Breadcrumbs, Button, Divider, Group, Paper, SimpleGrid, Stack, Text} from "@mantine/core";
import {
    IconAlertCircle, IconAlertTriangle, IconArrowRight, IconCheck,
    IconServer, IconBox, IconUsers, IconUser, IconBoxPadding as IconWorkspace

} from "@tabler/icons";

import CreateWorkspaceDialog from "../Workspace/CreateWorkspaceDialog";
import React, {useEffect, useState} from "react";
import WorkspacesCard from "../Workspace/WorkspacesCard";
import UsersCard from "../User/UsersCard";
import {Link} from "react-router-dom";
const items = [
    { title: 'Sorbonne', href: '#' },
    { title: 'Networking Class', href: '#' },
    { title: 'Team A', href: '#' },
].map((item, index) => (
    <Anchor href={item.href} key={index}>
        {item.title}
    </Anchor>
));


const categories = [
    // {
    //     icon: <IconUser />,
    //     title: "Users",
    //     metric: "2",
    //     text: "No pending requests",
    //     status: "Performing as usual",
    //     color: "emerald",
    // },
    // {
    //     icon: <IconBox />,
    //     title: "Deployments",
    //     metric: "1",
    //     text: "Deployment yyy is not starting up correctly",
    //     status: "Critical performance",
    // },
];


const statusMapping = {
    "Performing as usual": {icon: <IconCheck size="1rem" />, color: 'teal'},
    "Immediate action required": {icon: <IconAlertTriangle size="1rem" />, color: 'orange'},
    "Critical performance": {icon: <IconAlertCircle size="1rem" />, color: 'red'}
};

export default () => {
    const { team, workspace } = useParams()
    const [ teamResource, setTeamResource ] = useState(null)
    const [ workspaceResource, setWorkspaceResource ] = useState(null)
    const [ users, setUsers ] = useState([])
    const [ subnamespaces, setSubnamespaces ] = useState([])

    console.log('WorkspaceView', team, workspace)

    useEffect(() => {
        axios.get('/api/tenants/' + team)
            .then(({data}) => {
                console.log('TeamResource',data)
                setTeamResource(data)
            })
    }, [team])

    useEffect(() => {
        if (workspace) {
            axios.get('/api/subnamespaces/' + team + '/' + workspace)
                .then(({data}) => {
                    console.log('WorkspaceResource', data)
                    setWorkspaceResource(data)
                })
        }
    }, [workspace])

    // useEffect(() => {
    //     axios.get('/api/tenants/' + team + '/users')
    //         .then(({data}) => {
    //             console.log('users',data)
    //             setUsers(data)
    //         })
    // }, [team])
    //
    // useEffect(() => {
    //     axios.get('/api/tenants/' + team + '/subnamespaces')
    //         .then(({data}) => {
    //             console.log('subnamespaces',data)
    //             setSubnamespaces(data)
    //         })
    // }, [team])

    // return 'wip'

    return (
        <Stack>

            {workspace && <Breadcrumbs separator="→" mt="xs">
                {teamResource && <Anchor component={Link} to={'/team/' + teamResource.name}>{teamResource.fullname}</Anchor>}
                {workspaceResource && <Anchor component={Link} to={'/team/' + teamResource.name + '/' + workspaceResource.name}>{workspaceResource.name}</Anchor>}
            </Breadcrumbs>}

            {teamResource && <Group align="flex-start">
                <Stack spacing="xs">
                    {/*<Text size="sm" color="gray">{workspace.shortname}</Text>*/}
                    <Text fz="xl">{teamResource.fullname}</Text>
                    {teamResource.url && <Anchor size="xs" href={teamResource.url}>{workspace.url}</Anchor>}
                    <Text>Namespace: {teamResource.name}</Text>
                </Stack>

            </Group>}

            <SimpleGrid cols={2}>

                <UsersCard users={users} />
                <WorkspacesCard team={workspace} workspaces={subnamespaces} />

            </SimpleGrid>
        </Stack>
    )
}