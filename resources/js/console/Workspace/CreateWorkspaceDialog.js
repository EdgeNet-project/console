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

export default function CreateWorkspaceDialog({currentWorkspace}) {
    const [opened, { open, close }] = useDisclosure(false);
    const { classes } = useStyles();
    const theme = useMantineTheme();
    const [ loading, setLoading ] = useState(false)

    const backgroundColor = theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]

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

    const onFullnameChange = ({target: {value}}) => {
        form.setFieldValue('fullname', value);
        form.setFieldValue('name', createNamespace(value));
    }

    const handleSubmit = (values) => {
        setLoading(true)

        axios.post('/api/requests/subnamespaces', {
            name: name, ...values
        })
            .then((res) => {
                console.log(res)
                //setRegistered(true)
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

    return (
        <>
            <Modal opened={opened} onClose={close} title="Create a new Workspace">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">

                        <TextInput label="Name" placeholder="My new Team name" classNames={classes} withAsterisk
                                   {...form.getInputProps('fullname')}
                                   onChange={onFullnameChange}
                        />

                        <TextInput label="Namespace" placeholder="" classNames={classes} withAsterisk
                                   {...form.getInputProps('name')} />

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
            <Group>
                <Button onClick={open}>
                    <Group>
                        <IconSquarePlus />

                        <Text size="sm">Create a new Workspace</Text>
                    </Group>
                </Button>
            </Group>
        </>

    )
}