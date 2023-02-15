import React, { useState, useEffect } from "react";
import axios from "axios";
import {Select, Anchor, Text, Space, Card, Button} from "@mantine/core";

const Address = ({address}) => {

    return (
        <>
            {address.street} <br />
            {address.zip} {address.city} <br />
            {address.region} {address.country}
        </>
    )
}

const Contact = ({contact}) =>
    <>
        {contact.firstname} {contact.lastname} <br />
        <Anchor href={"mailto:" + contact.email}>{contact.email}</Anchor> <br />
        {contact.phone}
    </>;

const Tenant = ({tenant}) => {


    return (
        <>
            {tenant.fullname} ({tenant.shortname}) <br />
            <Anchor size="sm" target="_blank">{tenant.url}</Anchor>
        </>
    )
}

export default function TenantSelect({handleTenant}) {
    const [tenants, setTenants] = useState([]);
    const [selectedTenant, setSelectedTenant] = useState(null);

    useEffect(() => {
        axios.get('/api/tenants')
            .then(({data}) => {
                setTenants(data)
            })
    }, [])

    const handleSelect = (value) => {
        setSelectedTenant(tenants.find(tenant => tenant.name === value))
    }

    console.log(selectedTenant)

    const data = tenants.map(d => { return { value: d.name, label: d.fullname } })

    return (
        <>
            <p>
                To run experiments on EdgeNet, you need an account linked to an institution.
                If your institution is not present please create one, EdgeNet administrator will review your application.
            </p>
            <Select label="Select your institution or create e new one"
                    data={data}
                    placeholder="EdgeNet institutions"
                    nothingFound="Nothing found"
                    searchable
                    creatable
                    clearable
                    onChange={handleSelect}
                    getCreateLabel={(query) => `+ Create ${query}`}
                    onCreate={(query) => {
                        const item = { value: query, label: query };
                        setTenants((current) => [...current, item]);
                        return item;
                    }}
            />
            <Space h="md" />
            {selectedTenant && <Card shadow="sm" p="lg" radius="md" withBorder>
                <Card.Section withBorder inheritPadding py="xs">
                    <Tenant tenant={selectedTenant} />
                    <Space h="xs" />
                    <Text fz="sm">
                        <Address address={selectedTenant.address} />
                    </Text>
                    {/*<Contact contact={selectedTenant.contact} />*/}
                </Card.Section>
                <Button variant="light" color="blue" fullWidth mt="md" radius="md">
                    Request to join institution
                </Button>
            </Card>}

        </>
    )
}