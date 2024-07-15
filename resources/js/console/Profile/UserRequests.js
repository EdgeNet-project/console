import React from "react";
import {Code, Divider, Group, Stack, Table, Text} from "@mantine/core";
import dayjs from "dayjs";
import UserRequestStatus from "../Requests/UserRequestStatus";
import Panel from "../Components/Panel";
import {useAuthentication} from "../Authentication";
import {IconUserQuestion} from "@tabler/icons-react";


const UserRequestType = ({request}) => {
    switch(request.type) {
        case 'CreateTeam':
            return <Text size="sm">
                You asked to create a new team
            </Text>;
        case 'CreateWorkspace':
            return <Text size="sm">
                You asked to create a new workspace in {request.object?.name}
            </Text>;
        case 'JoinTeam':
            return <Text size="sm">
                You asked to join the team {request.object?.fullname} ({request.object?.shortname})
            </Text>;
        case 'JoinWorkspace':
            return <Text size="sm">
                You asked to join the workspace {request.object?.name}
            </Text>;
    }

}

export default () => {
    const {user} = useAuthentication()

    if (!user.requests || user.requests.length <= 0) {
        return null;
    }

    return (
            <Panel title="Requests"
                   icon={<IconUserQuestion />}
                   help="The following are the requests that you have initiated and their status."
                   buttons={[]}>
                <Stack>
                {user.requests.map((r) =>
                    <div key={'own-request-' + r.id}>
                        <Divider my="sm"/>
                        <Group justify="space-between" align="flex-start">
                            <div>
                                <Text c="dimmed" size="sm">{dayjs(r.created_at).format('DD/MM/YYYY HH:mm')}</Text>
                                <UserRequestType request={r} />
                            </div>

                            <UserRequestStatus status={r.status} />
                        </Group>

                        {r.message && <Text size="sm">{r.message}</Text>}
                        {r.data && <Code block>{JSON.stringify(r.data, null, 4)}</Code>}
                    </div>
                )}
                </Stack>
            </Panel>



    )
}