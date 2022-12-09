import React from "react";
import { createRoot } from 'react-dom/client';
import {
    RouterProvider,
} from "react-router-dom";

import { MantineProvider } from '@mantine/core';
import { Authentication } from "./console/Authentication";
import Demo from "./console/Application/Demo";
import router from "./console/Router";

const Console = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Authentication>
                <RouterProvider router={router} />
                <Demo />
            </Authentication>
        </MantineProvider>
    )
}

const container = document.getElementById('console');
const root = createRoot(container)
    .render(<Console />);
