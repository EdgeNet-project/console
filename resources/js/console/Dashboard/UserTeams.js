import {Link} from "react-router-dom";
import {Alert, Anchor, Badge, Button, Divider, Group, Paper, Stack, Table, Text, Title} from "@mantine/core";
import {IconInfoCircle, IconUsers} from "@tabler/icons";
import {useAuthentication} from "../Authentication";
import {CreateTeamButton} from "../Teams/CreateTeam";
import {JoinTeamButton} from "../Teams/JoinTeam";
import Panel from "../Components/Panel";

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

export default () => {
    const { user } = useAuthentication();

    return (
        <Panel title="Your Teams"
               icon={<IconUsers/>}
               buttons={[
                   <CreateTeamButton />,
                   <JoinTeamButton />
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
                                <Anchor component={Link} to={"/team/" + team.name}>{team.fullname}</Anchor>
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