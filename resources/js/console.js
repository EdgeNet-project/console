import React from "react";
import { createRoot } from 'react-dom/client';

import { MantineProvider } from '@mantine/core';
import Application from "./console/Application";
import { Auth } from "./console/Authentication";

const Console = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <Auth>
                <Application />
            </Auth>
        </MantineProvider>
    )
}

const container = document.getElementById('console');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<Console tab="home" />);
