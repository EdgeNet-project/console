import {
    IconAlertCircle,
    IconDatabase,
    IconGitPullRequest,
    IconQuestionCircle,
    IconFileSettings,
    IconServer,
    IconKey, IconUser, IconDashboard, IconChevronRight, IconSwitchHorizontal, IconLogout
} from "@tabler/icons";
import {Group, ThemeIcon, UnstyledButton, Text, useMantineTheme, Divider, Code, Anchor} from "@mantine/core";
import {Link, useMatch} from "react-router-dom";
import {useAuthentication} from "../Authentication";
import NavigationTeams from "./NavigationTeams";

import classes from "./navigation.module.css";
import {UserInfo} from "../User/UserAvatar";


const NavigationUser = () => {
    const {user} = useAuthentication();


    return (
        <UnstyledButton className={classes.user}>
            <Group>
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

const NavLink = ({link}) => {
    const match = useMatch(link.to)

    return (
        <Anchor component={Link}
                to={link.to}
                className={classes.link}
                data-active={match}>
            <link.icon className={classes.linkIcon} stroke={1.5}/>
            <span>{link.label}</span>
        </Anchor>
    )
}
const NavLinks = ({links}) => {
    return links.map((item) => <NavLink link={item} key={item.label} />);
}

export default function NavigationMenu() {
    return (
        <nav className={classes.navbar}>
            <div className={classes.navbarMain}>
                {/*<Group className={classes.header} justify="space-between">*/}
                {/*    <Code fw={700}>v3.1.2</Code>*/}
                {/*</Group>*/}

                <NavLinks links={nav.main.links} />

                <NavigationTeams />

                <Divider label="Nodes" mt="sm" />
                <NavLinks links={nav.nodes.links} />

                <Divider label="Account" mt="sm"/>
                <NavLinks links={nav.account.links} />
            </div>

            <div className={classes.footer}>
                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
                    <span>Change account</span>
                </a>

                <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                    <IconLogout className={classes.linkIcon} stroke={1.5} />
                    <span>Logout</span>
                </a>
                <NavigationUser />
            </div>
        </nav>
    );

    return (
        <Navbar width={{ base: 300 }} p="xs">

            <Navbar.Section>
                <NavigationUser />
            </Navbar.Section>
        </Navbar>
    )
}