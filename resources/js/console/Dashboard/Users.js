import {Alert, Anchor, Divider, Group, Paper, Stack, Text} from "@mantine/core";

export default () => {

    return (
        <Paper key={item.title} shadow="xs" p="md">
            <Stack>

                <Group justify="flex-start">
                    {item.icon}
                    <Stack justify="flex-start">
                        <Text size="sm" color="gray">{item.title}</Text>
                        <Text fz="xl">{item.metric}</Text>
                    </Stack>
                </Group>

                <Alert icon={statusMapping[item.status].icon}
                       title={item.status}
                       color={statusMapping[item.status].color}>
                    {item.text}
                </Alert>
                <Divider />
                <Group>
                    <Anchor
                        size="xs"
                        variant="light"
                    >
                        View more
                    </Anchor>
                </Group>
            </Stack>
        </Paper>
    )
}