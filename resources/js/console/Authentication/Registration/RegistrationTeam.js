import React, {useState} from "react";
import {
    UnstyledButton,
    Text,
    SimpleGrid,
    createStyles,
    rem, Radio, Divider
} from '@mantine/core';
import {IconUsers, IconSquarePlus} from "@tabler/icons";

import RegistrationTeamJoin from "./RegistrationTeamJoin";
import RegistrationTeamCreate from "./RegistrationTeamCreate";

const useStyles = createStyles((theme, { checked }) => ({
    button: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        transition: 'background-color 150ms ease, border-color 150ms ease',
        border: `${rem(1)} solid ${
            checked
                ? theme.fn.variant({ variant: 'outline', color: theme.primaryColor }).border
                : theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[3]
        }`,
        borderRadius: theme.radius.sm,
        padding: theme.spacing.sm,
        backgroundColor: checked
            ? theme.fn.variant({ variant: 'light', color: theme.primaryColor }).background
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.white,
    },

    body: {
        flex: 1,
        marginLeft: theme.spacing.md,
    },
}));
//
// interface ImageCheckboxProps {
//     checked?: boolean;
//     defaultChecked?: boolean;
//     onChange?(checked: boolean): void;
//     title: string;
//     description: string;
//     image: string;
// }

function RegistrationTeamOption({ value, checked, handleChange, title, description, icon}) {
    const { classes, cx } = useStyles({ checked: checked });

    return (
        <UnstyledButton
            onClick={() => handleChange(value)}
            className={classes.button}>
            {icon}
            <div className={classes.body}>
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
                To start using EdgeNet you have to join a Team or create new one.
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
                                            title="Join a Team"
                                            description="Choose an existing Team"
                                            icon={<IconUsers />}/>
                    <RegistrationTeamOption value="create"
                                            checked={join == 'create'}
                                            handleChange={setJoin}
                                            title="Create a new Team"
                                            description="Xyz"
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