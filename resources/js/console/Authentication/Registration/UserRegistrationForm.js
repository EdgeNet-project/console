import {useState} from "react";
import axios from "axios";
import {
    Button, LoadingOverlay, Stack,
} from '@mantine/core';
import {useForm} from "@mantine/form";
import { Panel, TextInput, PasswordInput } from "../../UI";
import {useDisclosure} from "@mantine/hooks";

export default function UserRegistrationForm() {
    const [visible, { toggle }] = useDisclosure(false);
    const [ loading, setLoading ] = useState(false)

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
        axios.post('api/register', values)
            .then((res) => {
                console.log(res)
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
        <Panel>


            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack sx={{ maxWidth: 380 }} mx="auto" style={{position:'relative'}}>

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

        </Panel>
    );


}