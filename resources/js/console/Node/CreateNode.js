import {useState} from "react";
import {
    Alert,
    Button, Checkbox, Container,
    Divider,
    Group, LoadingOverlay,
    Blockquote, Radio,
    Stack,
    Text,
    TextInput,
    ThemeIcon, Title,
    UnstyledButton,
    useMantineTheme
} from "@mantine/core";
import {IconInfoCircle, IconSquarePlus} from "@tabler/icons";
import {useForm} from "@mantine/form";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const NodeTypeInfo = ({type}) => {

    switch(type) {
        case 'metal':
            return (
                    <Alert icon={<IconInfoCircle size="1rem"/>} color="blue">
                        A physical server with at least 4GB of RAM, 4+ cores CPU and 500GB of disk space.<br />
                        Installation is performed with a USB key that you can prepare with a
                        program like <a target="_blank" href="https://etcher.balena.io/">Balena Etcher</a> or <a target="_blank" href="https://rufus.ie/en/">Rufus</a>.
                    </Alert>
                )
        case 'vm':
            return (
                <Alert icon={<IconInfoCircle size="1rem"/>} color="blue">
                    A virtual machine.
                </Alert>
            )
        case 'odroid':
            return (
                <Alert icon={<IconInfoCircle size="1rem"/>} color="blue">
                    You have an ODROID single board computer that we provided.
                </Alert>
            )
    }

    return null;

}

export default function CreateNode() {
    const [ loading, setLoading ] = useState(false)
    const [ error, setError ] = useState(null)
    const navigate = useNavigate()

    const form = useForm({
        initialValues: {
            type: null,
            dhcp: true,
            hostname: '',
            ipv4: '',
            notes: '',
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleSubmit = (values) => {
        setLoading(true)

        axios.post('/api/nodes', values)
            .then((res) => {
                console.log(res)
                form.reset();
                navigate('/nodes');
                //setRegistered(true)
            })
            .catch(({message, response: {data: {errors}}}) => {
                console.log(message, errors)
                // setErrors(errors)
                form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <Container>
            <Title order={1}>
                Add a new Node
            </Title>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            {error &&
                <Alert variant="light" color="red" title="Registration error" icon={<IconInfoCircle />}>
                    {error}
                </Alert>}
            <p>
                Add a new node to your account.
            </p>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">

                    <Radio.Group label="Node type"  withAsterisk
                                 {...form.getInputProps('type')} >
                        <Group mt="xs">
                            <Radio value="metal" label="Physical server" />
                            <Radio value="vm" label="Virtual Machine" />
                            <Radio value="odroid" label="ODroid" />
                        </Group>
                    </Radio.Group>

                    <NodeTypeInfo type={form.values.type} />



                    <Divider />

                    <Text>
                        Network configuration
                    </Text>

                    <Checkbox label="Node uses DHCP"
                        {...form.getInputProps('dhcp', { type: 'checkbox' })}
                    />

                    <Group>
                        <TextInput label="Hostname" placeholder="mynode.domain.com"  withAsterisk
                                   {...form.getInputProps('hostname')}
                        />
                    </Group>

                    <Group>
                        <TextInput label="IP" placeholder="123.123.123.123"
                                    withAsterisk
                                   {...form.getInputProps('name')} />

                        <TextInput label="Gateway" placeholder="123.123.123.123"
                                    withAsterisk
                                   {...form.getInputProps('name')} />
                    </Group>
                    <Group>
                        <Button disabled={loading} type="submit">
                            Submit
                        </Button>
                        <Button variant="subtle" onClick={close}>
                            Cancel
                        </Button>
                    </Group>

                </Stack>
            </form>
        </Container>
    )
}