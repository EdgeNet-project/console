import {useState} from "react";
import axios from "axios";
import {
    Anchor,
    Button, Divider, LoadingOverlay, Stack, Text,
} from '@mantine/core';
import { IconArrowBack } from '@tabler/icons-react';
import {useForm} from "@mantine/form";
import { TextInput, PasswordInput } from "../../UI";
import {useDisclosure} from "@mantine/hooks";

const UserRegistrationSuccess = () => {
    return (
        <>
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
        </>
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
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>

                    <LoadingOverlay visible={loading} overlayBlur={2} />
                    <TextInput label="Firstname" {...form.getInputProps('firstname')}
                               placeholder="Firstname" />
                    <TextInput label="Lastname" {...form.getInputProps('lastname')}
                               placeholder="Lastname" />

                    <TextInput label="Email address" {...form.getInputProps('email')}
                               placeholder="hello@gmail.com" />

                    <PasswordInput
                        label="Password"
                        visible={visible}
                        onVisibilityChange={toggle}
                        {...form.getInputProps('password')}
                        placeholder=""
                    />

                    <PasswordInput
                        label="Confirm password"
                        visible={visible}
                        onVisibilityChange={toggle}
                        {...form.getInputProps('password_confirmation')}
                        placeholder=""
                    />

                {/*<Select*/}
                {/*    style={{marginTop: 20, zIndex: 2}}*/}
                {/*    data={['React', 'Angular', 'Svelte', 'Vue']}*/}
                {/*    placeholder="Pick one"*/}
                {/*    label="Your favorite library/framework"*/}
                {/*    classNames={classes}*/}
                {/*/>*/}
                    <Button disabled={loading} type="submit" fullWidth>
                        Register
                    </Button>

                </Stack>
            </form>
            <Divider my="xl" />
            <Anchor href="/">
               <IconArrowBack size={14} /> Go back to the login page
            </Anchor>
        </>
    );


}