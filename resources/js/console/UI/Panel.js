import {
    createStyles,
    Grid,
    Image,
    Container
} from '@mantine/core';

const useStyles = createStyles((theme) => ({
    panel: {
        // borderRight: `1px solid ${
        //     theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[3]
        // }`,
        minHeight: '100vh',
        width: '60%',
        backgroundSize: '80%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundImage:
            'url(/images/platforms.png)',
        // backgroundColor: '#b4d9ef',
        backgroundColor: '#c9d6e8',
    },
}));

export default function Panel({children}) {
    const { classes } = useStyles();


    return (
        <Grid grow>
            <Grid.Col span={2}>
                <Container size={400}>
                    <Image src="/images/edgenet.png" alt="EdgeNet" height={100} fit="contain" my="xl"/>
                    {children}
                </Container>
            </Grid.Col>
            <Grid.Col span={2} className={classes.panel}></Grid.Col>
        </Grid>
    );
}