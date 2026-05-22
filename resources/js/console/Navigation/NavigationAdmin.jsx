import {Divider} from "@mantine/core";
import {
    IconTopologyStarRing3, IconHome, IconServer2
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
            <Divider label="Administration" mt="sm" />
            <NavigationLink to="/admin/console" label="Console" icon={<IconHome size="1rem" stroke={1.5} />} />
            <NavigationLink to="/admin/cluster" label="Cluster" icon={<IconTopologyStarRing3 size="1rem" stroke={1.5} />} />
            <NavigationLink to="/admin/nodes" label="Nodes" icon={<IconServer2 size="1rem" stroke={1.5} />} />
        </>
    )

}