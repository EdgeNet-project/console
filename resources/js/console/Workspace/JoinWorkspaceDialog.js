import {useState} from "react";
import {
    Button,
    createStyles,
    Group,
    Modal, rem,
    Stack,
    Text,
    TextInput,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {IconSquarePlus} from "@tabler/icons";
import {useForm} from "@mantine/form";
import axios from "axios";
import WorkspaceSelect from "./WorkspaceSelect";
import {useAuthentication} from "../Authentication";

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

const SuccessMessage = ({close}) => {

    return (
        <Stack spacing="md">
            <Text>A request has been sent</Text>
            <Group position="right">
                <Button color="gray" onClick={close}>
                    Close
                </Button>
            </Group>
        </Stack>
    )
}
export default function JoinWorkspaceDialog() {
    const [opened, { open, close }] = useDisclosure(false);
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [ error, setError ] = useState()
    const [ success, setSuccess ] = useState(false)
    // const [ selectedWorkspace, setSelectedWorkspace ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const { user } = useAuthentication()

    const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]

    const form = useForm({
        initialValues: {
            firstname: user.firstname ?? '',
            lastname: user.lastname ?? '',
            email: user.email,
            namespace: '',
        },
    });

    const selectWorkspace = (workspace) => {
        form.setFieldValue('namespace', workspace.namespace)
    }

    const handleSubmit = (values) => {
        setLoading(true)

        axios.post('/api/requests/roles', values)
            .then((res) => {
                console.log(res)
                //setRegistered(true)
            })
            .catch(({ response: {data: {message, errors}}}) => {
                // console.log(message)
                setError(message)
                form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            <Modal opened={opened} onClose={close} title="Join a workspace">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    {success ? <SuccessMessage close={close}/>
                    : <Stack spacing="md">
                        <Text>
                            Select a Workspace to join, a request will be sent to the managers.
                        </Text>
                        <WorkspaceSelect withinPortal onChange={selectWorkspace} />

                        {error && <Text color="red">{error}</Text>}
                        <Group position="apart">
                            <Button color="gray" onClick={close}>
                                Cancel
                            </Button>

                            <Button disabled={loading} type="submit">
                                Submit
                            </Button>
                        </Group>

                    </Stack>
                    }
                </form>
            </Modal>
            <UnstyledButton onClick={open}
                            sx={{
                                display: 'block',
                                width: '100%',
                                padding: theme.spacing.xs,
                                borderRadius: theme.radius.sm,
                                color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,
                                '&:hover': {
                                    backgroundColor: backgroundColor,
                                },
                            }}>
                <Group>
                    <IconSquarePlus />

                    <Text size="sm">Join a Workspace</Text>
                </Group>
            </UnstyledButton>
        </>

    )
}