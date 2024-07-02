import {
    Group,
    LoadingOverlay,
    Button,
    Alert,
    Modal, Text, Stack, Select, Anchor
} from '@mantine/core';
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useAuthentication} from "../Authentication";
import {IconInfoCircle} from "@tabler/icons";
import {useDisclosure} from "@mantine/hooks";
import WorkspaceInfo from "./WorkspaceInfo";
import {notifications} from "@mantine/notifications";

const JoinWorkspaceModal = ({workspace, title, onClose}) => {
    const [ workspaces, setWorkspaces ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const { loadUser } = useAuthentication()

    const form = useForm({
        initialValues: {
            id: workspace ? ""+workspace.id : "",
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    useEffect(() => {
        axios.get('/api/subnamespaces')
            .then(({data}) => {
                setWorkspaces(data)
            });
    }, []);

    const handleSubmit = (values) => {
        setLoading(true)
        setError(null)

        console.log(values)
        const selectedWorkspace =
            workspace ? workspace : workspaces.find(w => w.id == values.id)

        axios.post('/api/requests/workspaces/' + selectedWorkspace.id)
            .then((res) => {
                console.log(res)
                loadUser()
                //navigate.to('/')
            })
            .catch(({message, response}) => {
                console.log('1==>', message);
                console.log('2==>', response.data)
                setError(response.data.message ?? 'Error: Join workspace')
                //form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)

                if (!error) {
                    notifications.show({
                        title: 'Join a workspace',
                        message: 'A request has been sent to the admins',
                    })

                    onClose()
                }
            })
    }

    const options = workspaces.map(d => { return {label: d.name, value: ""+d.id} })

    return (
            <Modal opened onClose={onClose} title={title}>
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">

                        {workspace ?
                            <>
                                <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                                    A request will be sent to the admins of the workspace {workspace.name} for evaluation.
                                    Once approved you will have access to the workspaces.<br/>
                                </Alert>
                                <WorkspaceInfo workspace={workspace} />
                            </> :
                            <>
                                <Text>
                                    Please specify the workspace you want to join.
                                </Text>
                                <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                                    A request will be sent to the admins of the workspace for evaluation.
                                    Once approved you will have access to the workspaces.<br/>
                                </Alert>

                                <Select
                                    data={options}
                                    // inputContainer={(children) => {
                                    //     console.log(children)
                                    //     return <div>{children}</div>
                                    // }}
                                    // itemComponent={SelectItem}
                                    placeholder="EdgeNet Workspaces"
                                    searchable
                                    clearable
                                    {...form.getInputProps('id')}
                                    // onChange={handleSelect}
                                />
                                {
                                    form.values.id && <WorkspaceInfo workspace={workspaces.find(w => w.id == form.values.id)} />
                                }
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