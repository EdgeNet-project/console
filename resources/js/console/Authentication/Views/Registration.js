import React, { useState } from 'react';
import {
    Title,
    Stepper,
    Button,
    Group,
    Container, Image, Header
} from '@mantine/core';

import AUP from "../Registration/AUP";
import RegistrationTeam from "../Registration/RegistrationTeam";

export default function Registration({step = 1}) {


    return (
        <>
        <Header>
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
                    Verify email
                </Stepper.Step>
                <Stepper.Step label="Terms of service" description="Review our policies">
                    <AUP />
                </Stepper.Step>
                <Stepper.Step label="Your Team" description="Join or create a Team">
                    <RegistrationTeam />
                </Stepper.Step>
                {/*<Stepper.Step label="Welcome!" description="Get full access">*/}
                {/*    Welcome!*/}
                {/*</Stepper.Step>*/}
                <Stepper.Completed>
                    Completed
                </Stepper.Completed>
            </Stepper>

            {/*<Group position="center" mt="xl">*/}
            {/*    <Button variant="default" onClick={prevStep}>Back</Button>*/}
            {/*    <Button onClick={nextStep}>Next step</Button>*/}
            {/*</Group>*/}
        </Container>
        </>
    );
}