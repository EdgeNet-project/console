import React, { useState } from "react";
import {ReactTree, useReactTreeApi} from '@naisutech/react-tree';
import {Divider, Text, ThemeIcon, UnstyledButton, Group, Box, Anchor} from "@mantine/core";
import {
    IconArrowRight,
    IconBuilding, IconUsers as IconTeam, IconBoxPadding as IconWorkspace
} from "@tabler/icons";
import {IconPlus, IconMinus, IconUsersPlus} from "@tabler/icons-react";
import {Link} from "react-router-dom";
import CreateTeam from "../Teams/CreateTeam";
import JoinWorkspaceDialog from "../Workspace/JoinWorkspaceDialog";

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

    console.log('TreeIcon', node,
        type,
        selected,
        open,
        context)


    // TODO: icon color represents access type (read only or admin)
    if (node.parentId === null) {
        return <IconWorkspace />;
    }

    if (node.items && node.items.length > 0) {
        return <IconUsersPlus color="blue" />
    }

    return <IconWorkspace color="blue" />
    // return (
    //     <ThemeIcon color="blue" variant="light">
    //         <IconUsers size={16} />
    //     </ThemeIcon>
    // )
}

const TreeNode = ({
                      node,
                      type,
                      selected = false,
                      open = false,
                      context
                  }) => {

    return (
            <Anchor component={Link}
                to={'/team/' + node.id}><Text size="sm" ml="md">{node.label}</Text></Anchor>
    )
}

const NavigationTeams = () => {
    const [ open, setOpen ] = useState(false)
    const treeApi = useReactTreeApi()

    const data = [
        {
            "id": 'sorbonne',
            "parentId": null,
            "label": "Sorbonne",

        },
        {
            "id": 'networking-class',
            "label": "Networking Class",
            "parentId": 'sorbonne',
            items: [

            ]
        },
        {
            "id": 'team-a',
            "parentId": 'networking-class',
            "label": "Team A"
        },
        {
            "id": 'team-b',
            "parentId": 'networking-class',
            "label": "Team B"
        },
        {
            "id": 'research-lab',
            "parentId": 'sorbonne',
            "label": "Research Lab"
        },
        {
            "id": 'measurement-lab',
            "parentId": 'sorbonne',
            "label": "Measurements Lab"
        }


    ]

    const handleToggleTree = () => {
        setOpen(!open)
        treeApi.current.toggleAllNodesOpenState(open ? 'close' : 'open')
    }

    return (
        <>
            <Divider label="Workspaces" />

            <UnstyledButton onClick={handleToggleTree} px="md">
                {open ? <Group spacing={4} align="center">
                    <IconMinus style={{marginBottom:2}} size={12} color="gray" />
                    <Text size="xs">Close all</Text>
                </Group> : <Group spacing={4} align="center">
                    <IconPlus style={{marginBottom:2}} size={12} color="gray" />
                    <Text size="xs">Expand all</Text>
                </Group>}
            </UnstyledButton>

            <ReactTree nodes={data} ref={treeApi}
                       theme="edgenetTeamsTheme"
                       themes={myThemes}
                       containerStyles={treeStyle}
                       RenderIcon={TreeIcon}
                       RenderNode={TreeNode}
            />
            <JoinWorkspaceDialog />
        </>
    )
}

export default NavigationTeams;