import React from "react";
import { useAuthentication } from "../Authentication";
import {Button, Group, Text, Stack, Title, SimpleGrid} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {UserAvatar, UserInfo} from "../User/components/UserAvatar";
import UserProfileEdit from "./UserProfileEdit";
import Panel from "../Components/Panel";
import UserRequests from "./UserRequests";
import PanelGrid from "../Components/PanelGrid";

export default function UserProfile() {
    const { user, logout } = useAuthentication();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <Stack py="lg">
            <Group justify="space-between">
                <Title order={1}>Your user</Title>
            </Group>

            <PanelGrid>
                    <Panel title={user.firstname + ' ' + user.lastname}
                           icon={<UserAvatar name={user.firstname + ' ' + user.lastname} email={user.email} />}
                           help=""
                           buttons={[
                               <UserProfileEdit key="user_profile_edit" />,
                               <Button size="xs" onClick={handleLogout} key="user_logout">Logout</Button>
                           ]}>
                    </Panel>

                    <UserRequests />
            </PanelGrid>
        </Stack>
    );
}