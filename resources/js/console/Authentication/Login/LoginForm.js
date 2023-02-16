import {
    createStyles,
    TextInput,
    PasswordInput,
    Checkbox,
    Button,
    Text,
    Anchor, Stack, Divider, Grid, Image, Container, Center
} from '@mantine/core';
import { useAuthentication } from "../Authentication"
import {useForm} from "@mantine/form";
import {GithubIcon} from "@mantine/ds";


const GoogleIcon = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="xMidYMid"
            viewBox="0 0 256 262"
            width={14}
            height={14}
            {...props}
        >
            <path
                fill="#4285F4"
                d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
            />
            <path
                fill="#34A853"
                d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
            />
            <path
                fill="#FBBC05"
                d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
            />
            <path
                fill="#EB4335"
                d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
            />
        </svg>
    );
}


const GoogleLogin = (props) => {
    return <Button leftIcon={<GoogleIcon />} variant="default" color="gray" {...props} />;
}

const GithubLogin = (props) => {
    return (
        <Button
            {...props}
            leftIcon={<GithubIcon size={16} />}
            sx={(theme) => ({
                backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                color: '#fff',
                '&:hover': {
                    backgroundColor: theme.colors.dark[theme.colorScheme === 'dark' ? 9 : 6],
                },
            })}
        />
    );
}

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

export function LoginForm() {
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

                    <Text align="center" mt="md">
                        Click here if you{' '}
                        <Anchor href="/password" weight={700} >
                            forgot your password
                        </Anchor>
                    </Text>

                    <Divider my="sm" />

                    {/*<Stack position="center">*/}
                    {/*    <GoogleLogin fullWidth mt="md" size="md">*/}
                    {/*        Continue with Google*/}
                    {/*    </GoogleLogin>*/}
                    {/*    <GithubLogin fullWidth mt="md" size="md">*/}
                    {/*        Login with GitHub*/}
                    {/*    </GithubLogin>*/}
                    {/*</Stack>*/}
                </Container>
            </Grid.Col>
            <Grid.Col span={2} className={classes.panel}></Grid.Col>
        </Grid>
    );
}

export default LoginForm;