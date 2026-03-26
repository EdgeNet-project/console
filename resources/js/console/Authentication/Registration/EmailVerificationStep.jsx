import React, {useEffect, useState} from "react";
import axios from "axios";
import {
    Button, Group,
    LoadingOverlay, Stack, Text, Title
} from '@mantine/core';

export default function EmailVerificationStep() {
    const [ loading, setLoading ] = useState(false)
    const [ cooldown, setCooldown ] = useState(0)

    useEffect(() => {
        if (cooldown <= 0) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setCooldown((current) => {
                if (current <= 1) {
                    window.clearInterval(timer);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [cooldown]);

    const sendVerificationLink = () => {
        setLoading(true)
        axios.post('/email/verification')
            .then((res) => {
                setCooldown(60)
            })
            .catch(({message, response}) => {
                console.log(message, response)
                // setErrors(errors)
            })
            .finally(() => {
                setLoading(false)
            })
    }


    return (
        <Stack>
            <Title align="center">Email verification</Title>
            <Text c="dimmed">
                Your email has not been verified yet.
            </Text>

            <Text>
                If you haven't received a validation email please use the button below.
                We will send you a validation email.
                (And please also check your SPAM folder).
            </Text>

            <Group>
                <Button disabled={loading || cooldown > 0} onClick={sendVerificationLink}>
                    Send a verification link
                </Button>
                {cooldown > 0 && (
                    <Text c="dimmed">
                        Wait {cooldown} seconds before sending a new email
                    </Text>
                )}
            </Group>
            
            {loading && <LoadingOverlay visible={loading} overlayBlur={2} />}

        </Stack>
    );


}
