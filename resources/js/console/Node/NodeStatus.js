import {Badge} from "@mantine/core";

const NodeStatus = ({status}) => {

    switch(status) {
        case 'ok':
            return (
                <Badge color="green" variant="light">
                    Running
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
        case 'to install':
            return (
                <Badge variant="light">
                    To install
                </Badge>
            )
        case 'installing':
            return (
                <Badge variant="light">
                    Installing
                </Badge>
            )
        default:
        case '':
            return (
                <Badge color="gray" variant="light">
                    Disabled
                </Badge>
            )

    }

}

export default NodeStatus;