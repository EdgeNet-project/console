import {Badge, Text, Card, Group, Table, ScrollArea, Divider, ActionIcon, Modal, Button, Stack} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import createWorkspace from "./CreateWorkspace";
import {IconBoxPadding as IconWorkspace, IconEdit, IconTrash} from "@tabler/icons";
import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import axios from "axios";


export default ({team, workspaces}) => {
    const [openedConfirmDelete, { openConfirmDelete, closeConfirmDelete }] = useDisclosure(false);
    const { user } = useAuthentication()
    const [ selectedWorkspace, setSelectedWorkspace ] = useState(null)
    const [ loading, setLoading ] = useState()
    const [ error, setError ] = useState()

    useEffect(() => {
        if (selectedWorkspace) {
            openConfirmDelete()
        }

        return () => setSelectedWorkspace(null)
    }, [selectedWorkspace])

    const deleteWorkspace = () => {
        setLoading(true)

        axios.delete('/api/workspaces/' + selectedWorkspace.name)
            .then((res) => {
                console.log(res)
                closeConfirmDelete()
            })
            .catch(({ response: {data: {message, errors}}}) => {
                // console.log(message)
                setError(message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            <Modal opened={openedConfirmDelete} onClose={closeConfirmDelete} title="Confirm">
                <Stack spacing="md">
                    <Text>
                        Are you sure you want to delete {selectedWorkspace?.name}?
                    </Text>

                    {error && <Text color="red">{error}</Text>}
                    <Group position="apart">
                        <Button color="gray" onClick={closeConfirmDelete}>
                            Cancel
                        </Button>

                        <Button onClick={deleteWorkspace} disabled={loading} color="red">
                            Delete
                        </Button>
                    </Group>
                </Stack>
            </Modal>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
                <Stack sx={{height:'100%'}}>
                    <Group mb="xs">
                        <IconWorkspace />
                        <Text weight={500}>Workspaces</Text>
                    </Group>

                    <Text size="sm" color="dimmed">
                        The workspaces under {team?.name}
                    </Text>

                    {workspaces.length > 0 ?
                    <ScrollArea>
                        <Table horizontalSpacing={0} verticalSpacing="xs">
                            <thead>
                            <tr>
                                <th>Name</th>
                                <th>Users</th>
                                <th>Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {workspaces.map(workspace =>
                                <tr key={workspace.name}>
                                    <td>
                                        <Text size="xs" color="dimmed">
                                            {workspace.namespace}
                                        </Text>
                                        <Text>
                                        {workspace.name}
                                        </Text>
                                    </td>
                                    <td>

                                    </td>
                                    <td>
                                        {(user.role !== 'collaborator') && <ActionIcon onClick={()=> setSelectedWorkspace(workspace)} variant="subtle" color="red">
                                            <IconTrash size="1rem" />
                                        </ActionIcon>}
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </Table>
                    </ScrollArea> :
                    <Text size="sm">

                    </Text>
                    }

                </Stack>
            </Card>
        </>
    )
}