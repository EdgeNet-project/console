import {
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Text,
    Anchor, Stack, Divider, Grid, Image, Container, Center
} from '@mantine/core';
import {GithubLogin, GoogleLogin} from "./LoginButtons";
import { useAuthentication } from "../Authentication"
import {useForm} from "@mantine/form";

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
    form: {
        //minHeight: '100vh',
        // maxWidth: 400,
        // paddingTop: 80,

        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
            maxWidth: '100%',
        },
    },

    title: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
    },

    logo: {
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        width: 120,
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
}));

export function Panel() {
    const { classes } = useStyles();
    const { login, loading, error } = useAuthentication();
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },


    });

    const formSubmit = () => {
        console.log('submit')
    }

    return (
        <Grid grow>
            <Grid.Col span={2}>
                <Container size={400}>
                    <Image src="/images/edgenet.png" alt="EdgeNet" height={100} fit="contain" my="xl"/>

                    <form onSubmit={form.onSubmit((values) => login(values))}>
                        <TextInput label="Email address" {...form.getInputProps('email')}
                                   placeholder="hello@gmail.com" />
                        <PasswordInput label="Password" {...form.getInputProps('password')}
                                       placeholder="Your password" mt="md" size="md" />
                        <Checkbox label="Keep me logged in" mt="xl" size="md" />
                        <Button disabled={loading} type="submit" fullWidth mt="xl" size="md">
                            Login
                        </Button>
                    </form>

                    <Text align="center" mt="md">
                        Don&apos;t have an account?{' '}
                        <Anchor href="/registration" weight={700} >
                        Register
                        </Anchor>
                    </Text>

                    <Divider my="sm" />

                    <Stack position="center">
                        <GoogleLogin fullWidth mt="md" size="md">
                            Continue with Google
                        </GoogleLogin>
                        <GithubLogin fullWidth mt="md" size="md">
                            Login with GitHub
                        </GithubLogin>
                    </Stack>
                </Container>
            </Grid.Col>
            <Grid.Col span={2} className={classes.panel}></Grid.Col>
        </Grid>
    );
}

export default Panel;