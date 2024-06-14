import {
    IconAlertCircle,
    IconDatabase,
    IconGitPullRequest,
    IconQuestionCircle,
    IconFileSettings,
    IconServer,
    IconKey, IconUser, IconDashboard, IconChevronRight, IconSwitchHorizontal, IconLogout
} from "@tabler/icons";
import {Group, ThemeIcon, UnstyledButton, Text, useMantineTheme, Divider, Code, Anchor, NavLink} from "@mantine/core";
import {NavLink as RouterNavLink, matchPath, useMatch, useMatches} from "react-router-dom";
import {useAuthentication} from "../Authentication";
import NavigationTeams from "./NavigationTeams";

import classes from "./navigation.module.css";
import {UserInfo} from "../User/UserAvatar";


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
            {to: '', label: 'Dashboard', icon: IconDashboard},
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
            {to: 'requests', label: 'Requests', icon: IconQuestionCircle},
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

export default function NavigationMenu() {
    const {user} = useAuthentication();

    return (
        <>
            <div className={classes.navbarMain}>
                {/*<Group className={classes.header} justify="space-between">*/}
                {/*    <Code fw={700}>v3.1.2</Code>*/}
                {/*</Group>*/}

                <NavMenu to="" label="Dashboard" icon={<IconDashboard size="1rem" stroke={1.5} />}/>
                <NavigationTeams />

                <Divider label="Nodes" mt="sm" />
                <NavMenu to="nodes" label="Nodes" icon={<IconServer size="1rem" stroke={1.5} />}/>

                <Divider label="Account" mt="sm"/>
                <NavMenu to="tokens" label="Tokens" icon={<IconKey size="1rem" stroke={1.5} />}/>
                <NavMenu to="requests" label="Requests" icon={<IconQuestionCircle size="1rem" stroke={1.5} />}/>
            </div>

            <div className={classes.footer}>
                <NavMenu to="profile" label={<UserInfo user={user} />}
                         rightSection={<IconChevronRight size={18} />}/>
            </div>
        </>
    );
}