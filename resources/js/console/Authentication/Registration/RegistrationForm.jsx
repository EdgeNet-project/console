import React, {useState} from "react";
import axios from "axios";
import {
    Anchor, Box,
    Button, Divider, Group, LoadingOverlay, Stack, Text,
} from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import {useForm} from "@mantine/form";
import { TextInput, PasswordInput } from "../../UI";
import {useDisclosure} from "@mantine/hooks";

const UserRegistrationSuccess = () => {
    return (
        <Box w={400}>
            <Text mt="md">
                Thank you for registering.
            </Text>
            <Text mt="md">
                You will receive shortly a message for validating your email,
                you will then be able to login and continue with the registration process.

            </Text>
            <Text mt="md">
                <Anchor href="/" weight={700} >
                    Go back to the login page
                </Anchor>
            </Text>
        </Box>
    )
}

export default function RegistrationForm() {
    const [visible, { toggle }] = useDisclosure(false);
    const [ loading, setLoading ] = useState(false)
    const [ registered, setRegistered ] = useState(false)

    const form = useForm({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            password_confirmation: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleSubmit = (values) => {
        setLoading(true)
        axios.post('register', values)
            .then((res) => {
                setRegistered(true)
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

    if (registered) {
        return (
            <UserRegistrationSuccess/>
        );
    }

    return (
        <Box w={400}>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack gap="xs">
                    <LoadingOverlay visible={loading} overlayBlur={2} />

                    <Group grow>
                        <Stack gap="xs" align="stretch">
                            <Text component="label" htmlFor="email" size="sm" fw={500}>
                                Firstname
                            </Text>
                            <TextInput {...form.getInputProps('firstname')}
                                       placeholder="John" />
                        </Stack>

                        <Stack gap="xs" align="stretch">
                            <Text component="label" htmlFor="email" size="sm" fw={500}>
                                Lastname
                            </Text>
                            <TextInput {...form.getInputProps('lastname')}
                                       placeholder="Smith" />
                        </Stack>
                    </Group>

                    <Text component="label" htmlFor="email" size="sm" fw={500}>
                        Email address
                    </Text>
                    <TextInput {...form.getInputProps('email')}
                               placeholder="jsmith@gmail.com" />

                    <Text component="label" htmlFor="email" size="sm" fw={500}>
                        Password
                    </Text>
                    <PasswordInput
                        visible={visible}
                        onVisibilityChange={toggle}
                        {...form.getInputProps('password')}
                        placeholder=""
                    />

                    <Text component="label" htmlFor="email" size="sm" fw={500}>
                        Confirm password
                    </Text>
                    <PasswordInput
                        visible={visible}
                        onVisibilityChange={toggle}
                        {...form.getInputProps('password_confirmation')}
                        placeholder=""
                    />

                    <Button disabled={loading} type="submit" fullWidth>
                        Register
                    </Button>

                </Stack>
            </form>
            <Divider my="md" />
            <Anchor href="/" size="sm" fw={500}>
               <IconArrowBack size={14} /> Go back to the login page
            </Anchor>
        </Box>
    );


}