import {useAuthentication} from "../Authentication";
import JoinRequestsCard from "./JoinRequestsCard";
import {Stack, Text, Title} from "@mantine/core";
import UserRequests from "./UserRequests";

export default () => {
    const {user} = useAuthentication();

    return (
        <Stack spacing="sm">
            <Title>Requests</Title>
            <Text size="sm">Pending requests from users that ask to join your organization(s) will be shown here.</Text>

            <UserRequests />
            {/*{user.tenants.map(tenant => <JoinRequestsCard tenant={tenant} /> )}*/}
        </Stack>
    )
}