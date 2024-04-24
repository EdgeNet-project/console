import React, {useState} from "react";
import {
    UnstyledButton,
    Text,
    SimpleGrid, Radio, Divider
} from '@mantine/core';
import {IconUsers, IconSquarePlus} from "@tabler/icons";

import RegistrationTeamJoin from "./RegistrationTeamJoin";
import RegistrationTeamCreate from "./RegistrationTeamCreate";

function RegistrationTeamOption({ value, checked, handleChange, title, description, icon}) {

    return (
        <UnstyledButton onClick={() => handleChange(value)} >
            {icon}
            <div>
                <Text weight={500} size="sm" sx={{ lineHeight: 1 }}>
                    {title}
                </Text>
                <Text color="dimmed" size="xs" sx={{ lineHeight: 1 }} mb={5}>
                    {description}
                </Text>
            </div>

            <Radio value={value} tabIndex={-1}
                // styles={{ input: { cursor: 'pointer' } }}
            />
        </UnstyledButton>
    );
}

export default function RegistrationTeam() {
    const [join, setJoin] = useState('tenant');

    return (
        <>
            <p>
                To start using EdgeNet you have to join a Workspace or create new one.
            </p>
            <Radio.Group
                name="tenant"
                label=""
                description=""
                value={join}
                onChange={setJoin}
            >
                <SimpleGrid
                    cols={2}
                    breakpoints={[
                        { maxWidth: 'md', cols: 2 },
                        { maxWidth: 'sm', cols: 1 },
                    ]}>
                    <RegistrationTeamOption value="tenant"
                                            checked={join == 'tenant'}
                                            handleChange={setJoin}
                                            title="Join a Workspace"
                                            description="Choose an existing Workspace"
                                            icon={<IconUsers />}/>
                    <RegistrationTeamOption value="create"
                                            checked={join == 'create'}
                                            handleChange={setJoin}
                                            title="Create a Team"
                                            description="Create a new Team"
                                            icon={<IconSquarePlus />} />
                </SimpleGrid>
            </Radio.Group>
            <Divider my="lg" />
            {
                join === 'tenant'
                    ? <RegistrationTeamJoin />
                    : <RegistrationTeamCreate />
            }
        </>
    );
}