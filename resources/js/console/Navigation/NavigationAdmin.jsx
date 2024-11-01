import {Divider} from "@mantine/core";
import {
    IconActivity,
    IconBoxPadding as IconWorkspace,
    IconServer,
    IconSitemap as IconTeam,
    IconUsers
} from "@tabler/icons-react";
import NavigationLink from "./NavigationLink";
import {useAuthentication} from "../Authentication";

export default () => {
    const {user} = useAuthentication()

    if (!user.admin) {
        return null;
    }

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