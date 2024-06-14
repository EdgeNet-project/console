import {Alert, Anchor, Badge, Breadcrumbs, Code, Container, Group, Select, Text, Title} from "@mantine/core";
import {Link, useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import Nodes from "../Dashboard/Nodes";
import NodeStatus from "./NodeStatus";
import {IconInfoCircle} from "@tabler/icons";
import NodeRawInfo from "./NodeRawInfo";
import NodeInstall from "./NodeInstall";
import NodeActivity from "./NodeActivity";

const NodeView = () => {
    const { id } = useParams();
    const [ node, setNode ] = useState();

    useEffect(() => {
        axios.get('/api/nodes/' + id)
            .then(({data}) => {
                console.log(data)
                setNode(data)
            })
            .catch((error) => {
                console.log(error)
            })

        return () => {
            setNode([])
        }
    }, []);

    if (!node) {
        return null;
    }

    if (!node.status || node.status === 'to install') {
        return <NodeInstall node={node} />
    }

    return (
        <Container>
            {node.status === 'to install' ?
            <Group justify="apart">
                <Title  order={1}>
                    {node.name ?? ''}
                </Title>
                <NodeStatus status={node.status} />
            </Group> : <Title order={1}>Node installation</Title>}

            <Text my="sm">
                Review your node configuration and status.
            </Text>

            <NodeInstall node={node} />

            <NodeRawInfo node={node} />

            <NodeActivity node={node} />
        </Container>
    )
}

export default NodeView;