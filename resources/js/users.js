import React, {useEffect, useState} from "react";
import {createRoot} from "react-dom/client";

import {
    Avatar,
    Badge,
    Table,
    Group,
    Text,
    ActionIcon,
    Anchor,
    ScrollArea,
    useMantineTheme,
} from '@mantine/core';
import { IconPencil, IconTrash } from '@tabler/icons';

import {Data, useData} from "@terminal/data";
import { useOrdering } from "@terminal/data";

const defaults = {
    url: 'http://localhost:8000',
}

const jobColors = {
    engineer: 'blue',
    manager: 'cyan',
    designer: 'pink',
};

export function UsersTable() {
    const { data, loading } = useData()
    const { order_by, toggleOrderBy } = useOrdering()
    const theme = useMantineTheme();
    console.log('data', data, loading)

    if (loading) {
        return <div>loading</div>
    }

    if (!data || data.length <= 0) {
        return <div>no data</div>
    }
    const rows = data.map((item) => (
        <tr key={item.name}>
            <td>
                <Group spacing="sm">
                    <Avatar size={30} src={item.avatar} radius={30} />
                    <Text size="sm" weight={500}>
                        {item.name}
                    </Text>
                </Group>
            </td>

            <td>
                <Badge
                    color={jobColors[item.job.toLowerCase()]}
                    variant={theme.colorScheme === 'dark' ? 'light' : 'outline'}
                >
                    {item.job}
                </Badge>
            </td>
            <td>
                <Anchor size="sm" href="#" onClick={(event) => event.preventDefault()}>
                {item.email}
            </Anchor>
        </td>
    <td>
        <Text size="sm" color="dimmed">
            {item.phone}
        </Text>
    </td>
    <td>
        <Group spacing={0} position="right">
            <ActionIcon>
                <IconPencil size={16} stroke={1.5} />
            </ActionIcon>
            <ActionIcon color="red">
                <IconTrash size={16} stroke={1.5} />
            </ActionIcon>
        </Group>
    </td>
</tr>
));

    return (
        <ScrollArea>
            <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                <thead>
                <tr>
                    <th onClick={() => toggleOrderBy('employee')}>Employee</th>
                    <th>Job title</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th />
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}

const Users = () => {
    // const { request, loading } = useRemote(defaults);
    // const [ data, setData ] = useState()

    // useEffect(() => {
    //     // console.log('a', request.defaults)
    //     // request.defaults.url = 'http://localhost:6666'
    //     // console.log('b', request.defaults)
    //
    //     request.get({
    //         path: '/data/users',
    //         query: {page: 1}
    //     })
    //         // .then(data => console.log(data))
    //         .then(({data}) => setData(data))
    //         .catch((error) => {
    //             console.log('catch', error)
    //         })
    // }, [])


    // if (loading) {
    //     return <div>Loading2</div>
    // }
    //
    // if (!data) {
    //     return <div>no data</div>
    // }

    // console.log(data)

    return (
        <Data url="http://localhost:8000" path="/data/users">
            <UsersTable />
        </Data>
    )
}


const container = document.getElementById('users');
const root = createRoot(container)
    .render(<Users />);