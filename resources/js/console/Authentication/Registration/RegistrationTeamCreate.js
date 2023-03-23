import {createStyles, rem, Group, Radio, TextInput, Textarea, Grid, LoadingOverlay, Button} from '@mantine/core';
import axios from "axios";
import React, {useState} from "react";
import {useForm} from "@mantine/form";

const useStyles = createStyles((theme) => ({
    root: {
        position: 'relative',
    },

    input: {
        height: rem(54),
        paddingTop: rem(18),
    },

    textArea: {
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
    const [ loading, setLoading ] = useState(false)

    const form = useForm({
        initialValues: {
            fullname: '',
            shortname: '',
            affiliation: '',
            country: '',
            url: '',
            joining_reason: '',
            joining_category: '',
        },

        validate: {
            // email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        },
    });

    const createName = (text) => {

    }

    const handleSubmit = (values) => {
        setLoading(true)

        const name = form.values['shortname'].toLowerCase()
                .replace(/ /g,'')
                .replace(/[^\w-]+/g,'');

        axios.post('/api/requests/tenants', {
            name: name, ...values
        })
            .then((res) => {
                console.log(res)
                //setRegistered(true)
            })
            .catch(({message, response: {data: {errors}}}) => {
                // console.log(message)
                // setErrors(errors)
                form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    return (
        <>
            <LoadingOverlay visible={loading} overlayBlur={2} />
            <p>
                Create new Team by filling the information below, an administrator will review your application.
            </p>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Grid>
                    <Grid.Col md={8}>
                        <TextInput label="Name" placeholder="My Team Name" classNames={classes} withAsterisk
                                   {...form.getInputProps('fullname')} />
                    </Grid.Col>
                    <Grid.Col md={4}>
                        <TextInput label="Abbreviation" placeholder="MTN" classNames={classes} withAsterisk
                                   {...form.getInputProps('shortname')} />
                    </Grid.Col>
                    <Grid.Col md={8}>
                        <TextInput label="Affiliation" placeholder="Université Sorbonne" classNames={classes} withAsterisk
                                   {...form.getInputProps('affiliation')} />
                    </Grid.Col>
                    <Grid.Col md={4}>
                        <TextInput label="Country" placeholder="France" classNames={classes}
                                   {...form.getInputProps('country')} />
                    </Grid.Col>
                    <Grid.Col md={12}>
                        <TextInput label="URL" placeholder="https://www.sorbonne-universite.fr" classNames={classes} withAsterisk
                                   {...form.getInputProps('url')} />
                    </Grid.Col>
                    <Grid.Col md={12}>
                        <Textarea label="What is the reason for joining?" minRows={3} autosize placeholder="" classNames={classes} withAsterisk
                                  {...form.getInputProps('joining_reason')} />
                    </Grid.Col>
                    <Grid.Col md={8}>
                        <Radio.Group label="" classNames={classes} withAsterisk
                                     {...form.getInputProps('joining_category')} >
                            <Group mt="xs">
                                <Radio value="Research" label="Research" />
                                <Radio value="Teaching" label="Teaching" />
                                <Radio value="Other" label="Other" />
                            </Group>
                        </Radio.Group>
                    </Grid.Col>
                    <Grid.Col md={4}>
                        <Button disabled={loading} type="submit" fullWidth>
                            Submit
                        </Button>
                    </Grid.Col>
                </Grid>
            </form>
                {/*<TextInput label="Zipcode" placeholder="75004" classNames={classes} />*/}
                {/*<TextInput label="City" placeholder="Paris" classNames={classes} />*/}
                {/*<TextInput label="Region / State" placeholder="" classNames={classes} />*/}



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
        </>
    );
}