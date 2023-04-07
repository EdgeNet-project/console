
import {
    IconAlertCircle, IconAlertTriangle, IconArrowRight, IconCheck,
    IconServer, IconBox, IconUsers, IconUser

} from "@tabler/icons";
import {Title, Text, Alert, Paper, SimpleGrid, Divider, Group, Anchor, Progress, Stack} from "@mantine/core";

const categories = [
    {
        icon: <IconUser />,
        title: "Users",
        metric: "4",
        text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.",
        status: "Performing as usual",
        color: "emerald",
    },
    {
        icon: <IconUsers />,
        title: "Teams",
        metric: "3",
        text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod.",
        status: "Performing as usual",
    },
    {
        icon: <IconBox />,
        title: "Deployments",
        metric: "1",
        text: "Deployment yyy is not starting up correctly",
        status: "Critical performance",
    },
    {
        icon: <IconServer />,
        title: "Nodes",
        metric: "2",
        text: "Node xxx needs your attention!",
        status: "Immediate action required",
    },
];

const statusMapping = {
    "Performing as usual": {icon: <IconCheck size="1rem" />, color: 'teal'},
    "Immediate action required": {icon: <IconAlertTriangle size="1rem" />, color: 'orange'},
    "Critical performance": {icon: <IconAlertCircle size="1rem" />, color: 'red'}
};

export default function Dashboard() {
    return (
        <SimpleGrid cols={2}>
            {categories.map((item) => (
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
                                icon={IconArrowRight}
                                iconPosition="right"
                            >
                                View more
                            </Anchor>
                        </Group>
                    </Stack>
                </Paper>
            ))}
        </SimpleGrid>
    );
}