import {Paper, Stack, Text, Title} from "@mantine/core";

export default function CreateNode() {

    return (
        <Stack>
            <Title py="lg" order={1}>
                Host a Node
            </Title>
            <Paper p="md">
                <Text fw={700}>
                    Please contact us to add a new node to PlanetLab:&nbsp;
                    <a href="mailto:support@planetlab.io?subject=PlanetLab%20Node%20Request">support@planetlab.io</a>
                </Text>
                <p>
                    By hosting a PlanetLab node, you contribute computing capacity to the testbed and support open science.
                    Anybody can contribute a node, whether by providing a VM, a physical machine, or by receiving a
                    small pre-configured device from PlanetLab.
                </p>
                <p>
                You can contribute in several ways:
                </p>
                <ul>
                    <li>provide a VM on existing infrastructure</li>
                    <li>provide your own physical machine, such as a server, mini PC, or single-board computer</li>
                    <li>receive a mini PC or single-board computer from PlanetLab and install it on your network</li>
                </ul>
            </Paper>
        </Stack>
    )
}