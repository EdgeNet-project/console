import {useState} from "react";
import axios from "axios";
import {
    Anchor,
    Button, Divider, LoadingOverlay, Stack, Text,
} from '@mantine/core';
import {useForm} from "@mantine/form";
import {PasswordInput} from "../../UI";
import {useParams} from "react-router";
import {useDisclosure} from "@mantine/hooks";
import {IconArrowBack} from "@tabler/icons-react";

const PasswordResetFormSuccess = () => {
    return (
        <>
            <Text mt="md">
                Your password has been successfully updated!
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
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack style={{position:'relative'}}>

                    <LoadingOverlay visible={loading} overlayBlur={2} />

                    <Text>
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
    );


}