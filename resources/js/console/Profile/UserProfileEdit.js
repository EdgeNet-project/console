import {useState} from "react";
import {
    ActionIcon,
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
import {IconEdit, IconSquarePlus} from "@tabler/icons";
import {useForm} from "@mantine/form";
import axios from "axios";
import {useParams} from "react-router";
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

export default () => {
    const [opened, { open, close }] = useDisclosure(false);
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [ loading, setLoading ] = useState(false)
    const { user, loadUser } = useAuthentication()

    const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]

    const form = useForm({
        initialValues: {
            firstname: user.firstname,
            lastname: user.lastname,
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    // console.log(team)

    const handleSubmit = (values) => {
        setLoading(true)

        axios.patch('/user', values)
            .then((res) => {
                console.log(res)
                //setRegistered(true)
                loadUser()
                close()
            })
            .catch(({message, response: {data: {errors}}}) => {
                // console.log(message)
                // setErrors(errors)
                form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)
            })
    }
    //
    // if (!team) {
    //     return;
    // }
    return (
        <>
            <Modal opened={opened} onClose={close} title="Create a new Workspace">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">
                        <Text>

                        </Text>
                        <TextInput label="Firstname" placeholder="John" classNames={classes} withAsterisk
                                   {...form.getInputProps('firstname')}
                        />
                        <TextInput label="Lastname" placeholder="Smith" classNames={classes} withAsterisk
                                   {...form.getInputProps('lastname')} />

                        <Group position="apart">
                            <Button color="gray" onClick={close}>
                                Cancel
                            </Button>

                            <Button disabled={loading} type="submit">
                                Submit
                            </Button>
                        </Group>

                    </Stack>
                </form>
            </Modal>
            <ActionIcon variant="filled" onClick={open}>
                <IconEdit size="1rem" />
            </ActionIcon>
        </>

    )
}