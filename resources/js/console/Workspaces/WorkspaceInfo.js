import {Text} from "@mantine/core";
import TeamInfo from "../Teams/TeamInfo";

export default ({workspace}) => {

    return (
        <div>
            <Text c="dimmed" fz="xs">
                {workspace.namespace}
            </Text>
            <Text mb="sm">
                {workspace.name}
            </Text>
            {workspace.team && <TeamInfo team={workspace.team} />}
        </div>
    )
}