import React, {useState} from "react";
import { useAuthentication } from "../Authentication";
import {Button, Group, Text, Stack, Title, SimpleGrid} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {UserAvatar, UserInfo} from "../User/components/UserAvatar";
import UserProfileEdit from "./UserProfileEdit";
import {IconUsers} from "@tabler/icons-react";
import {CreateTeamButton} from "../Teams/CreateTeam";
import {JoinTeamButton} from "../Teams/JoinTeam";
import Panel from "../Components/Panel";

export default function UserProfile() {
    const { user, logout } = useAuthentication();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <Stack my="lg">
            <Group justify="space-between">
                <Title order={1}>Your user</Title>
            </Group>
            <SimpleGrid cols={2}>

                <Panel title={user.firstname + ' ' + user.lastname}
                       icon={<UserAvatar name={user.firstname + ' ' + user.lastname} email={user.email} />}
                       help=""
                       buttons={[
                           <UserProfileEdit key="user_profile_edit" />,
                           <Button size="xs" onClick={handleLogout} key="user_logout">Logout</Button>
                       ]}>
                </Panel>
            </SimpleGrid>
        </Stack>
    );
}