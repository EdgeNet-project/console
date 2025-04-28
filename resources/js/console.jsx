import React from "react";
import { createRoot } from 'react-dom/client';

import {createTheme, MantineProvider} from "@mantine/core";
import { Notifications } from '@mantine/notifications';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import { AuthenticationProvider } from "./console/Authentication";
import routes from "./console/Application/routes/routes";
import {RouterProvider} from "react-router-dom";
// import routes from "./console/routes";

const theme = createTheme({
    primaryColor: 'blue',
    colors: {
        blue: [
            "#edf5fd",
            "#d9e6f5",
            "#adcced",
            "#7fb0e6",
            "#5b98e0",
            "#4689dd",
            "#3a82dd",
            "#2e6fc4",
            "#2463b0",
            "#12559b"
        ],
    },
});

const Console = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <Notifications position="top-center" />
            <AuthenticationProvider>
                <RouterProvider router={routes} />
            </AuthenticationProvider>
        </MantineProvider>
    )
}

const container = document.getElementById('console');
createRoot(container).render(<Console />);
