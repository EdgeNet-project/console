import React from "react";
import { redirect } from "react-router-dom";

import {AppShell, Container} from "@mantine/core";
import NavigationHeader from "./NavigationHeader";
import Navigation from "./Navigation";

import {useAuthentication} from "../Authentication";
import {Outlet} from "react-router-dom";
import TenantSelect from "../Authentication/Views/TenantSelect";

const Application = () => {
    const { user, isAuthenticated } = useAuthentication()
    // User must have verified his email address
    if (!user.email_verified_at) {
        // return 'email not verified';
    }

    // Check if user is part of at least one tenant
    // if (user.tenants.length <= 0) {
    //     return <>
    //             <NavigationHeader />
    //             <Container size="xs" px="xs">
    //                 <TenantSelect />
    //             </Container>
    //         </>;
    // }

    // Accept AUP
    // if (!user.aup) {
    //     return 'AUP'
    // }

    if (!isAuthenticated()) {
        return redirect("/");
    }

    return (
        <AppShell
            padding="md"
            navbar={<Navigation />}
            header={<NavigationHeader />}
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <Outlet />
        </AppShell>
    )

    // <RouterProvider router={router} />
}

export default Application;