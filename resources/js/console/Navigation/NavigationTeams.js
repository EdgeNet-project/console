import React, {useEffect, useState} from "react";
import {ReactTree, useReactTreeApi} from '@naisutech/react-tree';
import {Divider, Text, UnstyledButton, Group, Anchor} from "@mantine/core";
import {
    IconSitemap as IconTeam, IconBoxPadding as IconWorkspace
} from "@tabler/icons-react";
import {IconPlus, IconMinus, IconUsersPlus} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import {useAuthentication} from "../Authentication";

const myThemes = {
        edgenetTeamsTheme: {
            text: {
                fontSize: 'sm',
                fontFamily: 'system-ui',
                color: 'black',
                selectedColor: 'black',
                hoverColor: 'black'
            },
            nodes: {
                height: '2.5rem',
                folder: {
                    bgColor: 'white',
                    selectedBgColor: '#f8f9fa',
                    hoverBgColor: '#f8f9fa'
                },
                leaf: {
                    bgColor: 'white',
                    selectedBgColor: '#f8f9fa',
                    hoverBgColor: '#f8f9fa'
                },
                separator: {
                    border: '1px solid',
                    borderColor: 'transparent'
                },
                icons: {
                    size: '14',
                    //folderColor: 'black',
                    //leafColor: 'blue'
                }
            }
        }
    }

const treeStyle = {
    padding: '0 10px'
}
const TreeIcon = ({
    node,
    type,
    selected = false,
    open = false,
    context
}) => {

    // console.log('TreeIcon', node,
    //     type,
    //     selected,
    //     open,
    //     context)

    // TODO: icon color represents access type (read only or admin)
    if (node.parentId === null) {
        return <IconTeam size={18} />;
    }

    if (node.items && node.items.length > 0) {
        return <IconUsersPlus color="blue" />
    }

    return <IconWorkspace size={18} color={node.member ? 'black' : 'gray'} />

}

const TreeNode = ({
                      node,
                      type,
                      selected = false,
                      open = false,
                      context
                  }) => {

    return (
            <Anchor component={Link} to={node.path}>
                <Text size="sm" ml="md" color={node.member ? 'black' : 'gray'}>{node.label}</Text>
            </Anchor>
    )
}

const NavigationTeams = () => {
    const [ open, setOpen ] = useState(false)
    const [ workspaces, setWorkspaces ] = useState([])
    const { user } = useAuthentication()
    const treeApi = useReactTreeApi()

    useEffect(() => {
        let workspacesData = [];
        user.teams.forEach(team => {

            workspacesData.push( {
                id: 'team-' + team.name,
                parentId: null,
                label: team.fullname,
                namespace: team.name,
                path: '/teams/' + team.name,

                member: true
            } )

            team.workspaces.forEach(workspace => {
                workspacesData.push( {
                    id: workspace.name + '-' + workspace.id,
                    parentId: 'team-' + team.name,
                    value: workspace.name + '-' + workspace.id,
                    label: workspace.name,
                    namespace: team.fullname,
                    path: '/workspaces/' + workspace.id,

                    member: user.workspaces.some(userWorkspace => userWorkspace.name === workspace.name)
                } )
            })

        })



        setWorkspaces(workspacesData)
    }, [])

    const handleToggleTree = () => {
        setOpen(!open)
        treeApi.current.toggleAllNodesOpenState(open ? 'close' : 'open')
    }

    return (
        <>
            <Divider label="Workspaces" mt="sm" />
            {workspaces.length > 0 ? <>
                <UnstyledButton onClick={handleToggleTree} px="md">
                    {open ? <Group spacing={4} align="center">
                        <IconMinus style={{marginBottom:2}} size={12} color="gray" />
                        <Text size="xs">Close all</Text>
                    </Group> : <Group spacing={4} align="center">
                        <IconPlus style={{marginBottom:2}} size={12} color="gray" />
                        <Text size="xs">Expand all</Text>
                    </Group>}
                </UnstyledButton>

                <ReactTree nodes={workspaces} ref={treeApi}
                           theme="edgenetTeamsTheme"
                           themes={myThemes}
                           containerStyles={treeStyle}
                           RenderIcon={TreeIcon}
                           RenderNode={TreeNode}
                />
            </> : <Text m="sm" size="xs">No workspaces</Text>}


        </>
    )
}

export default NavigationTeams;