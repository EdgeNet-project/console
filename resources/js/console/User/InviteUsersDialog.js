import {useState} from "react";
import {
    Button,
    Group,
    Modal, rem,
    Stack,
    Text, Textarea,
    TextInput,
    ThemeIcon,
    UnstyledButton,
    useMantineTheme
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import { IconUsers} from "@tabler/icons";
import {useForm} from "@mantine/form";
import axios from "axios";

export default ({workspace}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [ selectedWorkspace, setSelectedWorkspace ] = useState(false)
    const [ loading, setLoading ] = useState(false)

    const form = useForm({
        initialValues: {
            emails: ''
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleSubmit = (values) => {
        setLoading(true)

        //
        axios.post('/api/invitations', {
            emails: values.emails.split('\n'),
            workspace: workspace
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
        <div>
            <Modal opened={opened} onClose={close} title="Invite users">
                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Stack spacing="md">

                        <Text>
                            Provide a list of emails, one per line.
                        </Text>

                        <Textarea label="User list"
                                  placeholder="email list"
                                  autosize
                                  minRows={2}
                                   {...form.getInputProps('emails')}
                                   // onChange={}
                        />

                        {/*<TextInput label="Namespace" placeholder="" withAsterisk*/}
                        {/*           {...form.getInputProps('name')} />*/}

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
            <Button leftIcon={<IconUsers />} onClick={open}>
                Invite Users
            </Button>
        </div>

    )
}