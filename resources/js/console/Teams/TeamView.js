import {useParams} from "react-router";
import axios from "axios";
import {Alert, Anchor, Breadcrumbs, Button, Divider, Group, Paper, SimpleGrid, Stack, Text} from "@mantine/core";
import {
    IconAlertCircle, IconAlertTriangle, IconArrowRight, IconCheck,
    IconServer, IconBox, IconUsers, IconUser, IconBoxPadding as IconWorkspace

} from "@tabler/icons";

import JoinWorkspaceDialog from "../Workspace/JoinWorkspaceDialog";
import CreateWorkspaceDialog from "../Workspace/CreateWorkspaceDialog";
import React, {useEffect, useState} from "react";
import TeamCard from "./TeamCard";
import WorkspacesCard from "../Workspace/WorkspacesCard";
import UsersCard from "../User/UsersCard";

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

export default function TeamView() {
    const { team } = useParams()
    const [ workspace, setWorkspace ] = useState(null)
    const [ users, setUsers ] = useState([])
    const [ subnamespaces, setSubnamespaces ] = useState([])

    // console.log('wp',workspace)

    useEffect(() => {
        axios.get('/api/tenants/' + team)
            .then(({data}) => {
                console.log(data)
                setWorkspace(data)
            })
    }, [team])

    useEffect(() => {
        axios.get('/api/tenants/' + team + '/users')
            .then(({data}) => {
                console.log('users',data)
                setUsers(data)
            })
    }, [team])

    useEffect(() => {
        axios.get('/api/tenants/' + team + '/subnamespaces')
            .then(({data}) => {
                console.log('subnamespaces',data)
                setSubnamespaces(data)
            })
    }, [team])

    if (!workspace) {
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
            <TeamCard team={workspace} />
            <SimpleGrid cols={2}>
                {/*{workspace && <Paper key={workspace.name} shadow="xs" p="md">*/}
                {/*    <Stack>*/}

                {/*        <Group align="flex-start">*/}
                {/*            <IconWorkspace />*/}
                {/*            <div>*/}
                {/*                <Text size="sm" color="gray">{workspace.shortname}</Text>*/}
                {/*                <Text fz="xl">{workspace.fullname}</Text>*/}
                {/*                <Anchor href={workspace.url}>{workspace.url}</Anchor> <br />*/}
                {/*            </div>*/}
                {/*        </Group>*/}

                {/*        <Stack>*/}
                {/*            <Text>Namespace: {workspace.name}</Text>*/}

                {/*            <Group justify="flex-start">*/}
                {/*                <Text>*/}
                {/*                    Contact <br/>*/}
                {/*                    {workspace.contact_firstname} {workspace.contact_lastname} <br />*/}
                {/*                    <Anchor href={"mailto:" + workspace.contact_email}>{workspace.contact_email}</Anchor> <br />*/}
                {/*                    {workspace.contact_phone}*/}
                {/*                </Text>*/}
                {/*                /!*<Text>*!/*/}
                {/*                /!*    Address<br />*!/*/}
                {/*                /!*    {workspace.street} <br />*!/*/}
                {/*                /!*    {workspace.zip} {workspace.city} <br />*!/*/}
                {/*                /!*    {workspace.region} {workspace.country}*!/*/}
                {/*                /!*</Text>*!/*/}
                {/*            </Group>*/}
                {/*        </Stack>*/}

                {/*    </Stack>*/}
                {/*</Paper>}*/}

                {/*<Paper  shadow="xs" p="md">*/}
                {/*    <Stack>*/}

                {/*        <Group align="flex-start">*/}
                {/*            <IconUsers />*/}
                {/*            <Stack justify="flex-start">*/}
                {/*                <Text size="sm" color="gray">Users</Text>*/}
                {/*                <Text fz="xl">{users.length}</Text>*/}
                {/*            </Stack>*/}
                {/*        </Group>*/}

                {/*        /!*<Alert icon={statusMapping[item.status].icon}*!/*/}
                {/*        /!*       title={item.status}*!/*/}
                {/*        /!*       color={statusMapping[item.status].color}>*!/*/}
                {/*        /!*    {item.text}*!/*/}
                {/*        /!*</Alert>*!/*/}
                {/*        {users.length > 0 ?*/}
                {/*            <Stack>*/}
                {/*                {users.map(u => <Text>{u.firstname} {u.lastname}<br/>{u.email}</Text>)}*/}
                {/*            </Stack>*/}
                {/*            : <Text>No Users</Text>*/}
                {/*        }*/}
                {/*        <Divider />*/}
                {/*        <Group>*/}
                {/*            <Anchor*/}
                {/*                size="xs"*/}
                {/*                variant="light"*/}
                {/*                icon={IconArrowRight}*/}
                {/*                iconPosition="right"*/}
                {/*            >*/}
                {/*                View more*/}
                {/*            </Anchor>*/}
                {/*        </Group>*/}
                {/*    </Stack>*/}
                {/*</Paper>*/}

                {/*{categories.map((item) => (*/}
                {/*    <Paper key={item.title} shadow="xs" p="md">*/}
                {/*        <Stack>*/}

                {/*            <Group justify="flex-start">*/}
                {/*                {item.icon}*/}
                {/*                <Stack justify="flex-start">*/}
                {/*                    <Text size="sm" color="gray">{item.title}</Text>*/}
                {/*                    <Text fz="xl">{item.metric}</Text>*/}
                {/*                </Stack>*/}
                {/*            </Group>*/}

                {/*            <Alert icon={statusMapping[item.status].icon}*/}
                {/*                   title={item.status}*/}
                {/*                   color={statusMapping[item.status].color}>*/}
                {/*                {item.text}*/}
                {/*            </Alert>*/}
                {/*            <Divider />*/}
                {/*            <Group>*/}
                {/*                <Anchor*/}
                {/*                    size="xs"*/}
                {/*                    variant="light"*/}
                {/*                    icon={IconArrowRight}*/}
                {/*                    iconPosition="right"*/}
                {/*                >*/}
                {/*                    View more*/}
                {/*                </Anchor>*/}
                {/*            </Group>*/}
                {/*        </Stack>*/}
                {/*    </Paper>*/}
                {/*))}*/}
                <UsersCard team={workspace} users={users} />
                <WorkspacesCard team={workspace} workspaces={subnamespaces} />
                {/*{workspace && <Paper shadow="xs" p="md">*/}
                {/*    <Stack>*/}
                {/*        {workspace.subnamespaces && workspace.subnamespaces.length > 0 ?*/}
                {/*            <Stack>*/}
                {/*                {workspace.subnamespaces.map(s => <Text>{s.name}</Text>)}*/}
                {/*            </Stack>*/}
                {/*            : <Text>No Workspaces</Text>*/}
                {/*        }*/}

                {/*        <CreateWorkspaceDialog />*/}
                {/*    </Stack>*/}
                {/*</Paper>}*/}
            </SimpleGrid>
        </Stack>
    )
}