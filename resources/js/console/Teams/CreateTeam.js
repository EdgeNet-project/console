import {
    Group,
    Radio,
    TextInput,
    Textarea,
    Grid,
    LoadingOverlay,
    Button,
    Alert,
    Container, Title, Modal, Text, Stack
} from '@mantine/core';
import axios from "axios";
import React, {useState} from "react";
import {useForm} from "@mantine/form";
import {useAuthentication} from "../Authentication";
import {IconBoxPadding as IconWorkspace, IconInfoCircle, IconUsers} from "@tabler/icons";
import {useNavigate} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";

export default () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const { loadUser } = useAuthentication()
    const navigate = useNavigate()
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
        },
    });

    const createName = (text) => {

    }

    const handleSubmit = (values) => {
        setLoading(true)

        const name = form.values['shortname'].toLowerCase()
            .replace(/ /g,'')
            .replace(/[^\w-]+/g,'');

        axios.post('/api/requests/teams', {
            name: name, ...values
        })
            .then((res) => {
                console.log(res)
                // loadUser()
                navigate.to('/')
            })
            .catch(({message, response}) => {
                console.log('1==>', message);
                console.log('2==>', response.data)
                setError(response.data.message ?? 'Error: Team creation')
                //form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            <Modal opened={opened} onClose={close} title="Create a new Team">
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                    <Text>
                        Please specify the required information for your new team.
                    </Text>
                    <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                        A request will be sent to the admins of EdgeNet for evaluation.
                        Once approved you will have access to the new team.<br/>
                    </Alert>

                {error &&
                    <Alert variant="light" color="red" title="Registration error" icon={<IconInfoCircle />}>
                        {error}
                    </Alert>}


                            <TextInput label="Name" placeholder="My Team Name" withAsterisk
                                       {...form.getInputProps('fullname')} />

                            <TextInput label="Abbreviation" placeholder="MTN" withAsterisk
                                       {...form.getInputProps('shortname')} />

                            <Text c="dimmed">
                            To evaluate your application and for reporting purposes please let us know a bit more of
                            who you are and why you are using EdgeNet.
                            </Text>

                            <TextInput label="Affiliation" placeholder="Université Sorbonne" withAsterisk
                                       {...form.getInputProps('affiliation')} />

                            <TextInput label="Country" placeholder="France"
                                       {...form.getInputProps('country')} />

                            <TextInput label="URL" placeholder="https://www.sorbonne-universite.fr" withAsterisk
                                       {...form.getInputProps('url')} />

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

                    <Group position="apart" mt="sm">
                        <Button disabled={loading} type="submit">
                            Submit
                        </Button>
                        <Button color="gray" onClick={close} variant="light">
                            Cancel
                        </Button>
                    </Group>
                </Stack>
                </form>
            </Modal>
            <Button size="xs" onClick={open}>
                Create a new Team
            </Button>
        </>
    );
}