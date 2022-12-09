import React from "react";
import {
    createStyles, Tabs,
} from '@mantine/core';
import Dashboard from "./Dashboard";

const useStyles = createStyles((theme) => ({
    tabs: {
        [theme.fn.smallerThan('sm')]: {
            display: 'none',
        },
    },

    tabsList: {
        borderBottom: '0 !important',
    },

    tab: {
        fontWeight: 500,
        height: 38,
        backgroundColor: 'transparent',

        '&:hover': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[1],
        },

        '&[data-active]': {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
            borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[2],
        },
    },
}));

const Main = () => {
    const { classes } = useStyles();

    return (
        <>
            <Tabs
                onTabChange={(value) => console.log(value)}
                defaultValue="Home"
                variant="outline"
                classNames={{
                    root: classes.tabs,
                    tabsList: classes.tabsList,
                    tab: classes.tab,
                }}>
                <Tabs.List>
                    <Tabs.Tab value="/">
                        Dashboard
                    </Tabs.Tab>
                    <Tabs.Tab value="/config">
                        Config
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="/">
                    <Dashboard />
                </Tabs.Panel>
            </Tabs>

        </>
    )
}

export default Main;