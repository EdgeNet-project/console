import {Text, Group, Stack} from "@mantine/core";
import TeamInfo from "../../Teams/components/TeamInfo";
import WorkspaceIcon from "./WorkspaceIcon";

export default ({workspace, namespace, icon, label = "workspace"}) => {

    if (icon) {
        return (
            <Group align="flex-start" gap={10}>
                <WorkspaceIcon />
                <div>
                    {label && <Text size="xs" tt="uppercase" c="dimmed" fw={500}>
                        {label}
                    </Text>}
                    <Text size="md">
                        {workspace.name}
                    </Text>
                </div>
            </Group>
        );
    }

    return (
        <div>
            {namespace && <Text c="dimmed" size="xs">
                {workspace.namespace}
            </Text>}
            <Text size="md">
                {workspace.name}
            </Text>
            {workspace.team && <TeamInfo team={workspace.team} />}
        </div>
    )
}