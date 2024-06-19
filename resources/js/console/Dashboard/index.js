
import {
    IconAlertCircle, IconAlertTriangle, IconArrowRight, IconCheck,
    IconServer, IconBox, IconUsers, IconUser

} from "@tabler/icons";
import {Title, Text, Alert, Paper, SimpleGrid, Divider, Group, Anchor, Progress, Stack, Container} from "@mantine/core";
import Teams from "./Teams";
import Workspaces from "./Workspaces";
import Nodes from "./Nodes";
import {useAuthentication} from "../Authentication";
import {Link} from "react-router-dom";

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

const RequestsAlert = ({own, requests}) => {
    const {user, userRequests} = useAuthentication();

    if (user.requests.length > 0) {

    }

    return (
        <Alert icon={<IconAlertTriangle size="1.5rem"/>} title="Pending requests" color="orange" variant="light">
            {user.requests.length > 0 && <Text size="sm">
                You have <Anchor component={Link} to="/requests">{user.requests.length} pending {user.requests.length > 1 ? 'requests' : 'request'}</Anchor> pending for review.
            </Text>}
            {userRequests.length > 0 && <Text size="sm">
                You are managing one or more Teams and you have <Anchor component={Link} to="/requests">{userRequests.length} pending {userRequests.length > 1 ? 'requests' : 'request'}</Anchor> to review.
            </Text>}
        </Alert>
    )
}

export default () => {


    return (
        <>
            <Stack my="lg">
                <Title order={1}>
                    Welcome to EdgeNet!
                </Title>
                <Text>
                    To use EdgeNet you have to join a Workspace. Alternatively you can create a new Team.
                    <br />
                    If you want you can also contribute a node to the cluster.
                </Text>
                <RequestsAlert />
            </Stack>
            <SimpleGrid cols={2}>
                <Teams />
                <Workspaces />
                <Nodes />
            </SimpleGrid>
        </>
    );
}