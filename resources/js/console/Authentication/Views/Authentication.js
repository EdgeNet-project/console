import {
    createStyles, rem,
    SimpleGrid, Image, Container, Text, Group, Title,
} from '@mantine/core';
import {Outlet} from "react-router-dom";

const useStyles = createStyles((theme) => ({
    grid: {
        alignItems: 'start'
    },

    image: {
        // borderRight: `1px solid ${
        //     theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
        // }`,
        minHeight: '100vh',
        width: '100%',
        backgroundSize: '80%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundImage:
            'url(/images/platforms.png)',
        // backgroundColor: '#b4d9ef',
        backgroundColor: '#c9d6e8',
    },

    panel: {
        minWidth: rem(350),
        maxWidth: rem(400),
        marginRight: 'auto',
        marginLeft: 'auto',
        marginTop: rem(100),
    },

    logo: {
    //     color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        width: '200px',
    //     display: 'block',
    //     marginLeft: 'auto',
    //     marginRight: 'auto',
    },
}));

export function Authentication() {
    const { classes } = useStyles();

    return (
        <SimpleGrid cols={1} className={classes.grid} breakpoints={[
            { minWidth: 'sm', cols: 2, spacing: 0 },
        ]}>
            <div className={classes.panel}>
                <Group sx={{ height: '100%' }} spacing="sm" pb="xl" position="start">
                    <div><Image src="/images/edgenet-logo.png" alt="EdgeNet" height={60} fit="contain" /></div>
                    <Title order={1} weight={400}>EdgeNet</Title>
                </Group>
                <Outlet />
            </div>
            <div className={classes.image}></div>
        </SimpleGrid>
    );
}

export default Authentication;