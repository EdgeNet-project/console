import {Outlet, useNavigate, useParams} from 'react-router-dom';
import {Box, Container, Paper, Tabs} from '@mantine/core';
import {
    IconActivity,
    IconBoxPadding as IconWorkspace, IconLogs,
    IconServer,
    IconSitemap as IconTeam,
    IconUsers
} from "@tabler/icons-react";

import classes from './Admin.module.css';

function Admin() {
    const navigate = useNavigate();
    const { tabValue } = useParams();

    return (
        <>
            <Box pt="xs" >
                <h1>Admin</h1>
            </Box>


                <Tabs
                    variant="none"
                    value={tabValue}
                    onChange={(value) => navigate(`/admin/${value}`)}
                    keepMounted={false}
                    color="white"
                    classNames={classes}
                >
                    <Tabs.List justify="center">
                        <Tabs.Tab value="teams" leftSection={<IconTeam size="1rem" stroke={1.5} />}>Teams</Tabs.Tab>
                        <Tabs.Tab value="users" leftSection={<IconUsers size="1rem" stroke={1.5} />}>Users</Tabs.Tab>
                        <Tabs.Tab value="workspaces" leftSection={<IconWorkspace size="1rem" stroke={1.5} />}>Workspaces</Tabs.Tab>
                        <Tabs.Tab value="nodes" leftSection={<IconServer size="1rem" stroke={1.5} />}>Nodes</Tabs.Tab>
                        <Tabs.Tab value="activity" leftSection={<IconActivity size="1rem" stroke={1.5} />}>Activity</Tabs.Tab>
                        <Tabs.Tab value="audit" leftSection={<IconLogs size="1rem" stroke={1.5} />}>Audit</Tabs.Tab>
                    </Tabs.List>
                </Tabs>
            <Paper p="md">
                <Outlet />
            </Paper>
        </>
    );
}

export default Admin;