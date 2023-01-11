import React from "react";
import { createRoot } from 'react-dom/client';
import { RouterProvider } from "react-router-dom";

import { MantineProvider } from "@mantine/core";
import { Authentication } from "./console/Authentication";
import { Application } from "./console/Application";
import router from "./console/routes";

const Console = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Authentication>
            </Authentication>
        </MantineProvider>
    )
}

const container = document.getElementById('console');
const root = createRoot(container)
    .render(<Console />);
