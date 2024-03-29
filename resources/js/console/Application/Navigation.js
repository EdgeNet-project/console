import {
    IconAlertCircle,
    IconDatabase,
    IconGitPullRequest,
    IconQuestionCircle,
    IconFileSettings,
    IconServer,
    IconKey, IconUser, IconDashboard
} from "@tabler/icons";
import {Group, ThemeIcon, UnstyledButton, Text, Navbar, useMantineTheme, Divider} from "@mantine/core";
import NavigationUser from "./NavigationUser";
import {Link, useMatch} from "react-router-dom";
import {useAuthentication} from "../Authentication";
import NavigationTeams from "./NavigationTeams";

function NavigationButton({ icon, color, label, link }) {
    const theme = useMantineTheme();
    const match = useMatch(link)

    const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]

    return (
        <UnstyledButton
            component={Link}
            to={link}
            sx={{
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                backgroundColor: match ? backgroundColor : null,
                '&:hover': {
                    backgroundColor: backgroundColor,
                },
            }}
        >
            <Group>
                <ThemeIcon color={color} variant="light">
                    {icon}
                </ThemeIcon>

                <Text size="sm">{label}</Text>
            </Group>
        </UnstyledButton>
    );
}

const menuAccount = [
    { icon: <IconKey size={16} />, color: 'teal', label: 'Tokens', link: '/tokens' },
    // { icon: <IconServer size={16} />, color: 'blue', label: 'Nodes', link: '/nodes' },
    // { icon: <IconAlertCircle size={16} />, color: 'teal', label: 'Open Issues' },
    // { icon: <IconMessages size={16} />, color: 'violet', label: 'Discussions' },
    // { icon: <IconDatabase size={16} />, color: 'grape', label: 'Databases' },
];

const ownerMenu = [
    { icon: <IconQuestionCircle size={16} />, color: 'blue', label: 'Requests', link: '/requests' },
    { icon: <IconUser size={16} />, color: 'teal', label: 'Users', link: '/users' },
    // { icon: <IconMessages size={16} />, color: 'violet', label: 'Discussions' },
    // { icon: <IconDatabase size={16} />, color: 'grape', label: 'Databases' },
];

const NavigationMenu = () => {
    const { user } = useAuthentication();
    //
    // const is_owner = user.roles.some(role => {
    //     return role === 'owner'
    // })


    const links = [
        // ...(is_owner ? ownerMenu.map((link) => <NavigationButton {...link} key={link.label} link={link.link} />) : [])
    ];


    return <div>{links}</div>;
}

export default function Navigation() {
    return (
        <Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section grow mt="xs">
                <NavigationButton icon={<IconDashboard size={16} />} color="indigo" link="/" label="Dashboard" />
                <NavigationTeams />
                <NavigationMenu />

                <Divider label="Account" />
                <NavigationButton icon={<IconKey size={16} />} color="teal" link="/tokens" label="Tokens" />
                <NavigationButton icon={<IconQuestionCircle size={16} />} color="blue" link="/requests" label="Requests" />

            </Navbar.Section>
            <Navbar.Section>
                <NavigationUser />
            </Navbar.Section>
        </Navbar>
    )
}