import React from "react";

import {Anchor, AppShell, Burger, Container, Group, Image, Text, ScrollArea, Stack, Divider} from "@mantine/core";
import {useDisclosure, useMediaQuery} from "@mantine/hooks";

import NavigationMenu from "../Navigation/NavigationMenu";
import {Outlet} from "react-router-dom";
import NavigationAccount from "../Navigation/NavigationAccount";

import config from "../../config";
import NavigationAdmin from "../Navigation/NavigationAdmin.jsx";

const Application = () => {
    const [opened, { toggle }] = useDisclosure();
    const medium = useMediaQuery('(min-width: 801px)');
    const large = useMediaQuery('(min-width: 1600px)');

    return (
            <AppShell
                // header={{ height: 60 }}
                navbar={{ width: 280, breakpoint: 'md', collapsed: { mobile: !opened } }}
            >

                {/*<AppShell.Header withBorder={false}>*/}
                {/*    <Group h="100%" px="md" justify="space-between">*/}
                {/*        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />*/}
                {/*        <div />*/}
                {/*        <Group ml="xl" gap="lg" visibleFrom="sm">*/}
                {/*            <Anchor target="_blank" href={"mailto:" + console_app.support + "?subject=" + console_app.name + " Console Support"}>Support</Anchor>*/}
                {/*        </Group>*/}
                {/*    </Group>*/}
                {/*</AppShell.Header>*/}


                <AppShell.Navbar withBorder={false}>
                    <AppShell.Section py="sm">
                        <Anchor target="_blank" underline="never" href={config.app.url}>
                            <Image src={config.navigation.image}
                                   alt={config.name}
                                   style={{marginLeft:-20}}
                                   height={config.navigation.height}
                                   fit="contain" />
                        </Anchor>
                    </AppShell.Section>
                    <AppShell.Section grow component={ScrollArea}>
                        <NavigationMenu />
                        <Divider label="" my="sm" />
                        <NavigationAdmin />
                    </AppShell.Section>
                    <AppShell.Section py="sm" >


                        <NavigationAccount />
                    </AppShell.Section>
                </AppShell.Navbar>

                <AppShell.Main style={{backgroundColor: 'var(--mantine-primary-color-light)'}}>
                    <Container size={medium ? large ? "xxl" : "lg" : ''}>
                        <Outlet />
                    </Container>
                </AppShell.Main>

            </AppShell>
    )

}

export default Application;