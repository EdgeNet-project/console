import {
    createStyles,
    rem,
    Group,
    Radio,
    TextInput,
    Textarea,
    Grid,
    LoadingOverlay,
    Button,
    Alert,
    Container, Title
} from '@mantine/core';
import axios from "axios";
import React, {useState} from "react";
import {useForm} from "@mantine/form";
import {useAuthentication} from "../Authentication";
import {IconInfoCircle} from "@tabler/icons";
import {useNavigate} from "react-router-dom";

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
    },

    input: {
        height: rem(54),
        paddingTop: rem(18),
    },

    textArea: {
        paddingTop: rem(18),
    },

    label: {
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: theme.fontSizes.xs,
        paddingLeft: theme.spacing.sm,
        paddingTop: `calc(${theme.spacing.sm} / 2)`,
        zIndex: 1,
    },
}));

export default () => {
    const { classes } = useStyles();
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

        axios.post('/api/requests/team', {
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
        <Container>
            <Title order={1}>
                Register a new Team
            </Title>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            {error &&
                <Alert variant="light" color="red" title="Registration error" icon={<IconInfoCircle />}>
                    {error}
                </Alert>}
            <p>
                Create new top level Workspace by filling the information below,
                an administrator will review your application.
            </p>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid>
                    <Grid.Col md={8}>
                        <TextInput label="Name" placeholder="My Team Name" classNames={classes} withAsterisk
                                   {...form.getInputProps('fullname')} />
                    </Grid.Col>
                    <Grid.Col md={4}>
                        <TextInput label="Abbreviation" placeholder="MTN" classNames={classes} withAsterisk
                                   {...form.getInputProps('shortname')} />
                    </Grid.Col>
                    <Grid.Col md={12}>
                        To evaluate your application and for reporting purposes please let us know a bit more of
                        who you are and why you are using EdgeNet.
                    </Grid.Col>
                    <Grid.Col md={8}>
                        <TextInput label="Affiliation" placeholder="Université Sorbonne" classNames={classes} withAsterisk
                                   {...form.getInputProps('affiliation')} />
                    </Grid.Col>
                    <Grid.Col md={4}>
                        <TextInput label="Country" placeholder="France" classNames={classes}
                                   {...form.getInputProps('country')} />
                    </Grid.Col>
                    <Grid.Col md={12}>
                        <TextInput label="URL" placeholder="https://www.sorbonne-universite.fr" classNames={classes} withAsterisk
                                   {...form.getInputProps('url')} />
                    </Grid.Col>
                    <Grid.Col md={12}>
                        <Textarea label="What is the reason for joining?" minRows={3} autosize placeholder="" classNames={classes} withAsterisk
                                  {...form.getInputProps('joining_reason')} />
                    </Grid.Col>
                    <Grid.Col md={8}>
                        <Radio.Group label="" classNames={classes} withAsterisk
                                     {...form.getInputProps('joining_category')} >
                            <Group mt="xs">
                                <Radio value="Research" label="Research" />
                                <Radio value="Teaching" label="Teaching" />
                                <Radio value="Other" label="Other" />
                            </Group>
                        </Radio.Group>
                    </Grid.Col>
                    <Grid.Col md={4}>
                        <Button disabled={loading} type="submit" fullWidth>
                            Submit
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
        </Container>
    );
}