import {useEffect, useState} from "react";
import axios from "axios";
import {
    Anchor,
    Button, LoadingOverlay, Stack, Text,
} from '@mantine/core';
import {useForm} from "@mantine/form";
import {Panel, PasswordInput, TextInput} from "../../UI";
import {useParams} from "react-router";
import {useDisclosure} from "@mantine/hooks";

const PasswordResetFormSuccess = () => {
    return (
        <Panel>
            <Text mt="md">
                Your password has been successfully updated!
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

export default function PasswordResetForm() {
    const [visible, { toggle }] = useDisclosure(false);
    const [ loading, setLoading ] = useState(false)
    const [ success, setSuccess ] = useState(false)
    const { id, signature } = useParams()

    const form = useForm({
        initialValues: {
            password: '',
            password_confirmation: '',
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const handleSubmit = (values) => {
        setLoading(true)
        axios.post('/password/reset/' + id + '/' + signature, values)
            .then((res) => {
                setSuccess(true)
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

    if (success) {
        return (
            <PasswordResetFormSuccess />
        );
    }

    return (
        <Panel>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack sx={{ maxWidth: 380 }} mx="auto" style={{position:'relative'}}>

                    <LoadingOverlay visible={loading} overlayBlur={2} />

                    <Text mt="md">
                        Please reset your password. <br />
                    </Text>

                    {/*<TextInput label="Email address" {...form.getInputProps('email')} />*/}

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

                    <Button disabled={loading} type="submit" fullWidth>
                        Submit
                    </Button>

                </Stack>
            </form>
        </Panel>
    );


}