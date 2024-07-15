import React from "react";
import {Stack, Title} from "@mantine/core";
import UserRequestList from "./UserRequestList";

export default () => {



    return (
    <>
        <Title order={1} my="lg">Requests</Title>
        <Stack>
            <UserRequestList />
        </Stack>
    </>
    )
}