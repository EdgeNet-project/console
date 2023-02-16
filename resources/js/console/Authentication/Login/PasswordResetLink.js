import {useState} from "react";
import axios from "axios";
import {
    Anchor,
    Button, LoadingOverlay, Stack, Text,
} from '@mantine/core';
import {useForm} from "@mantine/form";
import { Panel, TextInput } from "../../UI";

const PasswordResetLinkSuccess = () => {
    return (
        <Panel>
            <Text mt="md">
                We sent you an email with instructions on how to reset yout password.
            </Text>
            <Text mt="md">

            </Text>
            <Text mt="md">
                <Anchor href="/" weight={700} >
                    Go back to the login page
                </Anchor>
            </Text>
        </Panel>
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
        <Panel>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack sx={{ maxWidth: 380 }} mx="auto" style={{position:'relative'}}>

                    <LoadingOverlay visible={loading} overlayBlur={2} />

                    <Text mt="md">
                        Please provide the mail you registered with. <br />
                        We will send you an email with instructions on how to reset your password.
                    </Text>

                    <TextInput label="Email address" {...form.getInputProps('email')}
                               placeholder="hello@gmail.com" />

                    <Button disabled={loading} type="submit" fullWidth>
                        Submit
                    </Button>

                </Stack>
            </form>
        </Panel>
    );


}