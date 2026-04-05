import React from "react";
import {Stack, Title} from "@mantine/core";
import UserRequestList from "./UserRequestList";
import PanelTitle from "../Components/PanelTitle.jsx";

export default () => {



    return (
    <>
        <PanelTitle title={["Requests"]} />
        <Stack>
            <UserRequestList />
        </Stack>
    </>
    )
}