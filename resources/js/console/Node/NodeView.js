import {Alert, Anchor, Badge, Breadcrumbs, Code, Container, Group, Text, Title} from "@mantine/core";
import {Link, useParams} from "react-router";
import {useEffect, useState} from "react";
import axios from "axios";
import Nodes from "../Dashboard/Nodes";
import NodeStatus from "./NodeStatus";
import {IconInfoCircle} from "@tabler/icons";
import NodeRawInfo from "./NodeRawInfo";

const NodeView = () => {
    const { hostname } = useParams();
    const [ node, setNode ] = useState();

    useEffect(() => {
        axios.get('/api/nodes/' + hostname)
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
    return (
        <Container>
            <Group justify="apart">
                <Title  order={1}>
                    {node.hostname}
                </Title>
                <NodeStatus status={node.status} />
            </Group>

            <Text my="sm">
                Review your node configuration and status.
            </Text>


            <Alert icon={<IconInfoCircle size="1rem"/>} title="Start the node installation" color="blue">
                <Text mt="xl">
                    You can start the node installation by executing the following command on your node:
                </Text>
                <Code block>
                    curl -s {node.installation_url} | bash
                </Code>


            </Alert>
            <Text fz="sm" mt="xs">

            </Text>
            <NodeRawInfo node={node} />
        </Container>
    )
}

export default NodeView;