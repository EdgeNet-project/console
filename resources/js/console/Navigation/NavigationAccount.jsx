import {Badge, Group} from "@mantine/core";
import {IconChevronRight} from "@tabler/icons-react";
import {useAuthentication} from "../Authentication";
import {UserInfo} from "../User/components/UserAvatar";
import NavigationLink from "./NavigationLink";

export default () => {
    const {user} = useAuthentication();

    return (
        <>
            <NavigationLink to="profile"
                            label={<UserInfo user={user} />}
                            rightSection={<Group>
                                {user.requests.length > 0 && <Badge size="xs" circle>{user.requests.length}</Badge>}
                                <IconChevronRight size={18} />
                            </Group>}
            />
        </>
    )
}
