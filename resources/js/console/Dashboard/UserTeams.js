import {Link} from "react-router-dom";
import {Alert, Anchor, Badge, Button, Divider, Group, Paper, Stack, Table, Text, Title} from "@mantine/core";
import {IconInfoCircle, IconUsers} from "@tabler/icons";
import {useAuthentication} from "../Authentication";
import {CreateTeamButton} from "../Teams/CreateTeam";
import {JoinTeamButton} from "../Teams/JoinTeam";
import Panel from "../Components/Panel";

const AlertUserTeam = () => {
    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="You haven't yet joined a team!" color="blue">
            <Stack>
                <Text size="sm">
                    If you want to join a team you can do so by selecting
                    the institution you are part of.
                </Text>
                <Text size="sm">
                    If you are a professor or researcher and manage a team you can create one here.
                    An EdgeNet admin will review your application as soon as possible.
                </Text>
            </Stack>
        </Alert>
    )
}

export default () => {
    const { user } = useAuthentication();

    return (
        <Panel title="Your Teams"
               icon={<IconUsers/>}
               buttons={[
                   <CreateTeamButton key="create_team_button" />,
                   <JoinTeamButton key="join_team_button" />
               ]}>
            {(user.teams?.length <= 0) && <AlertUserTeam />}
        <Table>
            <Table.Tbody>
                {user.teams.map(team =>
                    <Table.Tr key={"userteam_tenant_"+team.name}>
                        <Table.Td>
                            <Text fz="xs" tt="uppercase" c="dimmed">
                                {team.shortname}
                            </Text>
                            <Text fz="md">
                                <Anchor component={Link} to={"/teams/" + team.name}>{team.fullname}</Anchor>
                            </Text>
                        </Table.Td>
                        <Table.Td>
                            <Badge size="xs" color="pink" variant="light">
                                {team.role}
                            </Badge>
                        </Table.Td>
                    </Table.Tr>
                )}
            </Table.Tbody>
        </Table>
        </Panel>
    )

}