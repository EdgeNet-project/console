import {Link, useNavigate} from "react-router-dom";
import {Alert, Anchor, Badge, Button, Divider, Group, Paper, Stack, Table, Text, Title} from "@mantine/core";
import {IconInfoCircle, IconUsers} from "@tabler/icons";
import {useAuthentication} from "../Authentication";
import {UserInfo} from "../User/UserAvatar";
import Panel from "../Components/Panel";

const AlertWorkspaceUsers = () => {
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

const WorkspaceUsers = ({workspace}) => {

    if (workspace.users.length <= 0) {
        return <AlertWorkspaceUsers />
    }

    return (
        <Table>
            <Table.Tbody>
                {workspace.users.map(user =>
                    <Table.Tr key={"workspace_users_"+user.id}>
                        <Table.Td>
                            <UserInfo user={user} />
                        </Table.Td>
                        <Table.Td>
                            <Stack align="flex-start" justify="center" gap="xs">
                                {user.enabled ?
                                    <Badge size="xs">Enabled</Badge> :
                                    <Badge size="xs" color="gray">Disabled</Badge>
                                }
                                <Badge size="xs" color="pink" variant="light">
                                    {user.pivot.role}
                                </Badge>
                            </Stack>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    )



}

export default ({workspace}) => {
    const navigate = useNavigate();

    return (
        <Panel title={workspace.name + " users"}
               icon={<IconUsers />}
               buttons={[
                   <Button size="xs" onClick={() => navigate('/team/create')}>Create a new Team</Button>,
                   <Button size="xs" onClick={() => navigate('/team/join')}>Join an existing Team</Button>
               ]}>
            <WorkspaceUsers workspace={workspace} />
        </Panel>
    )
}