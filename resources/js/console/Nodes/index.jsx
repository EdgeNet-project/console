import {Alert, Anchor, Badge, Breadcrumbs, Code, Container, Group, Select, Text, Title} from "@mantine/core";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import NodeStatus from "./components/NodeStatus";
import NodeRawInfo from "./NodeRawInfo";
import NodeInstall from "./NodeInstall";
import NodeActivity from "./NodeActivity";

const Index = () => {
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
        <>
            {node.status === 'to install' ?
            <Group justify="apart">
                <Title order={1}>
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
        </>
    )
}

export default Index;