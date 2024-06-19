import {Link, useNavigate} from "react-router-dom";
import {Alert, Anchor, Button, Divider, Group, Paper, Stack, Table, Text, Title} from "@mantine/core";
import {IconBoxPadding, IconInfoCircle} from "@tabler/icons";
import {useAuthentication} from "../Authentication";

const AlertUserWorkspaces = () => {
    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have any workspaces yet!" color="blue">
            <Stack>
                <Text size="sm">
                    You can create a new workspace here: <br />
                    <Anchor component={Link} to="/workspace/create">
                        Create a new Workspace
                    </Anchor>
                </Text>
                <Text size="sm">
                    You can join an existing workspace here: <br />
                    <Anchor component={Link} to="/workspace/join">
                        Join an existing Workspace
                    </Anchor>
                </Text>
            </Stack>
        </Alert>
    )
}

const UserWorkspaces = () => {
    const { user } = useAuthentication();

    if (!user.subnamespaces || user.subnamespaces?.length <= 0) {
        return <AlertUserWorkspaces />
    }

    return (
        <Table>
            <Table.Tbody>
                {user.subnamespaces.map(subnamespace =>
                    <Table.Tr key={"userworkspaces_"+subnamespace.id}>
                        <Table.Td>
                            <Text fz="xs" tt="uppercase" c="dimmed">
                                {subnamespace.tenant}
                            </Text>
                            <Text fz="md">
                                {subnamespace.name}
                            </Text>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    )
}

export default () => {
    const navigate = useNavigate();

    return (
        <Paper p="md">
            <Stack>
                <Group justify="flex-start">
                    <IconBoxPadding />
                    <Title order={2} size="h4">Your Workspaces</Title>
                </Group>
                <UserWorkspaces />
                <Divider />
                <Group justify="flex-end">
                    <Button size="xs" onClick={() => navigate('/workspace/create')}>Create a new Workspace</Button>
                    <Button size="xs" onClick={() => navigate('/workspace/join')}>Join an existing Workspace</Button>
                </Group>
            </Stack>
        </Paper>
    )
}