import {Anchor, Group, Paper, Stack, Text} from "@mantine/core";
import React from "react";
import JoinWorkspaceDialog from "./JoinWorkspaceDialog";
import InviteUsersDialog from "../User/InviteUsersDialog";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";

export default ({workspace}) => {

    return (
        <Paper shadow="xs" p="md">
            <Group align="start" position="apart">
                <div>
                    <Text fz="sm" c="dimmed">Workspace</Text>
                    <Text fz="xl">{workspace.name}</Text>
                </div>
                <Text c="dimmed">
                    A workspace is a logical unit to organize your projects and DevOps projects and
                    manage app templates and app repositories. It is the place for you to control
                    resource access and share resources within your team in a secure way.
                </Text>
            </Group>

            <Group mt="sm">
                <JoinWorkspaceDialog workspace={workspace} />
                <InviteUsersDialog team={workspace} />
                <CreateWorkspaceDialog workspace={workspace} />
            </Group>
        </Paper>
    )
}