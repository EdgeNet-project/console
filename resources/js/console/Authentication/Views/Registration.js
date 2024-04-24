import React from 'react';
import {
    Title,
    Stepper,
    Group,
    Container, Image, Header
} from '@mantine/core';

import AUP from "../Registration/AUP";
import RegistrationTeam from "../Registration/RegistrationTeam";
import EmailVerificationStep from "../Registration/EmailVerificationStep";

export default function Registration({step = 1}) {

    return (
        <>
        <Header height={140}>
            <Container size="sm" sx={(theme) => ({ margin: '25px auto'})}>
                <Group sx={{ height: '100%' }} spacing="sm" pb="xl" position="start">
                    <div><Image src="/images/edgenet-logo.png" alt="EdgeNet" height={60} fit="contain" /></div>
                    <Title order={1} weight={400}>EdgeNet</Title>
                </Group>
                <div>
                    Welcome to the EdgeNet platform, please complete your registration.
                </div>
            </Container>
        </Header>

        <Container size="sm" sx={(theme) => ({ margin: '25px auto'})}>
            <Stepper active={step} onStepClick={null} breakpoint="sm">
                <Stepper.Step label="Verification" description="Verify your email">
                    <EmailVerificationStep />
                </Stepper.Step>
                <Stepper.Step label="Terms of service" description="Review our policies">
                    <AUP />
                </Stepper.Step>
                {/*<Stepper.Step label="Your Team" description="Join or create a Team">*/}
                {/*    <RegistrationTeam />*/}
                {/*</Stepper.Step>*/}
                {/*<Stepper.Completed>*/}
                {/*    Thank you for completing the registration. <br />*/}
                {/*    An admin will review your application as soon as possible. <br />*/}
                {/*    Once your account is enabled you will receive a confirmation email.*/}
                {/*    <br />*/}
                {/*    <br />*/}
                {/*    Best regards,<br />*/}
                {/*    The EdgeNet Team*/}
                {/*</Stepper.Completed>*/}
            </Stepper>
        </Container>
        </>
    );
}