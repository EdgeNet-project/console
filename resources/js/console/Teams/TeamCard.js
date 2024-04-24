import {Anchor, Group, Paper, Stack, Text} from "@mantine/core";
import React from "react";
import JoinWorkspaceDialog from "../Workspace/JoinWorkspaceDialog";
import InviteUsersDialog from "../User/InviteUsersDialog";
import CreateWorkspaceDialog from "../Workspace/CreateWorkspaceDialog";
import DownloadKubeConfig from "../Workspace/DownloadKubeConfig";

export default ({team}) => {

    return (
        <Paper shadow="xs" p="md">
            <Group>
                <div>
                    <Text fz="xl">{team.fullname}</Text>
                    <Anchor size="xs" href={team.url}>{team.url}</Anchor> <br />
                    <Text c="dimmed">
                        A workspace is a logical unit to organize your projects and DevOps projects and
                        manage app templates and app repositories. It is the place for you to control
                        resource access and share resources within your team in a secure way.
                    </Text>
                </div>

            </Group>
            <Group mt="sm">
                <DownloadKubeConfig workspace={team} />
                <JoinWorkspaceDialog workspace={team}/>
                <InviteUsersDialog team={team} />
                <CreateWorkspaceDialog team={team} />
            </Group>
        </Paper>



    )
}