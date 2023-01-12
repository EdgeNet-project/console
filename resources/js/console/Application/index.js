import {AppShell} from "@mantine/core";
import NavigationHeader from "./NavigationHeader";
import Navigation from "./Navigation";

import {useAuthentication} from "../Authentication";
import {Outlet} from "react-router-dom";
import React from "react";

const Application = () => {
    const { user, isAuthenticated } = useAuthentication()

    if (isAuthenticated()) {
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

    }

    return (
         'login'
    )

    // <RouterProvider router={router} />
}

export default Application;