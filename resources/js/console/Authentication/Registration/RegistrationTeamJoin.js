import React, { useState, useEffect } from "react";
import axios from "axios";
import {Select, Anchor, Text, Space, Card, Button, Paper, Center} from "@mantine/core";
import {useAuthentication} from "../AuthenticationProvider";

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
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuthentication();

    useEffect(() => {
        axios.get('/api/tenants')
            .then(({data}) => {
                setTenants(data)
            })
    }, [])

    const handleSelect = (value) => {
        setSelectedTenant(tenants.find(tenant => tenant.name === value))
    }

    const handleRequest = () => {
        setLoading(true)
        axios.post('/api/requests/roles',
            {
                firstname: user.firstname,
                lastname: user.lastname,
                email: user.email,
                namespace: selectedTenant.name
            },
            {})
            .then(({data}) => {
                // console.log(data)
            })
            .finally(() => {
                setLoading(false)
            });
    }


    const data = tenants.map(d => { return { value: d.name, label: d.fullname } })

    return (
        <>
            <p>
                Please select a Team to start using EdgeNet, an administrator will review your application.
                <br />
                You can join more Teams once your first application has been approved.
            </p>
            <Select
                    data={data}
                    placeholder="EdgeNet Teams"
                    nothingFound="Nothing found"
                    searchable
                    clearable
                    onChange={handleSelect}
            />
            <Space h="md" />
            {selectedTenant &&
                <Paper px="xs">
                    {selectedTenant.fullname} ({selectedTenant.shortname}) <br />
                    <Anchor size="sm" target="_blank" href={selectedTenant.url}>{selectedTenant.url}</Anchor>
                        {selectedTenant.address && <Text fz="sm">
                        <TenantAddress address={selectedTenant.address} />
                    </Text>}
                    {/*<TenantContact contact={selectedTenant.contact} />*/}
                    <Center>
                        <Button my="sm" onClick={handleRequest} disabled={loading}>
                            Request to join Team
                        </Button>
                    </Center>
                </Paper>
              }

        </>
    )
}