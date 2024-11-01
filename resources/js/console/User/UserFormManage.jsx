import {UserInfo} from "./components/UserAvatar";
import {Button, Group, Radio, Stack, Switch} from "@mantine/core";
import React from "react";
import {useForm} from "@mantine/form";

export default ({user, close}) => {
    const form = useForm({
        initialValues: {
            enabled: user.enabled,
            role: user.role
        },
    });

    const handleSubmit = (values) => {
        // setLoading(true)

        console.log(values)
        // axios.post('/api/subnamespaces', {
        //     namespace: team.name, ...values
        // })
        //     .then((res) => {
        //         console.log(res)
        //         //setRegistered(true)
        //     })
        //     .catch(({message, response: {data: {errors}}}) => {
        //         // console.log(message)
        //         // setErrors(errors)
        //         form.setErrors(errors);
        //     })
        //     .finally(() => {
        //         setLoading(false)
        //     })
    }

    console.log(user)
    // console.log(form.isDirty(), form.touched)

    if (!user) {
        return null
    }

    const name = (user.pivot.type === 'tenant' ? user.pivot.tenant.name : user.pivot.workspace.name)

    return (
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <UserInfo user={user} />
            <Stack my="xl" spacing="lg">
                <Switch {...form.getInputProps('enabled', { type: 'checkbox' })}
                        label="Enable or Disable user"
                />

                <Radio.Group {...form.getInputProps('role')}
                             label={"Change the user level permissions in " + name}
                             description=""
                >
                    <Stack mt="sm" spacing="xs">
                        <Radio value="collaborator" label="Collaborator" />
                        <Radio value="admin" label="Admin" />
                        <Radio value="owner" label="Owner" />
                    </Stack>
                </Radio.Group>

            </Stack>
            <Group position="right">
                <Button color="gray" onClick={close}>Cancel</Button>
                {/*<Button disabled={!form.isDirty()} color="gray" onClick={() => form.reset()}>Reset</Button>*/}
                <Button disabled={!form.isDirty()} type="submit">Apply</Button>
            </Group>
        </form>
    )
}