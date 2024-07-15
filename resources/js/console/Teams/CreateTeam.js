import {
    Group,
    Radio,
    TextInput,
    Textarea,
    LoadingOverlay,
    Button,
    Alert,
    Modal, Text, Stack, Anchor
} from '@mantine/core';
import axios from "axios";
import React, {useState} from "react";
import {useForm} from "@mantine/form";
import {useAuthentication} from "../Authentication";
import {IconInfoCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import {notifications} from "@mantine/notifications";

const url_expression = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi;
const CreateTeamDialog = ({title, onClose}) => {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const { loadUser } = useAuthentication()
    // const [ registered, setLoading ] = useState(false)

    const form = useForm({
        initialValues: {
            fullname: '',
            shortname: '',
            affiliation: '',
            country: '',
            url: '',
            joining_reason: '',
            joining_category: '',
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            url: (value) => (url_expression.test(value) ? null : 'Invalid URL')
        },
    });

    const handleSubmit = (values) => {
        setLoading(true)

        const name = form.values['shortname'].toLowerCase()
            .replace(/ /g,'')
            .replace(/[^\w-]+/g,'');

        axios.post('/api/requests/teams', {
            name: name, ...values
        })
            .then((res) => {

                loadUser()

                notifications.show({
                    title: 'Create a new team',
                    message: 'A request has been sent to the admins',
                })

                onClose()

            })
            .catch(({message, response}) => {
                console.log('1==>', message);
                console.log('2==>', response.data)
                form.setErrors({shortname: response.data.message ?? "Error creating team"});
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
            <Modal opened onClose={onClose} title={title}>
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                    <Text size="sm">
                        Please specify the required information for your new team.
                    </Text>
                    <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                        <Text size="sm">
                            A request will be sent to the admins of EdgeNet for evaluation.
                            Once approved you will have access to the new team.
                        </Text>
                    </Alert>

                    <TextInput label="Name" placeholder="My Team Name" withAsterisk
                               {...form.getInputProps('fullname')} />

                    <TextInput label="Abbreviation" placeholder="MTN" withAsterisk
                               {...form.getInputProps('shortname')} />

                    <Text c="dimmed" size="sm">
                        To evaluate your application and for reporting purposes please let us know a bit more of
                        who you are and why you are using EdgeNet.
                    </Text>

                    <TextInput label="Affiliation" placeholder="Université Sorbonne" withAsterisk
                               {...form.getInputProps('affiliation')} />

                    <Group grow>
                        <TextInput label="URL" placeholder="https://www.sorbonne-universite.fr" withAsterisk
                                   {...form.getInputProps('url')} />
                        <TextInput label="Country" placeholder="France"
                                   {...form.getInputProps('country')} />
                    </Group>

                    <Textarea label="What is the reason for joining?" minRows={3} autosize placeholder="" withAsterisk
                              {...form.getInputProps('joining_reason')} />

                    <Radio.Group label="" withAsterisk
                                 {...form.getInputProps('joining_category')} >
                        <Group mt="xs">
                            <Radio value="Research" label="Research" />
                            <Radio value="Teaching" label="Teaching" />
                            <Radio value="Other" label="Other" />
                        </Group>
                    </Radio.Group>

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


const CreateTeamButton = () => {
    const [opened, { open, close }] = useDisclosure(false);

    const title = "Create a new team";

    return (
        <>
            {opened && <CreateTeamDialog title={title} onClose={close} />}
            <Button size="xs" onClick={open}>
                {title}
            </Button>
        </>
    )
}

const CreateTeamAnchor = ({workspace}) => {
    const [opened, { open, close }] = useDisclosure(false);

    const title = "Create a new team";

    return (
        <>
            {opened && <CreateTeamDialog title={title} onClose={close} />}
            <Anchor onClick={open}>
                {title}
            </Anchor>
        </>
    )
}

export {
    CreateTeamButton, CreateTeamAnchor
}