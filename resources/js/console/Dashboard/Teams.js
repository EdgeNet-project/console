import {Link} from "react-router-dom";
import {Alert, Anchor, Divider, Group, Paper, Stack, Text} from "@mantine/core";
import {IconAlertTriangle, IconInfoCircle, IconUsers} from "@tabler/icons";
import {useAuthentication} from "../Authentication";

const UserTeam = () => {
    const { user } = useAuthentication();

    if (user.tenants.length > 0) {
        return (
            <Stack>
                {user.tenants.map(tenant => <div key={"userteam_tenant_"+tenant.id}>
                    <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                        {tenant.name}
                    </Text>
                    <Text fz="md" fw={500}>
                        {tenant.fullname}
                    </Text>
                </div>)}
            </Stack>
        );

    }

    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have a team yet!" color="blue">

            <Text mt="xl">
                If you are a professor or researcher and manage a team you can create one here.
            </Text>
            <Anchor component={Link} to="/team/registration">
                Register a new Team
            </Anchor>

            <Text mt="xl">
                If instead you want to joi a team you can do so by selecting th institutution you are part of.
            </Text>
            <Anchor component={Link} to="/team/join">
                Join an existing Team
            </Anchor>

            <Text mt="xl">
                An EdgeNet admin will review your application as soon as possible.
            </Text>

        </Alert>
    )

}
export default () => {

    return (
        <Paper p="md">
            <Stack>
                <Group justify="flex-start">
                    <IconUsers />
                    <Text size="sm">Your Teams</Text>
                </Group>
                <Alert icon={<IconAlertTriangle size="1rem"/>} title="A request is pending" color="orange">
                    This is an example of a request pending
                </Alert>
                <UserTeam />
            </Stack>
        </Paper>
    )
}