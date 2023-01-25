import {Box, Group, UnstyledButton, Text, useMantineTheme} from "@mantine/core";
import {IconChevronLeft, IconChevronRight} from "@tabler/icons";
import Gravatar from 'react-gravatar';
import {Link, useMatch} from "react-router-dom";
import {useAuthentication} from "../Authentication";

export default function NavigationUser() {
    const theme = useMantineTheme();
    const {user} = useAuthentication();
    const match = useMatch('/profile')

    const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]

    return (
        <Box
            sx={{
                paddingTop: theme.spacing.sm,
                borderTop: `1px solid ${
                    theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
                }`,
            }}
        >
            <UnstyledButton
                component={Link}
                to="/profile"
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
                    <Gravatar email={user.email} />

                    <Box sx={{ flex: 1 }}>
                        <Text size="sm" weight={500}>
                            {user.firstname} {user.lastname}
                        </Text>
                        <Text color="dimmed" size="xs">
                            {user.email}
                        </Text>
                    </Box>

                    {theme.dir === 'ltr' ? <IconChevronRight size={18} /> : <IconChevronLeft size={18} />}
                </Group>
            </UnstyledButton>
        </Box>
    );
}