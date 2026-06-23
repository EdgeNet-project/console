import {
    Container, Group, Image,
    Stack, Title
} from '@mantine/core';
import React, {useEffect, useState} from "react";
import axios from "axios";
import Map from "./Nodes/Map.jsx";
import List from "./Nodes/List.jsx";
import config from "../config.js";

export default function Nodes() {
    const [ nodes, setNodes ] = useState([]);

    useEffect(() => {
        axios.get('/status/api/nodes')
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

    if (!nodes) {
        return null;
    }

    return (
        <Container>
            <Group justify="space-between" my="lg">
                <Image src="/images/planetlab-h.png"
                       alt="PlanetLab"
                       w="auto" h={50}
                       fit="contain" />
                <Title order={1} size={18}>Nodes status</Title>
            </Group>
            <Stack>
                <Map nodes={nodes} />
                <List nodes={nodes} />
            </Stack>
        </Container>
    );

}