import {useEffect, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import {Alert, Text, Badge, Stack, Table, Group} from "@mantine/core";
import {IconContainer, IconInfoCircle} from "@tabler/icons-react";
import Panel from "../Components/Panel";
import {useAuthentication} from "../Authentication";
import PodLog from "../Pods/PodLog";


const AlertWorkspaceUsers = ({pending}) => {
    return (
        <Alert icon={<IconInfoCircle size="1rem"/>}
               title={pending ? "You have a pending request on this workspace" : "You are not part of this workspace"}
               color={pending ? "orange" : "blue"} />
    )
}

const WorkspacePods = ({workspace}) => {
    const [pods, setPods] = useState([]);

    useEffect(() => {

        axios.get('/api/pods', {
            params: {namespace: workspace.namespace}
        })
            .then(({data}) => {
                setPods(data)
            })

    }, [workspace])

    return (
            <Table>
                <Table.Tbody>
                    {pods.map(pod =>
                        <Table.Tr key={"workspace_pods_"+pod.name}>
                            <Table.Td>
                                <Text size="md">
                                    {pod.name}
                                </Text>
                                {pod.status &&
                                <>
                                    <Text size="sm" c="dimmed">
                                        {pod.status.podIP}
                                    </Text>
                                    <Text size="sm" c="dimmed">
                                        {pod.status.hostIP}
                                    </Text>
                                </>
                                }
                            </Table.Td>
                            <Table.Td>
                            {pod.status &&
                                <Stack align="flex-end" justify="center" gap="xs">
                                    <Badge size="xs" color={pod.status.phase === "Running" ? "green" : "gray"}>{pod.status.phase}</Badge>
                                    <Text size="sm" c="dimmed">
                                    {dayjs(pod.status.startTime).format('DD/MM/YYYY HH:mm')}
                                    </Text>
                                    <Group>
                                        <PodLog pod={pod} />
                                    </Group>
                                </Stack>
                            }
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
    )
}

export default ({workspace}) => {
    const { user } = useAuthentication();

    if (!user.workspaces.find(w => w.name === workspace.name)) {
        return null;
    }

    return (
        <Panel title="Pods"
               icon={<IconContainer />}
               buttons={[]}>
            <WorkspacePods workspace={workspace} />
        </Panel>
    );
}