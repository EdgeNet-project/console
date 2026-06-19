import {
    Table,
    Box, SegmentedControl, Group, Stack, ActionIcon
} from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Map from "./Map.jsx";
import NodeListRowCompact from "./NodeListRowCompact.jsx";
import NodeListRowDetailed from "./NodeListRowDetailed.jsx";
import {IconList, IconListDetails, IconMap} from "@tabler/icons-react";

const listView = [
    { value: 'compact', label: 'Compact', icon: <IconList size="1rem" stroke={1.5} /> },
    { value: 'detailed', label: 'Detailed', icon: <IconListDetails size="1rem" stroke={1.5} /> },
    { value: 'map', label: 'Map', icon: <IconMap size="1rem" stroke={1.5} /> },
];

const NodeListViewSelect = ({value, onChange}) => {
    return (
        <ActionIcon.Group>
            {listView.map(l =>
                <ActionIcon variant={value === l.value ? "filled" : "light"}
                            onClick={() => onChange(l.value)}
                            size="lg" aria-label={l.label}>
                    {l.icon}
                </ActionIcon>)}
        </ActionIcon.Group>
    )
}
export default function NodeList() {
    const [ nodes, setNodes ] = useState([]);
    const [ view, setView ] = useState('compact');
    const [ region, setRegion ] = useState('world');
    const navigate = useNavigate();

    const handleEnable = (nodeId, enabled) => {
        axios.post(`/api/node/enable/${nodeId}`, { enabled })
            .then(({data}) => {
                setNodes(nodes.map(n => n.id === nodeId ? data : n))
            })
            .catch((error) => {
                console.log(error)
            })
    }

    useEffect(() => {
        axios.get('/api/node/list')
            .then(({data}) => {
                setNodes(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setNodes([])
        }
    }, [])

    if (view === 'map') {
        return <Stack>
            <Group>
                <NodeListViewSelect value={view}
                                    onChange={(value) => setView(value)} />

                <SegmentedControl
                    data={[
                        { value: 'world', label: 'World' },
                        { value: 'europe', label: 'Europe' },
                        { value: 'north_america', label: 'North America' },
                        { value: 'south_america', label: 'South America' },
                        { value: 'asia', label: 'Asia' },
                    ]}
                    value={region}
                    onChange={(value) => setRegion(value)}
                />
            </Group>
            <Map nodes={nodes} region={region} />
        </Stack>

    }

    const rows = nodes.map((item) => view === 'compact' ?
        <NodeListRowCompact key={item.id} item={item} handleEnable={handleEnable} /> :
        <NodeListRowDetailed key={item.id} item={item} handleEnable={handleEnable} />);

    return (
        <Stack>
            <NodeListViewSelect value={view}
                                onChange={(value) => setView(value)} />
            <Table.ScrollContainer minWidth={800} maxHeight="80vh">
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Node</Table.Th>
                            <Table.Th>Network</Table.Th>
                            <Table.Th>Last active</Table.Th>
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Stack>
    );

}