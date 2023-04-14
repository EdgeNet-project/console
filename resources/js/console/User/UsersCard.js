import {Badge, Text, Card, Group, Table, ScrollArea, Divider, Stack} from "@mantine/core";
import {IconUsers} from "@tabler/icons";
import React from "react";
import InviteUsersDialog from "./InviteUsersDialog";


export default ({users}) => {


    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="xs">
                <IconUsers color="teal" />
                <Text weight={500}>Users</Text>
                <Badge color="pink" variant="light">
                    {users.length}
                </Badge>
            </Group>

            <Text size="sm" color="dimmed">
                This is an example description text
            </Text>

            <ScrollArea>
                <Table horizontalSpacing={0} verticalSpacing="xs">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user =>
                        <tr key={user.id}>
                            <td>
                                <Text size="xs" color="dimmed">
                                    {user.email}
                                </Text>
                                <Text>
                                {user.firstname} {user.lastname}
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

            <Stack>
                <Divider my="md" />
                <InviteUsersDialog />
            </Stack>
        </Card>
    )
}