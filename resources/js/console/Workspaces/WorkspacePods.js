import {useEffect, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";
import {Alert, Text, Badge, Stack, Table} from "@mantine/core";
import {IconContainer, IconInfoCircle} from "@tabler/icons";
import Panel from "../Components/Panel";


const AlertWorkspaceUsers = ({pending}) => {
    return (
        <Alert icon={<IconInfoCircle size="1rem"/>}
               title={pending ? "You have a pending request on this workspace" : "You are not part of this workspace"}
               color={pending ? "orange" : "blue"} />
    )
}

export default ({workspace}) => {
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
        <Panel title="Pods"
               icon={<IconContainer />}
               buttons={[]}>
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
                                </Stack>
                            }
                            </Table.Td>
                        </Table.Tr>
                    )}
                </Table.Tbody>
            </Table>
        </Panel>
    )
}