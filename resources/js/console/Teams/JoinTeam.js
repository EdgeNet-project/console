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
import {IconInfoCircle} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";
import TeamInfo from "./components/TeamInfo";
import {notifications} from "@mantine/notifications";

const JoinTeamModal = ({title, onClose}) => {
    const [ teams, setTeams ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const { loadUser } = useAuthentication()

    const form = useForm({
        initialValues: {
            team_id: "",
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    useEffect(() => {
        axios.get('/api/tenants')
            .then(({data}) => {
                setTeams(data.map(d => { return {label: d.fullname + " (" + d.name + ")", value: ""+d.id} }))
            });
    }, []);

    const handleSubmit = (values) => {
        setLoading(true)
        form.clearErrors()

        axios.patch('/api/requests/teams', values)
            .then((res) => {
                console.log(res)
                loadUser()

                notifications.show({
                    title: 'Join a team',
                    message: 'A request has been sent.',
                })

                onClose()

            })
            .catch(({message, response}) => {
                console.log('1==>', message);
                console.log('2==>', response.data)
                form.setErrors({team_id: response.data.message ?? "Error joining a team"});
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
                        Please specify the team you want to join.
                    </Text>
                    <Alert icon={<IconInfoCircle size="1rem"/>} size="sm">
                        <Text size="sm">
                            A request will be sent to the admins of the team for evaluation.
                            Once approved you will have access to the new team.
                        </Text>
                    </Alert>

                    <Select
                        label="Team"
                        description="Select the team you want to be part of"
                        data={teams}
                        placeholder="EdgeNet Teams"
                        searchable
                        clearable
                        {...form.getInputProps('team_id')}
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