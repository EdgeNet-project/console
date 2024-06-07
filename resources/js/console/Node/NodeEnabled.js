import {Badge} from "@mantine/core";

const NodeEnabled = ({enabled}) => {

    return enabled ?
        <Badge color="green" variant="light">Enabled</Badge> :
        <Badge color="gray" variant="light">Disabled</Badge>
}

export default NodeEnabled;