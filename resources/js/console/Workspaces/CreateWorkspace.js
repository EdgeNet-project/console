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
import {IconInfoCircle} from "@tabler/icons";
import {useForm} from "@mantine/form";
import axios from "axios";
import {useAuthentication} from "../Authentication";

const CreateWorkspaceModal = ({team, onClose}) => {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(false)
    const { loadUser } = useAuthentication()

    const form = useForm({
        initialValues: {
            label: '',
            name: '',
            team_id: team.id,
        },

        validate: {
            name: (value) => (/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(value) ? null : 'Invalid name'),
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
        setError(false)
        form.clearErrors()

        axios.post('/api/requests/workspaces', values)
            .then((res) => {
                loadUser()
            })
            .catch(({message, response}) => {
                setError(true)
                console.log('1==>', message);
                console.log('2==>', response.data)
                //setError(response.data.message ?? "Error joining workspace")
                form.setErrors({name: response.data.message ?? "Error creating workspace"});
            })
            .finally(() => {
                setLoading(false)

                if (!error) {
                    notifications.show({
                        title: 'Creating a new workspace',
                        message: 'A request has been sent',
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
                    <Text size="sm">
                        Please provide a label and a name for the new workspace you wish to create. <br />
                        The name will be automatically generated using the value in the label field,
                        you will also be able to modify it directly. <br />
                        A workspace name should be unique within the same team.
                    </Text>
                    <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                        <Text size="sm">
                            A request will be sent to the managers of {team.shortname} for evaluation.<br />
                            Once approved the workspace will be created under {team.fullname}.<br/>
                            <br />
                            If you are a manager of {team.shortname} the workspace will be created
                            automatically.
                        </Text>
                    </Alert>

                    <TextInput label="Label"
                               placeholder="My workspace name"
                               {...form.getInputProps('label')}
                               onChange={onLabelChange}
                    />

                    <TextInput label="Name"
                               description="You can use lowercase letters, numbers and the dash caracter"
                               placeholder="my-workspace-name"
                               {...form.getInputProps('name')} />
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