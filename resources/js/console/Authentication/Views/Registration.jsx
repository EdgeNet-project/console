import React from 'react';
import {
    Title,
    Stepper,
    Group,
    Container, Image, Stack, Text, SimpleGrid, Grid
} from '@mantine/core';

import AUP from "../Registration/AUP";
import EmailVerificationStep from "../Registration/EmailVerificationStep";
import config from "../../../config.js";

export default function Registration({step = 1}) {

    return (
        <>
            <Stack align="center" justify="center" bg="#EBF2FC" py="sm">
                <div>
                    <Image src={config.logo.image}
                           alt={config.app.name}
                           h={config.logo.height}
                           w="auto"
                           fit="contain" />
                </div>
                <Text>
                    Welcome to the PlanetLab platform, please complete your registration.
                </Text>
            </Stack>
            <Grid>
                <Grid.Col span="auto" align="center" py="lg"
                          style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Stepper active={step} onStepClick={null} breakpoint="sm" orientation="vertical">
                        <Stepper.Step label="Verification" description="Verify your email" />
                        <Stepper.Step label="Terms of service" description="Review our policies" />
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
                </Grid.Col>
                <Grid.Col span={6} py="lg">
                    {step === 0 && <EmailVerificationStep />}
                    {step === 1 && <AUP />}
                </Grid.Col>
                <Grid.Col span="auto" py="lg"></Grid.Col>
            </Grid>
        </>
    );
}
