import {useAuthentication} from "../Authentication";
import JoinRequestsCard from "./JoinRequestsCard";
import {Button, Group, Stack, Text, Title} from "@mantine/core";
import UserRequests from "./UserRequests";

export default () => {
    const {user} = useAuthentication();

    return (
        <>
            <Stack my="lg">
                <Group justify="space-between">
                    <Title order={1}>Requests</Title>
                </Group>
                <Text>
                    Pending requests from users that ask to join your organization(s) will be shown here.
                </Text>
            </Stack>

            <UserRequests />
        </>
    )
}