import {Badge} from "@mantine/core";

export default ({enabled}) => ! enabled && <Badge size="xs" color="gray">Disabled</Badge>
