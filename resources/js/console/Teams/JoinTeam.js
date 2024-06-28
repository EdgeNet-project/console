import {
    Group,
    Radio,
    TextInput,
    Textarea,
    Grid,
    LoadingOverlay,
    Button,
    Alert,
    Container, Title, Modal, Text, Stack, Select
} from '@mantine/core';
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useAuthentication} from "../Authentication";
import {IconBoxPadding as IconWorkspace, IconInfoCircle, IconUsers} from "@tabler/icons";
import {useNavigate} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import TeamInfo from "./TeamInfo";

export default () => {
    const [opened, { open, close }] = useDisclosure(false);
    const [ teams, setTeams ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const { loadUser } = useAuthentication()
    const navigate = useNavigate()
    // const [ registered, setLoading ] = useState(false)

    const form = useForm({
        initialValues: {
            name: '',
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    useEffect(() => {
        axios.get('/api/tenants')
            .then(({data}) => {
                setTeams(data)
            });
    }, []);

    const handleSubmit = (values) => {
        setLoading(true)

        axios.post('/api/requests/teams/' + values.name, {
        })
            .then((res) => {
                console.log(res)
                // loadUser()
                //navigate.to('/')
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

    const options = teams.map(d => { return {label: d.fullname, value: d.name} })

    return (
        <>
            <Modal opened={opened} onClose={close} title="Join a Team">
                <LoadingOverlay visible={loading} overlayBlur={2} />
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">
                        <Text>
                            Please specify the team you want to join.
                        </Text>
                        <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                            A request will be sent to the admins of the team for evaluation.
                            Once approved you will have access to the new team.<br/>
                        </Alert>

                        {error &&
                            <Alert variant="light" color="red" title="Registration error" icon={<IconInfoCircle />}>
                                {error}
                            </Alert>}

                        <Select
                            data={options}
                            // inputContainer={(children) => {
                            //     console.log(children)
                            //     return <div>{children}</div>
                            // }}
                            // itemComponent={SelectItem}
                            placeholder="EdgeNet Teams"
                            searchable
                            clearable
                            {...form.getInputProps('name')}
                            // onChange={handleSelect}
                        />
                        {
                            form.values.name && <TeamInfo team={teams.find(t => t.name === form.values.name)} />
                        }

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
                Join a Team
            </Button>
        </>
    );
}