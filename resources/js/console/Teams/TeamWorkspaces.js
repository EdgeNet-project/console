import {Link, useNavigate} from "react-router-dom";
import {Alert, Anchor, Button, Divider, Group, Paper, Stack, Table, Text, Title} from "@mantine/core";
import {IconBoxPadding, IconInfoCircle} from "@tabler/icons";
import Panel from "../Components/Panel";
import CreateWorkspace from "./CreateWorkspace";

const AlertTeamWorkspaces = () => {
    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You don't have any workspaces yet!" color="blue">
            <Stack>
                <Text size="sm">
                    A workspace is a logical unit to organize your projects and DevOps projects and
                    manage app templates and app repositories. It is the place for you to control
                    resource access and share resources within your team in a secure way. <br />
                    You can create a new workspace here: <br />
                    <Anchor component={Link} to="/workspace/create">
                        Create a new Workspace
                    </Anchor>
                </Text>
            </Stack>
        </Alert>
    )
}

const TeamWorkspaces = ({team}) => {

    if (!team.subnamespaces || team.subnamespaces?.length <= 0) {
        return <AlertTeamWorkspaces />
    }

    return (
        <Table>
            <Table.Tbody>
                {team.subnamespaces.map(subnamespace =>
                    <Table.Tr key={"userworkspaces_"+subnamespace.id}>
                        <Table.Td>
                            <Text fz="xs" tt="uppercase" c="dimmed">
                                {subnamespace.namespace}
                            </Text>
                            <Text fz="md">
                                <Anchor component={Link} to={"/workspaces/" + subnamespace.id}>{subnamespace.name}</Anchor>
                            </Text>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
    )
}

export default ({team}) => {
    const navigate = useNavigate();

    return (
        <Panel title={team.shortname + " workspaces"}
               icon={<IconBoxPadding />}
               buttons={[
                   <CreateWorkspace team={team} />
                   // <Button size="xs" onClick={() => navigate('/workspace/create')}>Create a new Workspace</Button>
               ]}>
            <TeamWorkspaces team={team} />
        </Panel>
    )
}