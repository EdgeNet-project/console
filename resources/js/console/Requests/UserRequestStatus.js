import {Badge} from "@mantine/core";

const UserRequestStatus = ({status}) => {
    switch (status) {
        case 'Approved':
            return <Badge color="green" size="xs">{status}</Badge>;
        case 'Error':
        case 'Denied':
            return <Badge color="red" size="xs">{status}</Badge>;
        case 'Pending':
        default:
            return <Badge size="xs">{status}</Badge>;
    }
}

export default UserRequestStatus;