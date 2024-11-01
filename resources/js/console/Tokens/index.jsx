import React, {useEffect, useState} from "react";
import {
    Table, ActionIcon
} from "@mantine/core";

import axios from "axios";
import {IconKey, IconTrash} from "@tabler/icons-react";
import Panel from "../Components/Panel";
import dayjs from "dayjs";
import {CreateTokenButton} from "./CreateToken";
import TokensHelp from "./TokensHelp";
import DeleteToken from "./DeleteToken";





export default () => {
    const [ tokens, setTokens ] = useState([])
    const [ deleteToken, setDeleteToken ] = useState(null)

    useEffect(() => {
        if (!deleteToken) {
            refreshTokens()
        }
    }, [deleteToken])

    const refreshTokens = () => {
        axios.get('/api/tokens')
        .then(({data}) => {
            setTokens(data);
        })
        .catch(error => {
            console.log(error)
        });
    }

    return (
        <>
        {deleteToken && <DeleteToken token={deleteToken}
                                     onClose={() => setDeleteToken(null)} />}

            <Panel title="Access tokens"
                   icon={<IconKey />}
                   help={<TokensHelp />}
                   buttons={[
                       <CreateTokenButton key="create_token" />
                   ]}>

                <Table verticalSpacing="sm">
                    <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Abilities</Table.Th>
                        <Table.Th>Created</Table.Th>
                        <Table.Th>Expires</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                    {tokens.map((token) => <Table.Tr key={token.id}>
                        <Table.Td>{token.name}</Table.Td>
                        <Table.Td>{token.abilities}</Table.Td>
                        <Table.Td>{dayjs(token.created_at).format('DD/MM/YYYY HH:mm')}</Table.Td>
                        <Table.Td>{token.expires_at && dayjs(token.expires_at).format('DD/MM/YYYY HH:mm')}</Table.Td>
                        <Table.Td>
                            <ActionIcon variant="outline" color="red" onClick={() => setDeleteToken(token)}>
                                <IconTrash size="0.8rem" />
                            </ActionIcon>
                        </Table.Td>
                    </Table.Tr>)}
                    </Table.Tbody>
                </Table>

            </Panel>

        </>

    );
}