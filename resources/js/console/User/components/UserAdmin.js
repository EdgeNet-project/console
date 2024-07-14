import {Badge} from "@mantine/core";

export default ({admin}) => admin ?
    <Badge size="xs" color="black">Admin</Badge> : null
