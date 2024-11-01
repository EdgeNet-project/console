import {Badge} from "@mantine/core";

export default ({enabled}) => enabled ?
    <Badge size="xs">Enabled</Badge> :
    <Badge size="xs" color="gray">Disabled</Badge>
