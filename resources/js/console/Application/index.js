import React from "react";

import {Anchor, AppShell, Burger, Container, Group, Image, Text, UnstyledButton} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";

import NavigationMenu from "../Navigation/NavigationMenu";
import {Outlet} from "react-router-dom";

const ApplicationHeader = () => {

    return (
        <Group sx={{ height: '100%' }} spacing="sm" px={20} position="apart">
            <Group padding="sm" position="start">
                <div><Image src="/images/edgenet-logo.png" alt="EdgeNet" height={28} fit="contain" /></div>
                <Text fw={500} fz="lg">EdgeNet</Text>
            </Group>
        </Group>
    )
}

const Application = () => {
    const [opened, { toggle }] = useDisclosure();

    return (
            <AppShell
                header={{ height: 60 }}
                navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
                // padding="md"
            >

                <AppShell.Header>
                    <Group h="100%" px="md" justify="space-between">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Group padding="sm" position="start">
                            <Image src="/images/edgenet-logo.png" alt="EdgeNet" height={28} fit="contain" />
                            <Text fw={500} fz="lg">EdgeNet</Text>
                        </Group>
                        <Group ml="xl" gap="lg" visibleFrom="sm">
                            <Anchor target="_blank" href="">Home</Anchor>
                            <Anchor target="_blank" href="">Blog</Anchor>
                            <Anchor target="_blank" href="">Contacts</Anchor>
                            <Anchor target="_blank" href="">Support</Anchor>
                        </Group>
                    </Group>
                </AppShell.Header>


                <AppShell.Navbar>
                    <NavigationMenu />
                </AppShell.Navbar>

                <AppShell.Main style={{backgroundColor:"#e4ecfb"}}>
                    <Container>
                        <Outlet />
                    </Container>
                </AppShell.Main>

            </AppShell>
    )

}

export default Application;