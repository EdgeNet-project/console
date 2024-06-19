import {Divider, Group, Stack, Title} from "@mantine/core";

export default ({children, title, icon, buttons}) => {

    return (
        <Stack justify="space-between" p="md" style={{backgroundColor:'white', borderRadius:'5px'}}>
            <Stack>
                <Group justify="flex-start">
                    {icon}
                    <Title order={2} size="h4">{title}</Title>
                </Group>
                {children}
            </Stack>
            <Stack>
                <Divider />
                <Group justify="flex-end">
                    {buttons}
                </Group>
            </Stack>
        </Stack>
    )
}