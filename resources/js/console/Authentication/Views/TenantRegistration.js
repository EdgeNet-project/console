import { createStyles, rem, Select, TextInput, Stack } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

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

export function TenantRegistration() {
    // You can add these classes as classNames to any Mantine input, it will work the same
    const { classes } = useStyles();

    return (
        <Stack>

        <TextInput label="Name" placeholder="" classNames={classes} />
            <TextInput label="Shortname" placeholder="" classNames={classes} />
            <TextInput label="Address" placeholder="4 place Jussieu" classNames={classes} />
            <TextInput label="Zipcode" placeholder="75004" classNames={classes} />
            <TextInput label="City" placeholder="Paris" classNames={classes} />
            <TextInput label="Region" placeholder="" classNames={classes} />
            <TextInput label="Country" placeholder="France" classNames={classes} />
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
    );
}