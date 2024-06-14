import React from "react";
import {useAuthentication} from "../Authentication";
import { Group, Paper, ScrollArea, Stack, Table, Text, Title} from "@mantine/core";
import {IconBoxPadding as IconWorkspace, IconBuilding, IconUser} from "@tabler/icons";


export default () => {
    const { user } = useAuthentication();

    if (user.requests.length == 0) {
        return (
            <Paper p="md">
                There are no pending requests.
            </Paper>
        );
    }

    return (
        <Paper p="md">
            <Group mb="xs">
                <IconWorkspace />
                <Text weight={500}>(Tenant)</Text>
                {/*<Badge color="pink" variant="light">*/}
                {/*    On Sale*/}
                {/*</Badge>*/}
            </Group>
            {/*<Text size="md"><IconBuilding size={20} /> {tenant.fullname}</Text>*/}
            <ScrollArea>
                <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {user.requests.map((item) =>
                        <tr key={'user-request-' + item.ide}>
                            <td>
                                {item.type}
                            </td>
                            <td>
                                <pre>
                                    <code>{JSON.stringify(item.data, null, 2)}</code>
                                  </pre>
                            </td>
                            <td>
                                <Text size="sm" weight={500}>
                                    {item.status}
                                </Text>
                                <Text size="xs" color="dimmed">
                                    {item.message}
                                </Text>
                                <Text size="xs" color="dimmed">
                                </Text>
                            </td>
                            <td>
                                {/*<Group>*/}
                                {/*    <Button color="teal" onClick={() => handleRequest(item, true)}>Approve</Button>*/}
                                {/*    <Button color="red" onClick={() => handleRequest(item, false)}>Deny</Button>*/}
                                {/*</Group>*/}
                            </td>
                        </tr>
                    )}
                    </tbody>
                </Table>
            </ScrollArea>
        </Paper>

    )
}