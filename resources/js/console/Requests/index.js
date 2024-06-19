import React from "react";
import {Stack, Title} from "@mantine/core";
import UserRequestList from "./UserRequestList";
import OwnRequestList from "./OwnRequestList";

export default () => {



    return (
    <>
        <Title order={1} my="lg">Requests</Title>
        <Stack>
            <OwnRequestList />
            <UserRequestList />
        </Stack>
    </>
    )
}