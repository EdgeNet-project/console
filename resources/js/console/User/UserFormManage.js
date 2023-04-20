import {UserInfo} from "./UserAvatar";
import {Button, Group, Radio, Stack, Switch} from "@mantine/core";
import React from "react";
import {useForm} from "@mantine/form";

export default ({user, close}) => {
    const form = useForm({
        initialValues: {
            enabled: user.enabled,
            role: 'admin'
        },
    });

    console.log(form.isDirty(), form.touched)


    return (
        <form onSubmit={form.onSubmit(null)}>
            <UserInfo user={user} />

            <Stack my="xl" spacing="lg">
                <Switch {...form.getInputProps('enabled', { type: 'checkbox' })}
                        label="Enable or Disable user"
                />

                <Radio.Group {...form.getInputProps('role')}
                             label="Change the user level permissions on this workspace"
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