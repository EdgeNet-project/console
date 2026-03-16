import {ActionIcon, Text, Image, Stack, Table} from "@mantine/core";
import React from "react";
import {GithubIcon} from "@mantinex/dev-icons";
import dayjs from "dayjs";
import {IconTrash} from "@tabler/icons-react";


const slicesFields = [
    'affiliation', 'organization', 'preferred_username',
    'auth_time', 'created_at', 'exp', 'iat', 'iss',
];

const SlicesRI = ({slices_info}) => {
    return (
        <Stack>
            <Text>
                External authentication services connected to your account.
            </Text>
            <Table verticalSpacing="sm">
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Service</Table.Th>
                        <Table.Th>Abilities</Table.Th>
                        <Table.Th>Created</Table.Th>
                        <Table.Th>Expires</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>

                    {slices_info.map((info, i) => <Table.Tr key={"slices-" + i}>
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

                    {user.slices_info && <Table.Tr>
                        <Table.Td>
                            <Image h={16} src="/images/slices/slices-ri-black-color.png" />
                        </Table.Td>

                    </Table.Tr>}
                    {user.github_id && <Table.Tr>
                        <Table.Td>
                            <GithubIcon size={16} /> GitHub
                        </Table.Td>
                    </Table.Tr>
                    }

                </Table.Tbody>
            </Table>
        </Stack>

    )
}

export default UserOAuth;