import {Group, Paper, ScrollArea, Table, Text} from "@mantine/core";
import {IconBuilding} from "@tabler/icons";
import React from "react";

export default function UserProfileOrganizations({organizations}) {

    return (
        <Paper shadow="xs" p="md">
            <Text size="md">My Organizations</Text>
            <ScrollArea>
                <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Last active</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {organizations.map((item) => (
                        <tr key={item.name}>
                            <td>
                                <Group spacing="sm">
                                    <IconBuilding size={20} />
                                    <div>
                                        <Text size="sm" weight={500}>
                                            {item.fullname}
                                        </Text>
                                        <Text size="xs" color="dimmed">
                                            {item.name}
                                        </Text>
                                    </div>
                                </Group>
                            </td>

                            <td>
                                {item.pivot.roles.map(role=>role)}
                            </td>
                            <td>

                            </td>
                            <td>

                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </ScrollArea>
        </Paper>
    )
}