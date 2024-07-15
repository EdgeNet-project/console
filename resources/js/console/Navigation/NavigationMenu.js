import {
    IconServer, IconDashboard, IconHelpHexagon,
} from "@tabler/icons-react";
import {
    Badge,
    Divider, ScrollArea
} from "@mantine/core";
import NavigationLink from "./NavigationLink";
import NavigationTeams from "./NavigationTeams";

import classes from "./navigation.module.css";
import NavigationAdmin from "./NavigationAdmin";
import {useAuthentication} from "../Authentication";




export default function NavigationMenu() {
    const {userRequests} = useAuthentication();

    const countRequests = userRequests.length;

    return (
        <>

        <ScrollArea>
            {/*<Group className={classes.header} justify="space-between">*/}
            {/*    <Code fw={700}>v3.1.2</Code>*/}
            {/*</Group>*/}

            <NavigationLink to="" label="Console Home" icon={<IconDashboard size="1rem" stroke={1.5} />}/>
            <NavigationLink to="requests" label="Requests"
                            rightSection={countRequests > 0 && <Badge size="xs" circle>{countRequests}</Badge>}
                            icon={<IconHelpHexagon size="1rem" stroke={1.5} />}/>
            <NavigationTeams />

            <Divider label="Nodes" mt="sm" />
            <NavigationLink to="nodes" label="Nodes" icon={<IconServer size="1rem" stroke={1.5} />}/>

            <NavigationAdmin />
        </ScrollArea>

        </>
    );
}