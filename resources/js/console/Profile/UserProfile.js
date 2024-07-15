import {useState} from "react";
import { useAuthentication } from "../Authentication";
import {Button, Group, Text, Stack} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import {UserInfo} from "../User/components/UserAvatar";
import UserProfileEdit from "./UserProfileEdit";

export default function UserProfile() {
    const { user, logout } = useAuthentication();
    const navigate = useNavigate();
    const [ namespaces, setNamespaces ] = useState()

    const handleLogout = () => {
        logout();
        navigate('/');
    }

    return (
        <>
            <Stack my="lg">
                <Group justify="space-between">
                    <Group>
                        <UserInfo user={user} />
                        <UserProfileEdit />
                    </Group>

                    <Button onClick={handleLogout}>Logout</Button>
                </Group>
                <Text>
                </Text>
            </Stack>

        </>
    );
}