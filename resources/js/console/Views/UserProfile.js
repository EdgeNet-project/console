import React from "react";
import { useAuthentication } from "../Authentication";
import {Button, Group, Text} from "@mantine/core";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
    const { user, logout } = useAuthentication();
    const navigate = useNavigate();

    const handleLogout = () => {

        logout();
        navigate('/');

    }
    return (
        <Group position="apart">
            <div>
                <Text size="lg" weight={500}>
                    {user.firstname} {user.lastname}
                </Text>
                <Text size="xs" color="dimmed">
                    {user.email}
                </Text>
            </div>

                <Button color="red" onClick={handleLogout}>Logout</Button>


        </Group>
    );
}