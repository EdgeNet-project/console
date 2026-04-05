import {Outlet, useLocation, useNavigate, useParams} from 'react-router-dom';
import {Breadcrumbs, Paper, Tabs, Title} from '@mantine/core';
import {
    IconLogs, IconNetwork,
    IconServer,
} from "@tabler/icons-react";

import classes from '../Admin.module.css';

function Index() {
    const navigate = useNavigate();
    const location = useLocation();
    const { tabValue = location.pathname.split('/').pop() } = useParams();

    const activeTab = [ 'nodes', 'audit', 'flow'].includes(tabValue) ? tabValue : 'nodes';

    return (
        <>
            <Breadcrumbs separator="→" separatorMargin="md" mt="xs">
                <Title order={2}>Administration</Title>
                <Title order={2}>Cluster</Title>
            </Breadcrumbs>
            <Tabs
                variant="none"
                value={activeTab}
                onChange={(value) => navigate(`/admin/cluster/${value}`)}
                keepMounted={false}
                color="white"
                classNames={classes}
            >
                <Tabs.List justify="center">
                    <Tabs.Tab value="nodes" leftSection={<IconServer size="1rem" stroke={1.5} />}>Nodes</Tabs.Tab>
                    <Tabs.Tab value="audit" leftSection={<IconLogs size="1rem" stroke={1.5} />}>Audit</Tabs.Tab>
                    <Tabs.Tab value="flow" leftSection={<IconNetwork size="1rem" stroke={1.5} />}>Flow</Tabs.Tab>
                </Tabs.List>
            </Tabs>
            <Paper p="md">
                <Outlet />
            </Paper>
        </>
    );
}

export default Index;