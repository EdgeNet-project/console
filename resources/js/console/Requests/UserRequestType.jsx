import {Text} from "@mantine/core";

const UserRequestType = ({request}) => {
    switch(request.type) {
        case 'CreateTeam':
            return <Text size="sm">
                {request.user.firstname} is asking to create a new team
            </Text>;
        case 'CreateWorkspace':
            return <Text size="sm">
                {request.user.firstname} is asking to create a new workspace in {request.object?.name}
            </Text>;
        case 'JoinTeam':
            return <Text size="sm">
                {request.user.firstname} is asking to join the team {request.object?.fullname} ({request.object?.shortname})
            </Text>;
        case 'JoinWorkspace':
            return <Text size="sm">
                {request.user.firstname} is asking to join the workspace {request.object?.name}
            </Text>;
    }

}

export default UserRequestType;