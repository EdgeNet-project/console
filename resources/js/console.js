import React from "react";
import ReactDOM from "react-dom";
import { MantineProvider } from '@mantine/core';

const Console = () => {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>

        </MantineProvider>
    )
}

if (dom) {
    ReactDOM.render(<Console settings={settings} />,
        document.getElementById('console'));
}
