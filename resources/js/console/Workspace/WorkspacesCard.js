import {Badge, Text, Card, Group, Table, ScrollArea, Divider} from "@mantine/core";
import CreateWorkspaceDialog from "./CreateWorkspaceDialog";
import {IconBoxPadding as IconWorkspace} from "@tabler/icons";
import React from "react";


export default ({workspaces}) => {


    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="xs">
                <IconWorkspace />
                <Text weight={500}>Workspaces</Text>
                {/*<Badge color="pink" variant="light">*/}
                {/*    On Sale*/}
                {/*</Badge>*/}
            </Group>

            <Text size="sm" color="dimmed">
                This is an example description text
            </Text>

            <ScrollArea>
                <Table horizontalSpacing={0} verticalSpacing="xs">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Users</th>
                        {/*<th>Status</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {workspaces.map(workspace =>
                        <tr key={workspace.name}>
                            <td>
                                <Text size="xs" color="dimmed">
                                    {workspace.namespace}
                                </Text>
                                <Text>
                                {workspace.name}
                                </Text>
                            </td>
                            <td>

                            </td>
                            {/*<td></td>*/}
                        </tr>
                    )}
                    </tbody>
                </Table>
            </ScrollArea>
            <Divider my="md" />
            <CreateWorkspaceDialog />
        </Card>
    )
}