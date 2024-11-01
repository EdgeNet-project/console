import React from "react";

import {Anchor, AppShell, Burger, Container, Group, Image, Text, ScrollArea} from "@mantine/core";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";

import NavigationMenu from "../Navigation/NavigationMenu";
import {Outlet} from "react-router-dom";
import NavigationAccount from "../Navigation/NavigationAccount";

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
    const medium = useMediaQuery('(min-width: 801px)');
    const large = useMediaQuery('(min-width: 1600px)');

    return (
            <AppShell
                header={{ height: 60 }}
                navbar={{ width: 300, breakpoint: 'md', collapsed: { mobile: !opened } }}
            >

                <AppShell.Header withBorder={false}>
                    <Group h="100%" px="md" justify="space-between">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Anchor target="_blank" underline="never" href="https://edge-net.org">
                            <Group padding="sm" position="start">
                                <Image src="/images/edgenet-logo.png" alt="EdgeNet" height={28} fit="contain" />
                                <Text fw={500} fz="lg" color="black">EdgeNet</Text>
                            </Group>
                        </Anchor>
                        <Group ml="xl" gap="lg" visibleFrom="sm">
                            <Anchor target="_blank" href="mailto:support@edge-net.org?subject=EdgeNet Console Support">Support</Anchor>
                        </Group>
                    </Group>
                </AppShell.Header>


                <AppShell.Navbar withBorder={false}>
                    <AppShell.Section grow p="sm" component={ScrollArea}>
                        <NavigationMenu />
                    </AppShell.Section>
                    <AppShell.Section pb="sm" px="sm">
                        <NavigationAccount />
                    </AppShell.Section>
                </AppShell.Navbar>

                <AppShell.Main style={{backgroundColor:"#e4ecfb"}}>
                    <Container size={medium ? large ? "xxl" : "lg" : ''}>
                        <Outlet />
                    </Container>
                </AppShell.Main>

            </AppShell>
    )

}

export default Application;