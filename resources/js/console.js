import React from "react";
import { createRoot } from 'react-dom/client';

import { MantineProvider } from "@mantine/core";
import { AuthenticationProvider } from "./console/Authentication";
import routes from "./console/routes";
import {RouterProvider} from "react-router-dom";
// import routes from "./console/routes";

const Console = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <AuthenticationProvider>
                <RouterProvider router={routes} />
            </AuthenticationProvider>
        </MantineProvider>
    )
}

const container = document.getElementById('console');
createRoot(container).render(<Console />);
