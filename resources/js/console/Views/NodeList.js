import { createStyles, Table, Progress, Anchor, Text, Group, ScrollArea } from '@mantine/core';
import {useEffect, useState} from "react";
import axios from "axios";

const useStyles = createStyles((theme) => ({
    progressBar: {
        '&:not(:first-of-type)': {
            borderLeft: `3px solid ${theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`,
        },
    },
}));
//
// interface TableReviewsProps {
//     data: {
//         title: string;
//         author: string;
//         year: number;
//         reviews: { positive: number; negative: number };
//     }[];
// }

const NodeAddresses = ({addresses}) => addresses.map((address, i) => <div key={'n-address-'+i}>
        <i>{address.type}</i> {address.address}</div>)

const NodeCapacity = ({capacity}) => <>
    <i>CPUs</i> {capacity.cpu}, <i>RAM</i> {capacity.memory}<br />
    <i>Storage</i> {capacity['ephemeral-storage']}<br />
    <i>PODs</i> {capacity.pods}
</>

const NodeInfo = ({nodeInfo}) => <>
    <i>Architecture</i> {nodeInfo.architecture}<br />
    <i>OS</i> {nodeInfo.operatingSystem}&nbsp;{nodeInfo.osImage}<br />
    <i>Version</i> {nodeInfo.kubeletVersion}
</>

export default function NodeList() {
    const [ nodes, setNodes ] = useState([]);
    const { classes, theme } = useStyles();

    useEffect(() => {
        axios.get('/api/nodes')
            .then(({data}) => {
                console.log(data)
                setNodes(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setNodes([])
        }
    }, [])

    const rows = nodes.map((node) => {
        // const totalReviews = row.reviews.negative + row.reviews.positive;
        // const positiveReviews = (row.reviews.positive / totalReviews) * 100;
        // const negativeReviews = (row.reviews.negative / totalReviews) * 100;

        return (
            <tr key={node.metadata.name}>
            <td>
                <Anchor size="sm" onClick={(event) => event.preventDefault()}>{node.metadata.name}</Anchor>
                <NodeAddresses addresses={node.status.addresses} />
            </td>
            <td>
                <NodeCapacity capacity={node.status.capacity} />
            </td>
            <td>
               <NodeInfo nodeInfo={node.status.nodeInfo} />
            </td>
        <td>

        </td>
        <td>
            <Group position="apart">
                <Text size="xs" color="teal" weight={700}>

                </Text>
                <Text size="xs" color="red" weight={700}>

                </Text>
            </Group>
            {/*<Progress*/}
            {/*    classNames={{ bar: classes.progressBar }}*/}
            {/*    sections={[*/}
            {/*        {*/}
            {/*            value: positiveReviews,*/}
            {/*            color: theme.colorScheme === 'dark' ? theme.colors.teal[9] : theme.colors.teal[6],*/}
            {/*        },*/}
            {/*        {*/}
            {/*            value: negativeReviews,*/}
            {/*            color: theme.colorScheme === 'dark' ? theme.colors.red[9] : theme.colors.red[6],*/}
            {/*        },*/}
            {/*    ]}*/}
            {/*/>*/}
        </td>
    </tr>
    );
    });

    return (
        <ScrollArea>
            <Table sx={{ minWidth: 800 }} verticalSpacing="xs">
                <thead>
                <tr>
                    <th>Node</th>
                    <th></th>
                    <th></th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>{rows}</tbody>
            </Table>
        </ScrollArea>
    );
}