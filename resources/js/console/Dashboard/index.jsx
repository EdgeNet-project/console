import {Link} from "react-router-dom";
import {Title, Text, Alert, SimpleGrid, Anchor, Stack} from "@mantine/core";
import {
    IconAlertTriangle
} from "@tabler/icons-react";

import UserTeams from "./UserTeams";
import UserWorkspaces from "./UserWorkspaces";
import UserNodes from "./UserNodes";
import {useAuthentication} from "../Authentication";
import PanelGrid from "../Components/PanelGrid";


const RequestsAlert = () => {
    const {user, userRequests} = useAuthentication();

    if (user.requests.length <= 0 && userRequests <= 0) {
        return null;
    }

    return (
        <Alert icon={<IconAlertTriangle size="1.5rem"/>} title="Pending requests" color="orange" variant="light">
            {user.requests.length > 0 && <Text size="sm">
                You have <Anchor component={Link} to="/profile">{user.requests.length} {user.requests.length > 1 ? 'requests' : 'request'}</Anchor> pending for review.
            </Text>}
            {userRequests.length > 0 && <Text size="sm">
                You are managing one or more teams or workspaces and you have <Anchor component={Link} to="/requests">{userRequests.length} pending {userRequests.length > 1 ? 'requests' : 'request'}</Anchor> to review.
            </Text>}
        </Alert>
    )
}

export default () => {

    return (
        <>
            <Stack my="lg">
                <Title order={1}>
                    EdgeNet Console
                </Title>
                <RequestsAlert />
            </Stack>
            <PanelGrid>
                <UserWorkspaces />
                <UserNodes />
                <UserTeams />
            </PanelGrid>
        </>
    );
}