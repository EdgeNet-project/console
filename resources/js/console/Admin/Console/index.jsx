import {Outlet, useLocation, useNavigate, useParams} from 'react-router-dom';
import {Breadcrumbs, Paper, Tabs, Title} from '@mantine/core';
import {
    IconActivity,
    IconBoxPadding as IconWorkspace,
    IconSitemap as IconTeam,
    IconUsers
} from "@tabler/icons-react";

import classes from '../Admin.module.css';

function Index() {
    const navigate = useNavigate();
    const location = useLocation();
    const { tabValue = location.pathname.split('/').pop() } = useParams();

    const activeTab = ['teams', 'users', 'workspaces', 'activity'].includes(tabValue) ? tabValue : 'teams';

    return (
        <div>
            <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
                <Title order={2}>Administration</Title>
                <Title order={2}>Console</Title>
            </Breadcrumbs>
            <Tabs
                variant="none"
                value={activeTab}
                onChange={(value) => navigate(`/admin/console/${value}`)}
                keepMounted={false}
                color="white"
                classNames={classes}
            >
                <Tabs.List justify="center">
                    <Tabs.Tab value="teams" leftSection={<IconTeam size="1rem" stroke={1.5} />}>Teams</Tabs.Tab>
                    <Tabs.Tab value="users" leftSection={<IconUsers size="1rem" stroke={1.5} />}>Users</Tabs.Tab>
                    <Tabs.Tab value="workspaces" leftSection={<IconWorkspace size="1rem" stroke={1.5} />}>Workspaces</Tabs.Tab>
                    <Tabs.Tab value="activity" leftSection={<IconActivity size="1rem" stroke={1.5} />}>Activity</Tabs.Tab>
                </Tabs.List>
            </Tabs>
            <Paper p="md">
                <Outlet />
            </Paper>
        </div>
    );
}

export default Index;