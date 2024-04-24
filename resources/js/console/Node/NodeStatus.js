import {Badge} from "@mantine/core";

const NodeStatus = ({status}) => {

    switch(status) {
        case 'active':
            return (
                <Badge variant="light">
                    Active
                </Badge>
            )
        case 'disabled':
            return (
                <Badge color="gray" variant="light">
                    Disabled
                </Badge>
            )
        default:
        case '':
            return (
                <Badge variant="light">
                    To install
                </Badge>
            )
    }

}

export default NodeStatus;