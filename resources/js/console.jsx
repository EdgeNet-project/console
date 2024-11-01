import React from "react";
import { createRoot } from 'react-dom/client';

import { MantineProvider } from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { AuthenticationProvider } from "./console/Authentication";
import routes from "./console/Application/routes/routes";
import {RouterProvider} from "react-router-dom";
// import routes from "./console/routes";

const Console = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Notifications position="top-center" />
            <AuthenticationProvider>
                <RouterProvider router={routes} />
            </AuthenticationProvider>
        </MantineProvider>
    )
}

const container = document.getElementById('console');
createRoot(container).render(<Console />);
