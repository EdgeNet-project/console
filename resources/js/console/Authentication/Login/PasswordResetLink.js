import {useState} from "react";
import axios from "axios";
import {
    Anchor,
    Button, Divider, LoadingOverlay, Stack, Text,
} from '@mantine/core';
import {useForm} from "@mantine/form";
import { Panel, TextInput } from "../../UI";
import {IconArrowBack} from "@tabler/icons";

const PasswordResetLinkSuccess = () => {
    return (
        <>
            <Text mt="md">
                We sent you an email with instructions on how to reset yout password.
            </Text>
            <Text mt="md">

            </Text>
            <Divider my="xl" />
            <Anchor href="/">
                <IconArrowBack size={14} /> Go back to the login page
            </Anchor>
        </>
    )
}

export default function PasswordResetLink() {
    const [ loading, setLoading ] = useState(false)
    const [ linkSent, setLinkSent ] = useState(false)

    const form = useForm({
        initialValues: {
            email: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleSubmit = (values) => {
        setLoading(true)
        axios.post('/password/link', values)
            .then((res) => {
                setLinkSent(true)
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

    if (linkSent) {
        return (
            <PasswordResetLinkSuccess />
        );
    }

    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack style={{position:'relative'}}>

                    <LoadingOverlay visible={loading} overlayBlur={2} />

                    <Text>
                        Please provide the mail you registered with. <br />
                        We will send you an email with instructions on how to reset your password.
                    </Text>

                    <TextInput label="Email address" {...form.getInputProps('email')}
                               placeholder="hello@gmail.com" />

                    <Button disabled={loading} type="submit" >
                        Submit
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