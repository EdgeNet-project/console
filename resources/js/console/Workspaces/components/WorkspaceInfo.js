import {Text} from "@mantine/core";
import TeamInfo from "../../Teams/components/TeamInfo";

export default ({workspace}) => {

    return (
        <>
            <Text c="dimmed" size="xs">
                {workspace.namespace}
            </Text>
            <Text size="md">
                {workspace.name}
            </Text>
            {workspace.team && <TeamInfo team={workspace.team} />}
        </>
    )
}