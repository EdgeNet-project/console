import {Badge, Divider} from "@mantine/core";
import {IconChevronRight, IconGitPullRequest, IconKey} from "@tabler/icons-react";
import {useAuthentication} from "../Authentication";
import {UserInfo} from "../User/components/UserAvatar";
import NavigationLink from "./NavigationLink";

export default () => {
    const {user, userRequests} = useAuthentication();

    const countRequests = user.requests.length + userRequests.length;

    return (
        <>
            <Divider label="Account" />
            <NavigationLink to="tokens" label="Tokens" icon={<IconKey size="1rem" stroke={1.5} />}/>
            <NavigationLink to="requests" label="Requests"
                            rightSection={countRequests > 0 && <Badge size="xs" circle>{countRequests}</Badge>}
                            icon={<IconGitPullRequest size="1rem" stroke={1.5} />}/>
            <NavigationLink to="profile" label={<UserInfo user={user} />}
                            rightSection={<IconChevronRight size={18} />}/>
        </>
    )
}
