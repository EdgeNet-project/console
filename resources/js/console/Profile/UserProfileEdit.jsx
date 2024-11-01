import React, {useState} from "react";
import {
    ActionIcon,
    Button,
    Group, LoadingOverlay,
    Modal,
    Stack,
    Text,
    TextInput,
} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {IconEdit} from "@tabler/icons-react";
import {useForm} from "@mantine/form";
import axios from "axios";
import {useAuthentication} from "../Authentication";

const UserEditModal = ({title, onClose}) => {
    const [ loading, setLoading ] = useState(false)
    const { user, loadUser } = useAuthentication()

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
                onClose()
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
        <Modal opened onClose={onClose} title={title}>
            <LoadingOverlay visible={loading} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                    <Text>
                        Modify your user profile
                    </Text>
                    <TextInput label="Firstname" placeholder="John"  withAsterisk
                               {...form.getInputProps('firstname')}
                    />
                    <TextInput label="Lastname" placeholder="Smith"  withAsterisk
                               {...form.getInputProps('lastname')} />

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

    )
}

export default () => {
    const [opened, { open, close }] = useDisclosure(false);

    const title = "Edit";
    return (
        <>
            {opened && <UserEditModal title={title} onClose={close} />}
            <Button size="xs" onClick={open}>
                {title}
            </Button>
        </>
    )
}