import {Link} from "react-router-dom";
import {Alert, Anchor, Button, Divider, Group, Paper, Stack, Table, Text, Title} from "@mantine/core";
import {IconInfoCircle, IconUsers} from "@tabler/icons";
import {useAuthentication} from "../Authentication";
import CreateTeam from "../Teams/CreateTeam";

const AlertUserTeam = () => {
    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have a team yet!" color="blue">
            <Stack>
                <Text size="sm">
                    If you are a professor or researcher and manage a team you can create one here.
                    An EdgeNet admin will review your application as soon as possible.
                    <br />
                </Text>
                <Anchor component={Link} to="/team/registration">
                    Register a new Team
                </Anchor>

                <Text size="sm">
                    If instead you want to joi a team you can do so by selecting th institution you are part of.
                    <br />
                    <Anchor component={Link} to="/team/join">
                        Join an existing Team
                    </Anchor>
                </Text>
            </Stack>
        </Alert>
    )
}

const UserTeam = () => {
    const { user } = useAuthentication();

    if (user.tenants.length <= 0) {
        return <AlertUserTeam />
    }

    return (
        <Table>
            <Table.Tbody>
                {user.tenants.map(tenant =>
                    <Table.Tr key={"userteam_tenant_"+tenant.id}>
                        <Table.Td>
                            <Text fz="xs" tt="uppercase" c="dimmed">
                                {tenant.name}
                            </Text>
                            <Text fz="md">
                                {tenant.fullname}
                            </Text>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    )



}
export default () => {

    return (
        <Paper p="md">
            <Stack justify="space-between">
                <Stack>
                    <Group justify="flex-start">
                        <IconUsers />
                        <Title order={2} size="h4">Your Teams</Title>
                    </Group>
                    <UserTeam />
                </Stack>
                <Stack>
                    <Divider />
                    <Group justify="flex-end">
                        <CreateTeam />
                        <Button size="xs" onClick={() => navigate('/team/join')}>Join an existing Team</Button>
                    </Group>
                </Stack>
            </Stack>
        </Paper>
    )
}