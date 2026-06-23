import {Badge} from "@mantine/core";

const NodeStatus = ({status}) => {

    switch(status) {
        case 'ready':
            return (
                <Badge color="green" variant="light">
                    Ready
                </Badge>
            )
        case 'provisioning':
        case 'networking':
            return (
                <Badge variant="light">
                    {status}
                </Badge>
            )
        case 'error':
            return (
                <Badge color="red" variant="light">
                    Error
                </Badge>
            )
        case 'warning':
            return (
                <Badge color="orange" variant="light">
                    Warning
                </Badge>
            )

        case 'unknown':
            return (
                <Badge color="gray" variant="light">
                    Unknown
                </Badge>
            )
        case 'disabled':
            return (
                <Badge color="gray" variant="light">
                    Disabled
                </Badge>
            )
        default:
            return (
                <Badge color="gray" variant="light">
                    {status}
                </Badge>
            )

    }

}

export default NodeStatus;