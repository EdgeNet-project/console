import {
    Group,
    Radio,
    TextInput,
    Textarea,
    Grid,
    LoadingOverlay,
    Button,
    Alert,
    Container, Title, Modal, Text, Stack, Select, Anchor
} from '@mantine/core';
import axios from "axios";
import React, {useEffect, useState} from "react";
import {useForm} from "@mantine/form";
import {useAuthentication} from "../Authentication";
import {IconBoxPadding as IconWorkspace, IconInfoCircle, IconUsers} from "@tabler/icons";
import {useNavigate} from "react-router-dom";
import {useDisclosure} from "@mantine/hooks";
import TeamInfo from "./TeamInfo";
import {notifications} from "@mantine/notifications";

const JoinTeamModal = ({team, title, onClose}) => {
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
        setError(null)

        const selectedTeam =
            team ? team : teams.find(w => w.name === values.name)

        axios.post('/api/requests/teams/' + selectedTeam.id, {
        })
            .then((res) => {
                console.log(res)
                loadUser()
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

                if (!error) {
                    notifications.show({
                        title: 'Join a team',
                        message: 'A request has been sent to the admins',
                    })

                    onClose()
                }
            })
    }

    const options = teams.map(d => { return {label: d.fullname, value: d.name} })

    return (
        <Modal opened onClose={onClose} title={title}>
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

const JoinTeamButton = ({team}) => {
    const [opened, { open, close }] = useDisclosure(false);

    const title = team ? "Join " + team.name + " team" : "Join a team";

    return (
        <>
            {opened && <JoinTeamModal team={team} title={title} onClose={close} />}
            <Button size="xs" onClick={open}>
                {title}
            </Button>
        </>
    )
}

const JoinTeamAnchor = ({team}) => {
    const [opened, { open, close }] = useDisclosure(false);

    const title = team ? "Join " + team.name + " team" : "Join a team";

    return (
        <>
            {opened && <JoinTeamModal team={team} title={title} onClose={close} />}
            <Anchor onClick={open}>
                {title}
            </Anchor>
        </>
    )
}

export {
    JoinTeamButton, JoinTeamAnchor
}