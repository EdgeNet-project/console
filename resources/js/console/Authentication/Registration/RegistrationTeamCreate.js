import {createStyles, rem, Select, TextInput, Stack, SimpleGrid} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import React from "react";

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
    },

    input: {
        height: rem(54),
        paddingTop: rem(18),
    },

    label: {
        position: 'absolute',
        pointerEvents: 'none',
        fontSize: theme.fontSizes.xs,
        paddingLeft: theme.spacing.sm,
        paddingTop: `calc(${theme.spacing.sm} / 2)`,
        zIndex: 1,
    },
}));

export default function RegistrationTeamCreate() {
    const { classes } = useStyles();

    return (
        <>
            <p>
                Create new Team by filling the information below, an administrator will review your application.

            </p>
        <Stack>

            <SimpleGrid cols={2} breakpoints={[{ maxWidth: 'sm', cols: 1 },]}>
                <TextInput label="Name" placeholder="" classNames={classes} />
                <TextInput label="Shortname" placeholder="" classNames={classes} />
            </SimpleGrid>
            <TextInput label="Address" placeholder="4 place Jussieu" classNames={classes} />
            <SimpleGrid cols={4} breakpoints={[{ maxWidth: 'sm', cols: 1 },]}>
                <TextInput label="Zipcode" placeholder="75004" classNames={classes} />
                <TextInput label="City" placeholder="Paris" classNames={classes} />
                <TextInput label="Region / State" placeholder="" classNames={classes} />
                <TextInput label="Country" placeholder="France" classNames={classes} />
            </SimpleGrid>
            <TextInput label="URL" placeholder="" classNames={classes} />

            {/*<Select*/}
            {/*    mt="md"*/}
            {/*    withinPortal*/}
            {/*    data={['React', 'Angular', 'Svelte', 'Vue']}*/}
            {/*    placeholder="Pick one"*/}
            {/*    label="Your favorite library/framework"*/}
            {/*    classNames={classes}*/}
            {/*/>*/}

            {/*<DatePickerInput*/}
            {/*    mt="md"*/}
            {/*    popoverProps={{ withinPortal: true }}*/}
            {/*    label="Departure date"*/}
            {/*    placeholder="When will you leave?"*/}
            {/*    classNames={classes}*/}
            {/*    clearable={false}*/}
            {/*/>*/}
        </Stack>
        </>
    );
}