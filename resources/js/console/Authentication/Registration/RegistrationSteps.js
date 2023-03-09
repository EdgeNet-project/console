import React, { useState } from 'react';
import { Title, Stepper, Button, Group, Container, Radio } from '@mantine/core';
import NavigationHeader from "../../Application/NavigationHeader";
import TenantSelect from "../Views/TenantSelect";
import AUP from "./AUP";
import {TenantRegistration} from "../Views/TenantRegistration";

export default function RegistrationSteps({initialStep = 0}) {
    const [active, setActive] = useState(initialStep);
    const [join, setJoin] = useState('tenant');

    const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
    const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));

    return (
        <>
        <NavigationHeader />
        <Container size="sm" px="xs" sx={(theme) => ({ margin: '25px auto'})}>
            <Title>Welcome to EdgeNet</Title>
            <div>
                Please complete your registration
            </div>
        </Container>
        <Container size="sm" px="xs">
            <Stepper active={active} onStepClick={setActive} breakpoint="sm">
                <Stepper.Step label="Verification" description="Verify your email">
                    Verify email
                </Stepper.Step>
                <Stepper.Step label="Terms of service" description="">
                    <AUP />
                </Stepper.Step>
                <Stepper.Step label="Your Team" description="Select or create a Team">
                    <Radio.Group
                        name="tenant"
                        label="Select your favorite framework/library"
                        description="This is anonymous"
                        value={join}
                        onChange={setJoin}
                    >
                        <Group mt="xs">
                            <Radio value="tenant" label="Join a Tenant (?)" />
                            <Radio value="subnamespace" label="Join a Subnamespace (?)" />
                            <Radio value="create" label="Create a new Tenant (?)" />
                        </Group>
                    </Radio.Group>
                    <br/>
                    {join === 'tenant' && <TenantSelect />}
                    {join === 'subnamespace' && <div>Select a subnamespace: should be Class/Workshop etc.</div>}
                    {join === 'create' && <TenantRegistration />}
                </Stepper.Step>
                <Stepper.Step label="Welcome!" description="Get full access">
                    Welcome!
                </Stepper.Step>
                <Stepper.Completed>
                    Completed
                </Stepper.Completed>
            </Stepper>

            <Group position="center" mt="xl">
                <Button variant="default" onClick={prevStep}>Back</Button>
                <Button onClick={nextStep}>Next step</Button>
            </Group>
        </Container>
        </>
    );
}