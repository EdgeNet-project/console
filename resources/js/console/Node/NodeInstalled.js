import {Badge} from "@mantine/core";

const NodeInstalled = ({enabled}) => {

    return enabled ?
        <Badge color="blue" variant="light">Installed</Badge> :
        <Badge color="gray" variant="light">To install</Badge>
}

export default NodeInstalled;