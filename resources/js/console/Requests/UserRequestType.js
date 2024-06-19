import {Text} from "@mantine/core";

const UserRequestType = ({request}) => {
    switch(request.type) {
        case 'CreateTeam':
            return <Text size="sm">
                {request.user.firstname} is asking to create a new Team
            </Text>;
        case 'CreateWorkspace':
            return <Text size="sm">
                {request.user.firstname} is asking to create a new Workspace
            </Text>;
        case 'JoinTeam':
            return <Text size="sm">
                {request.user.firstname} is asking to join the Team {request.object?.fullname} ({request.object?.shortname})
            </Text>;
        case 'JoinWorkspace':
            return <Text size="sm">
                {request.user.firstname} is asking to join the Workspace {request.object?.name}
            </Text>;
    }

}

export default UserRequestType;