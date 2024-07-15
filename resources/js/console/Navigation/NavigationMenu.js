import {
    IconServer,
    IconKey, IconDashboard, IconChevronRight, IconUsers,
    IconSitemap as IconTeam, IconBoxPadding as IconWorkspace, IconActivity, IconGitPullRequest
} from "@tabler/icons-react";
import {
    Group,
    UnstyledButton,
    Divider,
    NavLink,
    Badge, ScrollArea
} from "@mantine/core";
import {NavLink as RouterNavLink, matchPath, useMatch, useMatches} from "react-router-dom";
import {useAuthentication} from "../Authentication";
import NavigationTeams from "./NavigationTeams";

import classes from "./navigation.module.css";
import {UserInfo} from "../User/components/UserAvatar";


const NavigationUser = () => {
    const {user} = useAuthentication();


    return (
        <UnstyledButton className={classes.user}>
            <Group justify="space-between">
                <UserInfo user={user} />

                <IconChevronRight size={18} />
            </Group>
        </UnstyledButton>
    )
}

const nav = {
    main: {
        label: '',
        links: [
            {to: '', label: 'Console Home', icon: IconDashboard},
        ]
    },
    // {
    //     label: '',
    //     id: 'workspaces',
    //     links: [
    //         // { link: '', label: 'Notifications', icon: IconBellRinging },
    //     ]
    // },
    nodes: {
        label: '',
        links: [
            {to: 'nodes', label: 'Nodes', icon: IconServer},
        ]
    },
    account: {
        label: '',
        links: [
            {to: 'tokens', label: 'Tokens', icon: IconKey},
            {to: 'requests', label: 'Requests', icon: IconGitPullRequest},
        ]
    },
};

// const NavLink = ({link}) => {
//     const match = useMatch(link.to)
//
//     return (
//         <Anchor component={Link}
//                 to={link.to}
//                 className={classes.link}
//                 data-active={match}>
//             <link.icon className={classes.linkIcon} stroke={1.5}/>
//             <span>{link.label}</span>
//         </Anchor>
//     )
// }
// const NavLinks = ({links}) => {
//
//     return links.map((link) =>
//         <NavLink
//             href={link.to}
//             label={link.label}
//         // leftSection={<IconHome2 size="1rem" stroke={1.5} />}
//             leftSection={<link.icon size="1rem" stroke={1.5} />}/>
//     );
//
//     return links.map((item) => <NavLink link={item} key={item.label} />);
// }

const NavMenu = ({to, label, icon, rightSection}) => {
    const match = useMatch(to)

    return (
        <NavLink
            component={RouterNavLink}
            className={classes.link}
            to={to}
            label={label}
            active={match}
            leftSection={icon}
            rightSection={rightSection}
        />
    )
}

const NavAdmin = () => {

    return (
        <>
            <Divider label="Admin" mt="sm" />
            <NavMenu to="admin/teams" label="Teams" icon={<IconTeam size="1rem" stroke={1.5} />}/>
            <NavMenu to="admin/workspaces" label="Workspaces" icon={<IconWorkspace size="1rem" stroke={1.5} />}/>
            <NavMenu to="admin/users" label="Users" icon={<IconUsers size="1rem" stroke={1.5} />}/>
            <NavMenu to="admin/nodes" label="Nodes" icon={<IconServer size="1rem" stroke={1.5} />}/>
            <NavMenu to="admin/activity" label="Activity" icon={<IconActivity size="1rem" stroke={1.5} />}/>
        </>
    )
}

export default function NavigationMenu() {
    const {user, userRequests} = useAuthentication();

    const countRequests = user.requests.length + userRequests.length;

    return (
        <ScrollArea>
            <div className={classes.navbarMain}>
                {/*<Group className={classes.header} justify="space-between">*/}
                {/*    <Code fw={700}>v3.1.2</Code>*/}
                {/*</Group>*/}

                <NavMenu to="" label="Console Home" icon={<IconDashboard size="1rem" stroke={1.5} />}/>
                <NavigationTeams />

                <Divider label="Nodes" mt="sm" />
                <NavMenu to="nodes" label="Nodes" icon={<IconServer size="1rem" stroke={1.5} />}/>

                {user.admin && <NavAdmin />}
            </div>

            <div className={classes.footer}>
                <Divider label="Account" mt="sm"/>
                <NavMenu to="tokens" label="Tokens" icon={<IconKey size="1rem" stroke={1.5} />}/>
                <NavMenu to="requests" label="Requests"
                         rightSection={countRequests > 0 && <Badge size="xs" circle>{countRequests}</Badge>}
                         icon={<IconGitPullRequest size="1rem" stroke={1.5} />}/>
                <NavMenu to="profile" label={<UserInfo user={user} />}
                         rightSection={<IconChevronRight size={18} />}/>
            </div>
        </ScrollArea>
    );
}