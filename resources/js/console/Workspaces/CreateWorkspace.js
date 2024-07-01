import {useState} from "react";
import {
    Button,
    Group,
    Modal,
    Stack,
    Text,
    TextInput,
    Alert, Anchor,
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import { notifications } from '@mantine/notifications';
import {IconAlertCircle, IconInfoCircle} from "@tabler/icons";
import {useForm} from "@mantine/form";
import axios from "axios";

const CreateWorkspaceModal = ({team, onClose}) => {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)


    const form = useForm({
        initialValues: {
            label: '',
            name: '',
            namespace: !!parent ? parent.namespace : team.namespace,
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    // console.log(team)
    const createNamespace = (str) => {
        str = str.replace(/^\s+|\s+$/g, ''); // trim
        str = str.toLowerCase();

        // remove accents, swap ñ for n, etc
        var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
        var to   = "aaaaeeeeiiiioooouuuunc------";
        for (var i=0, l=from.length ; i<l ; i++) {
            str = str.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
        }

        str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
            .replace(/\s+/g, '-') // collapse whitespace and replace by -
            .replace(/-+/g, '-'); // collapse dashes

        return str;
    }

    const onLabelChange = ({target: {value}}) => {
        form.setFieldValue('label', value);
        form.setFieldValue('name', createNamespace(value));
    }

    const handleSubmit = (values) => {
        setLoading(true)
        setError(null)

        axios.post('/api/requests/teams/' + team.id + '/workspace', values)
            .then((res) => {
                console.log(res)
                //setRegistered(true)
            })
            .catch(({message, response: {data: {errors}}}) => {
                // console.log(message)
                // setErrors(errors)
                form.setErrors(errors);
                setError('Error creating a new Workspace')
            })
            .finally(() => {
                setLoading(false)

                if (!error) {
                    notifications.show({
                        title: 'Create new workspace',
                        message: 'A request has been sent to the admins',
                    })

                    onClose()
                }
            })
    }

    if (!team) {
       return;
    }

    return (
        <Modal opened onClose={onClose} title="Create a new Workspace">
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                    <Text>
                         Please specify a label and a name for the new workspace.
                    </Text>
                    <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                        A request will be sent to the admins of {team.shortname} for evaluation.
                        Once approved the workspace will be created under {team.fullname}.<br/>
                        <br />
                        If you are an admin or owner of {team.shortname} the workspace will be created
                        automatically.
                    </Alert>
                    <TextInput label="Label" placeholder="My workspace name" withAsterisk
                               {...form.getInputProps('label')}
                               onChange={onLabelChange}
                    />

                    <TextInput label="Name" placeholder="my-workspace-name" withAsterisk
                               {...form.getInputProps('name')} />

                    {error && <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                        {error}
                    </Alert>}

                    <Group position="apart">
                        <Button disabled={loading} type="submit">
                            Submit
                        </Button>
                        <Button color="gray" onClick={onClose} variant="light">
                            Cancel
                        </Button>
                    </Group>

                </Stack>
            </form>
        </Modal>
    )
}

const CreateWorkspaceButton = ({team}) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            {opened && <CreateWorkspaceModal team={team} onClose={close} />}
            <Button size="xs" onClick={open}>
                Create a new workspace
            </Button>
        </>
    )
}

const CreateWorkspaceAnchor = ({team}) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            {opened && <CreateWorkspaceModal team={team} onClose={close} />}
            <Anchor onClick={open}>
                Create a new workspace
            </Anchor>
        </>
    )
}

export {
    CreateWorkspaceButton, CreateWorkspaceAnchor
}