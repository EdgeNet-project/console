import {Alert, Badge, Stack, Table} from "@mantine/core";
import {IconInfoCircle, IconUsers} from "@tabler/icons";
import {useAuthentication} from "../Authentication";
import {UserInfo} from "../User/UserAvatar";
import Panel from "../Components/Panel";
import {JoinWorkspaceButton} from "./JoinWorkspace";
import UserEnabled from "../User/components/UserEnabled";
import UserRole from "../User/components/UserRole";

const AlertWorkspaceUsers = ({pending}) => {
    return (
        <Alert icon={<IconInfoCircle size="1rem"/>}
               title={pending ? "You have a pending request on this workspace" : "You are not part of this workspace"}
               color={pending ? "orange" : "blue"} />
    )
}

const WorkspaceUsers = ({workspace}) => {
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
                                <UserEnabled enabled={user.enabled} />
                                <UserRole role={user.pivot.role} />
                            </Stack>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    )
}

export default ({workspace}) => {
    const {user} = useAuthentication();

    const joined = user.workspaces.find(w => w.name === workspace.name);

    // if true this user has pending request on this workspace
    const pending = workspace.requests.find(r => r.user_id === user.id)

    return (
        <Panel title={workspace.name + " users"}
               icon={<IconUsers />}
               buttons={[
                   (!joined && !pending) && <JoinWorkspaceButton workspace={workspace} />
               ]}>
            {!joined && <AlertWorkspaceUsers pending={pending} />}
            <WorkspaceUsers workspace={workspace} />
        </Panel>
    )
}