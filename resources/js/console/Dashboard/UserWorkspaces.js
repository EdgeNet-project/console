import {Alert, Anchor, Badge, Stack, Table, Text} from "@mantine/core";
import {IconBoxPadding, IconInfoCircle} from "@tabler/icons";
import {useAuthentication} from "../Authentication";
import Panel from "../Components/Panel";
import {JoinWorkspaceButton} from "../Workspaces/JoinWorkspace";
import {Link} from "react-router-dom";

const AlertUserWorkspaces = ({create}) => {
    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have any workspaces yet!" color="blue">
            <Stack>
                <Text size="sm">
                    you need a workspace in order to deploy workload on EdgeNet

                    To create a new workspace select a team or workspace first, otherwise you can join
                    an existing workspace.
                </Text>
            </Stack>
        </Alert>
    )
}

export default () => {
    const {user} = useAuthentication();

    return (
        <Panel title="Your workspaces"
               icon={<IconBoxPadding/>}
               buttons={[
                   <JoinWorkspaceButton key="join_workspace_button" />
               ]}>
            {(!user.workspaces || user.workspaces?.length <= 0) &&
                <AlertUserWorkspaces create={user.workspaces?.length > 0} />}
            <Table>
                <Table.Tbody>
                    {user.workspaces.map(workspace =>
                        <Table.Tr key={"userworkspaces_" + workspace.name}>
                            <Table.Td>
                                <Text fz="xs" tt="uppercase" c="dimmed">
                                    {workspace.team?.name}
                                </Text>
                                <Text fz="md">
                                    <Anchor component={Link} to={"/workspaces/" + workspace.id}>{workspace.name}</Anchor>
                                </Text>
                            </Table.Td>
                            <Table.Td>
                                <Badge size="xs" color="pink" variant="light">
                                    {workspace.role}
                                </Badge>
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </Panel>
    )
}