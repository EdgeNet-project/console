import {
    Table,
    Box, Group, Stack, ActionIcon, Tooltip, Center, Text
} from '@mantine/core';
import {useEffect, useState, useRef} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import Map from "./Map.jsx";
import NodeListRowCompact from "./NodeListRowCompact.jsx";
import NodeListRowDetailed from "./NodeListRowDetailed.jsx";
import NodeListRowMetrics from "./NodeListRowMetrics.jsx";
import {
    IconList,
    IconListDetails,
    IconMap,
    IconActivity,
    IconPlayerPause,
    IconPlayerPlay,
    IconRefresh
} from "@tabler/icons-react";

const listView = [
    { value: 'compact', label: 'Compact', icon: <IconList size="1rem" stroke={1.5} /> },
    { value: 'detailed', label: 'Detailed', icon: <IconListDetails size="1rem" stroke={1.5} /> },
    { value: 'metrics', label: 'Metrics', icon: <IconActivity size="1rem" stroke={1.5} /> },
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
const NodeListRegionSelect = ({value, onChange}) => {
    const regions = [
        { value: 'world', label: 'World' },
        { value: 'europe', label: 'Europe' },
        { value: 'north_america', label: 'North America' },
        { value: 'south_america', label: 'South America' },
        { value: 'asia', label: 'Asia' },
    ];

    return (
        <ActionIcon.Group>
            {regions.map(r =>
                <Tooltip key={r.value} label={r.label}>
                    <ActionIcon variant={value === r.value ? "filled" : "light"}
                                onClick={() => onChange(r.value)}
                                size="lg" style={{width:'10em'}} aria-label={r.label}>
                        <Text size="xs" fw={700} px="xs">{r.label}</Text>
                    </ActionIcon>
                </Tooltip>
            )}
        </ActionIcon.Group>
    )
}

export default function NodeList() {
    const [ nodes, setNodes ] = useState([]);
    const [ view, setView ] = useState('compact');
    const [ region, setRegion ] = useState('world');
    const [ isPaused, setIsPaused ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const intervalRef = useRef(null);
    const navigate = useNavigate();

    const fetchNodes = () => {
        setIsLoading(true);
        axios.get('/api/node/list')
            .then(({data}) => {
                setNodes(data)
            })
            .catch((error) => {
                console.log(error)
            })
            .finally(() => {
                setIsLoading(false);
            })
    }

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
        fetchNodes();

        intervalRef.current = setInterval(() => {
            if (!isPaused) {
                fetchNodes();
            }
        }, 30000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            setNodes([])
        }
    }, [isPaused])

    const controls = (
        <Group>
            <NodeListViewSelect value={view}
                                onChange={(value) => setView(value)} />

            <ActionIcon.Group>
                <Tooltip label={isPaused ? "Resume live updates" : "Pause live updates"}>
                    <ActionIcon variant="light" size="lg" onClick={() => setIsPaused(!isPaused)}>
                        {isPaused ? <IconPlayerPlay size="1rem" /> : <IconPlayerPause size="1rem" />}
                    </ActionIcon>
                </Tooltip>
                <Tooltip label="Force update">
                    <ActionIcon variant="light" size="lg" onClick={fetchNodes} loading={isLoading}>
                        <IconRefresh size="1rem" />
                    </ActionIcon>
                </Tooltip>
            </ActionIcon.Group>


        </Group>
    );

    if (view === 'map') {
        return <Stack>
            <Group>
                {controls}
                <NodeListRegionSelect
                    value={region}
                    onChange={(value) => setRegion(value)}
                />
            </Group>
            <Map nodes={nodes} region={region} />
        </Stack>

    }

    const rows = nodes.map((item) => {
        if (view === 'compact') {
            return <NodeListRowCompact key={item.id} item={item} handleEnable={handleEnable} />
        } else if (view === 'detailed') {
            return <NodeListRowDetailed key={item.id} item={item} handleEnable={handleEnable} />
        } else if (view === 'metrics') {
            return <NodeListRowMetrics key={item.id} item={item} handleEnable={handleEnable} />
        }
    });

    return (
        <Stack>
            {controls}
            <Table.ScrollContainer minWidth={800} maxHeight="80vh">
                <Table verticalSpacing="sm">
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Node</Table.Th>
                            {view === 'metrics' ? (
                                <>
                                    <Table.Th>CPU & Load</Table.Th>
                                    <Table.Th>Network</Table.Th>
                                    <Table.Th>Disk</Table.Th>
                                </>
                            ) : (
                                <>
                                    <Table.Th>Network</Table.Th>
                                    <Table.Th>Last active</Table.Th>
                                </>
                            )}
                            <Table.Th>Status</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>{rows}</Table.Tbody>
                </Table>
            </Table.ScrollContainer>
        </Stack>
    );

}