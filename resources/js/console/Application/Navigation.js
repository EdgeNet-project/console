import {IconAlertCircle, IconDatabase, IconGitPullRequest, IconMessages} from "@tabler/icons";
import {Group, ThemeIcon, UnstyledButton, Text, Navbar} from "@mantine/core";
import NavigationUser from "./NavigationUser";

function NavigationButton({ icon, color, label }) {
    return (
        <UnstyledButton
            sx={(theme) => ({
                display: 'block',
                width: '100%',
                padding: theme.spacing.xs,
                borderRadius: theme.radius.sm,
                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                '&:hover': {
                    backgroundColor:
                        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                },
            })}
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

const data = [
    { icon: <IconGitPullRequest size={16} />, color: 'blue', label: 'Pull Requests' },
    { icon: <IconAlertCircle size={16} />, color: 'teal', label: 'Open Issues' },
    { icon: <IconMessages size={16} />, color: 'violet', label: 'Discussions' },
    { icon: <IconDatabase size={16} />, color: 'grape', label: 'Databases' },
];

const NavigationMenu = () => {
    const links = data.map((link) => <NavigationButton {...link} key={link.label} />);
    return <div>{links}</div>;
}

export default function Navigation() {
    return (
        <Navbar width={{ base: 300 }} p="xs">
            <Navbar.Section grow mt="xs">
                <NavigationMenu />
            </Navbar.Section>
            <Navbar.Section>
                <NavigationUser />
            </Navbar.Section>
        </Navbar>
    )
}