import {Alert, Anchor, Breadcrumbs, Button, Divider, Group, Paper, SimpleGrid, Stack, Text} from "@mantine/core";
import {
    IconAlertCircle, IconAlertTriangle, IconArrowRight, IconCheck,
    IconServer, IconBox, IconUsers, IconUser

} from "@tabler/icons";
import CreateWorkspaceDialog from "../Workspace/CreateWorkspaceDialog";
const items = [
    { title: 'Sorbonne', href: '#' },
    { title: 'Networking Class', href: '#' },
    { title: 'Team A', href: '#' },
].map((item, index) => (
    <Anchor href={item.href} key={index}>
        {item.title}
    </Anchor>
));


const categories = [
    {
        icon: <IconUser />,
        title: "Users",
        metric: "2",
        text: "No pending requests",
        status: "Performing as usual",
        color: "emerald",
    },
    {
        icon: <IconBox />,
        title: "Deployments",
        metric: "1",
        text: "Deployment yyy is not starting up correctly",
        status: "Critical performance",
    },
];


const statusMapping = {
    "Performing as usual": {icon: <IconCheck size="1rem" />, color: 'teal'},
    "Immediate action required": {icon: <IconAlertTriangle size="1rem" />, color: 'orange'},
    "Critical performance": {icon: <IconAlertCircle size="1rem" />, color: 'red'}
};

export default function TeamView() {

    return (
        <Stack>

            <Breadcrumbs separator="→" mt="xs">{items}</Breadcrumbs>

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
                <Paper shadow="xs" p="md">
                    <Stack>
                        <Text>Team A</Text>
                        <Divider />
                        <Text>Team B</Text>
                        <Divider />
                        <CreateWorkspaceDialog />
                    </Stack>
                </Paper>
            </SimpleGrid>
        </Stack>
    )
}