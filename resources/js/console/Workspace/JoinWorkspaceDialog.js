import {useEffect, useState} from "react";
import {
    Button,
    createStyles,
    Group,
    Modal, rem,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {IconBoxPadding as IconWorkspace} from "@tabler/icons";
import {useForm} from "@mantine/form";
import axios from "axios";
import WorkspaceSelect from "./WorkspaceSelect";
import {useAuthentication} from "../Authentication";
const SuccessMessage = ({close}) => {

    return (
        <Stack spacing="md">
            <Text>A request has been sent</Text>
            <Group position="right">
                <Button color="gray" onClick={close}>
                    Close
                </Button>
            </Group>
        </Stack>
    )
}

export default ({workspace = null}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [ error, setError ] = useState()
    const [ success, setSuccess ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const { user } = useAuthentication()

    useEffect(() => {
        if (workspace) {
            form.setFieldValue('namespace', workspace.namespace)
        }

        return () => {
            form.setFieldValue('namespace', '')
        }
    }, [workspace])


    const form = useForm({
        initialValues: {
            firstname: user.firstname ?? '',
            lastname: user.lastname ?? '',
            email: user.email,
            namespace: '',
        },
    });

    const selectWorkspace = (workspace) => {
        form.setFieldValue('namespace', workspace.namespace)
    }

    const handleSubmit = (values) => {
        setLoading(true)

        axios.post('/api/requests/roles', values)
            .then((res) => {
                console.log(res)
                //setRegistered(true)
            })
            .catch(({ response: {data: {message, errors}}}) => {
                // console.log(message)
                setError(message)
                form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            <Modal opened={opened} onClose={close} title={workspace ? 'Join ' + workspace.name : 'Join a Workspace'}>
                {success ? <SuccessMessage close={close}/> :
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">
                        <Text>
                            {workspace ? 'A request will be sent to the admins of ' + workspace.name + ' for approval.' :
                            'Select a Workspace to join, a request will be sent to the managers.'}
                        </Text>

                        {!workspace && <WorkspaceSelect withinPortal onChange={selectWorkspace} />}

                        {error && <Text color="red">{error}</Text>}
                        <Group position="apart">
                            <Button color="gray" onClick={close}>
                                Cancel
                            </Button>

                            <Button disabled={loading} type="submit">
                                Submit
                            </Button>
                        </Group>

                    </Stack>
                </form>
                }
            </Modal>
            <Button leftIcon={<IconWorkspace />} onClick={open}>
                {workspace ? 'Join ' + workspace.name : 'Join a Workspace'}
            </Button>
        </>

    )
}