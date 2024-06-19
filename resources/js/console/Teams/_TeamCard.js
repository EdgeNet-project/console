import {Anchor, Group, Paper, Stack, Text} from "@mantine/core";
import React from "react";
import JoinWorkspaceDialog from "../Workspaces/JoinWorkspaceDialog";
import InviteUsersDialog from "../User/InviteUsersDialog";
import _CreateWorkspaceDialog from "../Workspaces/_CreateWorkspaceDialog";
import DownloadKubeConfig from "../Workspaces/DownloadKubeConfig";

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
                <JoinWorkspaceDialog workspace={team}/>
                <InviteUsersDialog team={team} />
                <_CreateWorkspaceDialog team={team} />
            </Group>
        </Paper>



    )
}