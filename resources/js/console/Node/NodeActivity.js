import {Badge, Table} from "@mantine/core";
import {useEffect, useState} from "react";
import axios from "axios";
import dayjs from "dayjs";

const ActivitySeverity = ({severity}) => {
    let color = '';

    switch(severity) {
        case "error":
            color = "red";
            break;
        case "warning":
            color = "orange";
            break;
        case "info":
            color = "blue";
            break;
    }
    return (
        <Badge color={color} variant="light">
            {severity}
        </Badge>
    )
}
export default ({node}) => {
    const [ activity, setActivity ] = useState();

    useEffect(() => {
        axios.get('/api/nodes/' + node.hostname + '/activity')
            .then(({data}) => {
                console.log(data)
                setActivity(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setActivity([])
        }
    }, []);

    if (!activity) {
        return null;
    }
    return (
        <Table.ScrollContainer minWidth={800}>
            <Table verticalSpacing="xs">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Date</Table.Th>
                        <Table.Th>Severity</Table.Th>
                        <Table.Th>Description</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{activity.map((row) =>
                    <Table.Tr key={row.id}>
                        <Table.Td>{dayjs(row.created_at).format(' DD/MM/YYYY HH:mm:ssZ')}</Table.Td>
                        <Table.Td>
                            <ActivitySeverity severity={row.properties.severity} />
                        </Table.Td>
                        <Table.Td>{row.description}</Table.Td>
                    </Table.Tr>
                )}</Table.Tbody>
            </Table>
        </Table.ScrollContainer>
    )
}