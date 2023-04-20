import React, { useState, useEffect } from "react";
import axios from "axios";
import {Select, Anchor, Text, Space, Card, Button, Paper, Center, Group, Stack} from "@mantine/core";
import {useAuthentication} from "../AuthenticationProvider";
import WorkspaceSelect from "../../Workspace/WorkspaceSelect";
import {useForm} from "@mantine/form";

const TenantAddress = ({address}) => {
    return (
        <>
            {address.street} <br />
            {address.zip} {address.city} <br />
            {address.region} {address.country}
        </>
    )
}

const TenantContact = ({contact}) =>
    <>
        {contact.firstname} {contact.lastname} <br />
        <Anchor href={"mailto:" + contact.email}>{contact.email}</Anchor> <br />
        {contact.phone}
    </>;

export default function RegistrationTeamJoin({handleTenant}) {
    // const [tenants, setTenants] = useState([]);
    // const [selectedTenant, setSelectedTenant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [ error, setError ] = useState()
    const [ success, setSuccess ] = useState(false)
    const { user } = useAuthentication();

    const form = useForm({
        initialValues: {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            namespace: '',
        },
    });

    const selectWorkspace = (workspace) => {
        console.log(workspace)
        form.setFieldValue('namespace', workspace.namespace)
    }

    //
    // useEffect(() => {
    //     axios.get('/api/tenants')
    //         .then(({data}) => {
    //             setTenants(data)
    //         })
    // }, [])

    // const handleSelect = (value) => {
    //     setSelectedTenant(tenants.find(tenant => tenant.name === value))
    // }

    const handleSubmit = (values) => {
        setLoading(true)

        axios.post('/api/requests/roles', {
            name: name, ...values
        })
            .then((res) => {
                console.log(res)
                //setRegistered(true)
            })
            .catch(({ response: {data: {message, errors}}}) => {
                // console.log(message)
                setError(message)
                form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)
            })
    }


    // const data = tenants.map(d => { return { value: d.name, label: d.fullname } })

    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack spacing="md">
                    <Text>
                        Please select a Workspace to start using EdgeNet, an administrator will review your application.
                        <br />
                        You can join more Workspaces once your first application has been approved.
                    </Text>
                    <WorkspaceSelect withinPortal onChange={selectWorkspace} />

                    {error && <Text color="red">{error}</Text>}
                    <Group position="center">

                        <Button disabled={loading} type="submit">
                            Submit request
                        </Button>
                    </Group>

                </Stack>
            </form>
            {/*<Select*/}
            {/*        data={data}*/}
            {/*        placeholder="EdgeNet Workspaces"*/}
            {/*        nothingFound="Nothing found"*/}
            {/*        searchable*/}
            {/*        clearable*/}
            {/*        onChange={handleSelect}*/}
            {/*/>*/}
            {/*<Space h="md" />*/}
            {/*{selectedTenant &&*/}
            {/*    <Paper px="xs">*/}
            {/*        {selectedTenant.fullname} ({selectedTenant.shortname}) <br />*/}
            {/*        <Anchor size="sm" target="_blank" href={selectedTenant.url}>{selectedTenant.url}</Anchor>*/}
            {/*            {selectedTenant.address && <Text fz="sm">*/}
            {/*            <TenantAddress address={selectedTenant.address} />*/}
            {/*        </Text>}*/}
            {/*        /!*<TenantContact contact={selectedTenant.contact} />*!/*/}
            {/*        <Center>*/}
            {/*            <Button my="sm" onClick={handleRequest} disabled={loading}>*/}
            {/*                Request to join Team*/}
            {/*            </Button>*/}
            {/*        </Center>*/}
            {/*    </Paper>*/}
            {/*  }*/}

        </>
    )
}