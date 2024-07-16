import React, {useEffect, useState} from "react";
import {Tree, useTree} from '@mantine/core';
import {Divider, Text, UnstyledButton, Group} from "@mantine/core";
import {
    IconSitemap as IconTeam, IconBoxPadding as IconWorkspace,
    IconPlus, IconMinus, IconChevronRight
} from "@tabler/icons-react";
import {useAuthentication} from "../Authentication";
import NavigationLink from "./NavigationLink";


const TreeNode = ({ node, expanded, hasChildren, elementProps }) => {

    return (
        <div {...elementProps}>
            <NavigationLink to={node.value}
                            label={<Text size="sm" c={node.member ? 'black' : 'dimmed'}>{node.label}</Text>}
                            icon={node.type === 'team' ? <IconTeam size="1rem" stroke={1.5}/> : <IconWorkspace color={node.member ? 'black' : 'gray'} size="1rem" stroke={1.5}/>}
                            rightSection={hasChildren && <IconChevronRight size={18}
                                                            style={{transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)'}}/>}
            />
        </div>
    )
}

const NavigationTeams = () => {
    const tree = useTree()
    const [open, setOpen] = useState(false)
    const [data, setData] = useState([])
    const {user} = useAuthentication()

    useEffect(() => {

        if (user.teams.length >= 0) {

            setData(
                user.teams.map(team => {
                    return {
                        label: team.fullname,
                        value: '/teams/' + team.name,
                        type: 'team',
                        member: true,
                        children: team.workspaces.map(workspace => {
                            return {
                                label: workspace.name,
                                value: '/workspaces/' + workspace.id,
                                type: 'workspace',
                                member: user.workspaces.some(userWorkspace => userWorkspace.name === workspace.name)
                            }
                        })
                    }
                })
            );
        }

        return () => setData([]);

    }, [user.teams]);

    const handleToggleTree = () => {
        setOpen(!open)
        open ? tree.collapseAllNodes() : tree.expandAllNodes()
    }

    return (
        <>
            <Divider label="Workspaces" mt="sm" />


            {data.length > 0 ? <>
                <UnstyledButton onClick={handleToggleTree} px="md">
                    {open ? <Group spacing={4} align="center">
                        <IconMinus style={{marginBottom:2}} size={12} color="gray" />
                        <Text size="xs">Close all</Text>
                    </Group> : <Group spacing={4} align="center">
                        <IconPlus style={{marginBottom:2}} size={12} color="gray" />
                        <Text size="xs">Expand all</Text>
                    </Group>}
                </UnstyledButton>
                <Tree data={data} tree={tree} renderNode={TreeNode} />
            </> : <Text m="sm" size="xs">No workspaces</Text>}

        </>
    )
}

export default NavigationTeams;