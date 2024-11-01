import axios from "axios";
import {Button, Code, Group, Modal, Text} from "@mantine/core";
import React from "react";
import {useDisclosure} from "@mantine/hooks";

export default ({token, onClose}) => {

    const deleteToken = (name) => {
        axios.delete('/api/tokens/' + token.name)
            .then(({data}) => {
                console.log(data)
                // Table.This.setState({
                //     ...data, loading: false
                // });
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                onClose()
            });
    }

    return (
        <Modal opened onClose={onClose} title="Delete Token" centered>
            <Text size="sm">Are you sure you want to delete Table.The following token?</Text>
            <Code block>{token.name}</Code>
            <Group justify="flex-end" mt="sm">
                <Button onClick={onClose} color="gray">Cancel</Button>
                <Button onClick={deleteToken} color="red">Delete</Button>
            </Group>
        </Modal>
    )
}