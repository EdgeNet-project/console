import {Anchor, Group, Paper, Stack, Text} from "@mantine/core";
import React from "react";
import JoinWorkspaceDialog from "./JoinWorkspaceDialog";

export default ({workspace}) => {

    return (
        <Paper shadow="xs" p="md">
            <Group align="start" position="apart">
                <div>
                    <Text fz="sm" c="dimmed">Workspace</Text>
                    <Text fz="xl">{workspace.name}</Text>
                </div>
                <JoinWorkspaceDialog workspace={workspace}/>
            </Group>
            <Text c="dimmed">
                A workspace is a logical unit to organize your projects and DevOps projects and
                manage app templates and app repositories. It is the place for you to control
                resource access and share resources within your team in a secure way.
            </Text>
        </Paper>
    )
}