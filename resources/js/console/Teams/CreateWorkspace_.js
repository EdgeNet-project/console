import {useState} from "react";
import {
    Button,
    Group,
    Modal, rem,
    Stack,
    Text,
    TextInput,
    Alert,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme, Title, LoadingOverlay, Container,
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {IconBoxPadding as IconWorkspace, IconAlertCircle, IconInfoCircle} from "@tabler/icons";
import {useForm} from "@mantine/form";
import axios from "axios";
import {useParams} from "react-router";
import {useNavigate} from "react-router-dom";

export default ({team, parent = null}) => {
    const theme = useMantineTheme();
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const navigate = useNavigate()

    const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]

    const form = useForm({
        initialValues: {
            label: '',
            name: '',
            // namespace: !!parent ? parent.namespace : team.namespace,
            parent: !!parent ? 'subnamespace' : 'tenant',
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

        axios.post('/api/tenants/' + team.name + '/subnamespaces', values)
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
            })
    }


    return (
        <Container>
            <Title order={1}>
                Create a new Workspace
            </Title>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            {error &&
                <Alert variant="light" color="red" title="Registration error" icon={<IconInfoCircle />}>
                    {error}
                </Alert>}
            <p>
                Create new Workspace by filling the information below,
                an administrator will review your application.
            </p>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                    <Text>
                        Create a new workspace under the team <br />

                        <br />
                        The name must be unique.
                    </Text>
                    <TextInput label="Label" placeholder="My workspace name" withAsterisk
                               {...form.getInputProps('label')}
                               onChange={onLabelChange}
                    />

                    <TextInput label="Name" placeholder="my-workspace-name" withAsterisk
                               {...form.getInputProps('name')} />

                    {error && <Alert icon={<IconAlertCircle size="1rem" />} color="red">
                        {error}
                    </Alert>}

                    <Group >
                        <Button disabled={loading} type="submit">
                            Submit
                        </Button>
                        <Button color="gray" onClick={() => navigate('/')}>
                            Cancel
                        </Button>


                    </Group>

                </Stack>
            </form>

        </Container>

    )
}