import {
    Group,
    LoadingOverlay,
    Button,
    Alert,
    Modal, Text, Stack, Select, Anchor, TextInput
} from '@mantine/core';
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useAuthentication} from "../Authentication";
import {IconInfoCircle} from "@tabler/icons";
import {useDisclosure} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";

const JoinWorkspaceModal = ({workspace, title, onClose}) => {
    const [ teams, setTeams ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
    const { loadUser } = useAuthentication()

    const form = useForm({
        initialValues: {
            team_id: "",
            name: workspace ? workspace.name : "",
        },

        validate: {
            name: (value) => (/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) ? null : 'Invalid name'),
        },
    });

    useEffect(() => {
        axios.get('/api/tenants')
            .then(({data}) => {
                setTeams(data.map(d => { return {label: d.fullname, value: ""+d.id} }))
            });
    }, []);

    const handleSubmit = (values) => {
        setLoading(true)
        setError(false)
        form.clearErrors()

        //console.log(values)
        // const selectedWorkspace =
        //     workspace ? workspace : workspaces.find(w => w.id == values.id)

        axios.patch('/api/requests/workspaces/', values)
            .then((res) => {
                loadUser()
            })
            .catch(({message, response}) => {
                setError(true)
                console.log('1==>', message);
                console.log('2==>', response.data)
                //setError(response.data.message ?? "Error joining workspace")
                form.setErrors({name: response.data.message ?? "Error joining workspace"});
            })
            .finally(() => {
                setLoading(false)

                if (!error) {
                    notifications.show({
                        title: 'Join a workspace',
                        message: 'A request has been sent',
                    })

                    setError(false)
                    onClose()
                }
            })
    }

    return (
            <Modal opened onClose={onClose} title={title}>
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">

                        {workspace ?
                            <>
                                <Text>
                                    Please submit if you wish to join the workspace {workspace.name}.
                                </Text>
                                <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                                    A request will be sent to the managers of the workspace {workspace.name} for evaluation.
                                    Once approved you will have access to the workspace.<br/>
                                </Alert>
                                {/*<WorkspaceInfo workspace={workspace} />*/}
                            </> :
                            <>
                                <Text>
                                    Please provide the team and name of the workspace you wish to join.
                                </Text>
                                <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                                    Ask your team manager for the name of the workspace that you want to join. <br />
                                    A request will be sent for evaluation.<br />
                                    Once approved you will have access to the workspaces.
                                </Alert>

                                <Select
                                    label="Team"
                                    description="The workspace is part of this team"
                                    data={teams}
                                    placeholder="My Team Name"
                                    searchable
                                    clearable
                                    {...form.getInputProps('team_id')}
                                />

                                <TextInput
                                    label="Workspace name"
                                    description="This is a name that identifies the workspace you want to join"
                                    placeholder="example-workspace"
                                    {...form.getInputProps('name')}
                                />
                                {/*<Select*/}
                                {/*    data={options}*/}
                                {/*    // inputContainer={(children) => {*/}
                                {/*    //     console.log(children)*/}
                                {/*    //     return <div>{children}</div>*/}
                                {/*    // }}*/}
                                {/*    // itemComponent={SelectItem}*/}
                                {/*    placeholder="EdgeNet Workspaces"*/}
                                {/*    searchable*/}
                                {/*    clearable*/}
                                {/*    {...form.getInputProps('id')}*/}
                                {/*    // onChange={handleSelect}*/}
                                {/*/>*/}
                                {/*{*/}
                                {/*    form.values.id && <WorkspaceInfo workspace={workspaces.find(w => w.id === form.values.id)} />*/}
                                {/*}*/}
                            </>
                        }
                        {error &&
                            <Alert variant="light" color="red" icon={<IconInfoCircle />}>
                                {error}
                            </Alert>
                        }

                        <Group justify="flex-end" mt="sm">
                            <Button color="gray" onClick={onClose} variant="light">
                                Cancel
                            </Button>
                            <Button disabled={loading} type="submit">
                                Submit
                            </Button>
                        </Group>
                    </Stack>
                </form>
            </Modal>

    );
}

const JoinWorkspaceButton = ({workspace}) => {
    const [opened, { open, close }] = useDisclosure(false);

    const title = workspace ? "Join " + workspace.name + " workspace" : "Join a workspace";

    return (
        <>
            {opened && <JoinWorkspaceModal workspace={workspace} title={title} onClose={close} />}
            <Button size="xs" onClick={open}>
                {title}
            </Button>
        </>
    )
}

const JoinWorkspaceAnchor = ({workspace}) => {
    const [opened, { open, close }] = useDisclosure(false);

    const title = workspace ? "Join " + workspace.name + " workspace" : "Join a workspace";

    return (
        <>
            {opened && <JoinWorkspaceModal workspace={workspace} title={title} onClose={close} />}
            <Anchor onClick={open}>
                {title}
            </Anchor>
        </>
    )
}

export {
    JoinWorkspaceButton, JoinWorkspaceAnchor
}