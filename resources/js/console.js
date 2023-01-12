import React from "react";
import { createRoot } from 'react-dom/client';

import { MantineProvider } from "@mantine/core";
import { Authentication } from "./console/Authentication";
import routes from "./console/routes";
import {RouterProvider} from "react-router-dom";
// import routes from "./console/routes";

const Console = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Authentication>
                <RouterProvider router={routes} />
            </Authentication>
        </MantineProvider>
    )
}

const container = document.getElementById('console');
const root = createRoot(container)
    .render(<Console />);
