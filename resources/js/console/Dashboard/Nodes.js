import {Link} from "react-router-dom";
import {Alert, Anchor, Divider, Group, Paper, Stack, Text} from "@mantine/core";
import {IconAlertTriangle, IconInfoCircle, IconServer} from "@tabler/icons";
import {useAuthentication} from "../Authentication";

const UserNodes = () => {
    const { user } = useAuthentication();

    if (!user.nodes) {
        return (
            <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have any nodes yet!" color="blue">
                <Text mt="xl">
                    You can contribute new nodes to the EdgeNet cluster. We support Virtual Machines,
                    bare metal servers or single board computers.
                </Text>
                <Text mt="xl">
                    You can add a new node here:
                </Text>
                <Anchor component={Link} to="/workspace/create">
                    Add a new node
                </Anchor>

            </Alert>
        )
    }
}
export default () => {

    return (
        <Paper shadow="xs" p="md">
            <Stack>

                <Group justify="flex-start">
                    <IconServer />
                    <Text size="sm">Your Nodes</Text>
                </Group>
                <UserNodes />
            </Stack>
        </Paper>
    )
}