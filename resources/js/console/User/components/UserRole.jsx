import {Badge} from "@mantine/core";

export default ({role}) => {
    switch (role) {
        case 'admin':
            return <Badge size="xs" color="pink" variant="light">Admin</Badge>
        case 'owner':
            return <Badge size="xs" color="green" variant="light">Owner</Badge>
        case 'collaborator':
            return <Badge size="xs" color="blue" variant="light">Collaborator</Badge>
        case 'user':
            return <Badge size="xs" color="blue" variant="light">User</Badge>
        default:
            return <Badge size="xs" color="gray" variant="light">Unknown</Badge>
    }
}
