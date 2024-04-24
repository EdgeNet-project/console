import {Link} from "react-router-dom";
import {Alert, Anchor, Divider, Group, Paper, Stack, Text} from "@mantine/core";
import {IconAlertTriangle, IconBoxPadding, IconInfoCircle} from "@tabler/icons";
import {useAuthentication} from "../Authentication";

const UserWorkspaces = () => {
    const { user } = useAuthentication();

    if (user.tenants.length > 0) {
        return (
            <>
                <Stack>
                    {user.tenants.map(tenant => {
                        if (!tenant.subnamespaces) return <></>

                        return (
                            <div>
                                <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                                    {tenant.name}
                                </Text>
                                <Text fz="md" fw={500}>
                                    {tenant.subnamespaces.map(s => <div>{s.name}</div>)}
                                </Text>
                            </div>
                        )
                    })}
                </Stack>
                <Group>
                    <Anchor size="xs" component={Link} to="/workspace/registration">
                        Create a new Workspace
                    </Anchor>
                    <Text size="xs">|</Text>
                    <Anchor size="xs" component={Link} to="/workspace/join">
                        Join an existing Workspace
                    </Anchor>

                </Group>
            </>
        );
    }

    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have any workspaces yet!" color="blue">
            <Text mt="xl">
                You can create a new workspace here:
            </Text>
            <Anchor component={Link} to="/workspace/registration">
                Create a new Workspace
            </Anchor>

            <Text mt="xl">
                You can join an existing workspace here:
            </Text>
            <Anchor component={Link} to="/workspace/join">
                Join an existing Workspace
            </Anchor>

        </Alert>
    )

}
export default () => {

    return (
        <Paper shadow="xs" p="md">
            <Stack>

                <Group justify="flex-start">
                    <IconBoxPadding />
                    <Text size="sm">Your Workspaces</Text>
                </Group>
                <UserWorkspaces />
            </Stack>
        </Paper>
    )
}