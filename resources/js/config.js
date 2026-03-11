import {createTheme} from "@mantine/core";

export default {
    app: {
        name: import.meta.env.VITE_CONSOLE_NAME,
        url: import.meta.env.VITE_CONSOLE_URL
    },


    logo: {
        image: import.meta.env.VITE_CONSOLE_LOGO_IMAGE ?? '/images/edgenet-logo.png',
        height: import.meta.env.VITE_CONSOLE_LOGO_HEIGHT ?? 120,
    },

    navigation: {
        image: import.meta.env.VITE_CONSOLE_NAVIGATION_IMAGE ?? '/images/edgenet-logo.png',
        height: import.meta.env.VITE_CONSOLE_NAVIGATION_HEIGHT ?? 60,
    },

    theme: createTheme({
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
    })
};