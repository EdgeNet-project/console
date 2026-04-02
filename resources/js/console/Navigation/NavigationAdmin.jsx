import {Divider, NavLink} from "@mantine/core";
import {
    IconActivity,
    IconBoxPadding as IconWorkspace,
    IconServer,
    IconSitemap as IconTeam,
    IconUsers, IconUserShield
} from "@tabler/icons-react";
import NavigationLink from "./NavigationLink";
import {useAuthentication} from "../Authentication";
import {NavLink as RouterNavLink, useMatch} from "react-router-dom";

export default () => {
    const {user} = useAuthentication()
    const match = useMatch('/admin/*')

    if (!user.admin) {
        return null;
    }

    return (
    <NavLink
        component={RouterNavLink}
        to="/admin"
        label="Admin"
        active={match}
        leftSection={<IconUserShield size="1rem" stroke={1.5} />}
    />
    )
    return (
        <>
            <Divider label="Admin" mt="sm" />
            <NavigationLink to="admin/teams" label="Teams" icon={<IconTeam size="1rem" stroke={1.5} />}/>
            <NavigationLink to="admin/workspaces" label="Workspaces" icon={<IconWorkspace size="1rem" stroke={1.5} />}/>
            <NavigationLink to="admin/users" label="Users" icon={<IconUsers size="1rem" stroke={1.5} />}/>
            <NavigationLink to="admin/nodes" label="Nodes" icon={<IconServer size="1rem" stroke={1.5} />}/>
            <NavigationLink to="admin/activity" label="Activity" icon={<IconActivity size="1rem" stroke={1.5} />}/>
        </>
    )

}