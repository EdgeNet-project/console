import {useState, useEffect} from "react";
import {Button, Card, Divider, Group, ScrollArea, Table, Text} from "@mantine/core";
import {IconBoxPadding as IconWorkspace} from "@tabler/icons";
import axios from "axios";
import {useAuthentication} from "../Authentication";

export default () => {
    const { user } = useAuthentication()

    // const [teams, setTeams] = useState([]);
    // const [selected, setSelected] = useState(null);
    // // const [loading, setLoading] = useState(false);
    //
    // useEffect(() => {
    //     axios.get('/api/tenants')
    //         .then(({data}) => {
    //             setTeams(data)
    //         })
    // }, [])
    //
    // const handleSelect = (value) => {
    //     setSelected(workspaces.find(wp => wp.value === value))
    //
    //     onChange(workspaces.find(wp => wp.value === value))
    // }

    return (
        <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group mb="xs">
                <IconWorkspace />
                <Text weight={500}>Teams</Text>
                {/*<Badge color="pink" variant="light">*/}
                {/*    On Sale*/}
                {/*</Badge>*/}
            </Group>

            <Text size="sm" color="dimmed">
                Your Teams
            </Text>

            <ScrollArea>
                <Table horizontalSpacing={0} verticalSpacing="xs">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th></th>
                        {/*<th>Status</th>*/}
                    </tr>
                    </thead>
                    <tbody>
                    {user.tenants.map(team =>
                        <tr key={team.name}>
                            <td>
                                <Text size="xs" color="dimmed">
                                    {team.namespace}
                                </Text>
                                <Text>
                                    {team.fullname}
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
            <Group>
                <Button>Create a new Team</Button>
            </Group>
        </Card>
    )
}
