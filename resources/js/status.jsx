import React from "react";
import { createRoot } from 'react-dom/client';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {MantineProvider} from "@mantine/core";
import '@mantine/core/styles.css';

import Layout from "./status/Layout.jsx";
import Nodes from "./status/Nodes.jsx";

import config from "./config";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        loader: null,
        children: [
            {
                path: "/nodes",
                element: <Nodes />,
            },
        ],
    },
]);

const Status = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS theme={config.theme}>
            <RouterProvider router={router} />
        </MantineProvider>
    )
}

const container = document.getElementById('status');
createRoot(container).render(<Status />);
