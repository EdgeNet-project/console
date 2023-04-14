import React, {useState, useEffect, forwardRef} from "react";
import axios from "axios";
import {Select, Anchor, Text, Space, Card, Button, Paper, Center, Group, Stack} from "@mantine/core";

const SelectItem = forwardRef(
    ({ image = null, label, namespace, details = null, ...others }, ref) => (
        <div ref={ref} {...others}>
            <Group noWrap>
                {/*<Avatar src={image} />*/}

                <div>
                    <Text size="xs" opacity={0.65}>{namespace}</Text>
                    <Text size="sm">{label}</Text>
                    {details && <Text size="xs" opacity={0.65} color="blue">
                        {details}
                    </Text>}
                </div>
            </Group>
        </div>
    )
);

export default function WorkspaceSelect({onChange, ...props}) {
    const [workspaces, setWorkspaces] = useState([]);
    const [selected, setSelected] = useState(null);
    // const [loading, setLoading] = useState(false);

    const handleSelect = (value) => {
        console.log(value)
        setSelected(workspaces.find(tenant => tenant.name === value))
    }

    useEffect(() => {
        axios.get('/api/tenants')
            .then(({data}) => {
                let workspacesData = [];
                data.forEach(tenant => {

                    workspacesData.push( {
                        value: tenant.id,
                        label: tenant.fullname + ' (' + tenant.shortname + ')',
                        namespace: tenant.name,
                        description: 'hello'
                    } )

                    if (tenant.subnamespaces.length > 0) {
                        tenant.subnamespaces.forEach(subnamespace => {
                            workspacesData.push( {
                                value: subnamespace.name + '-' + subnamespace.id,
                                label: subnamespace.name,
                                namespace: tenant.fullname,
                                description: 'hi'
                            } )
                        })

                    }
                })

                setWorkspaces(workspacesData)
            })
    }, [])

    // const handleSelect = (value) => {
    //     setSelectedTenant(tenants.find(tenant => tenant.name === value))
    // }

    // const data =

    return (
        <Stack>
            <Select
                data={workspaces}
                // inputContainer={(children) => {
                //     console.log(children)
                //     return <div>{children}</div>
                // }}
                itemComponent={SelectItem}
                placeholder="EdgeNet Workspaces"
                nothingFound="Nothing found"
                searchable
                clearable
                onChange={handleSelect}
                {...props}
            />
            {selected &&
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
        </Stack>
    )
}