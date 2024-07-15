import {Stack, Text} from "@mantine/core";
import WorkspaceInfo from "../../Workspaces/components/WorkspaceInfo";
import TeamInfo from "../../Teams/components/TeamInfo";
import WorkspaceIcon from "../../Workspaces/components/WorkspaceIcon";

export default ({type, subject}) => {

    if (!subject) {
        return null;
    }

    switch(type) {
        case "App\\Model\\SubNamespace":
            return (
                    <WorkspaceInfo workspace={subject} icon />
            )
        case "App\\Model\\Tenant":
            return (
                <TeamInfo team={subject} />
            )
        case "App\\Model\\Node":
            return (
                <Text size="sm">{subject.name}</Text>
            )
        default:
            return (
                <Text size="sm">{subject.name}</Text>
            )
    }
}