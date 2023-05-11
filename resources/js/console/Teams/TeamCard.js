import {Anchor, Paper, Text} from "@mantine/core";
import React from "react";

export default ({team}) => {

    return (
        <Paper shadow="xs" p="md">
            <Text fz="xl">{team.fullname}</Text>
            <Anchor size="xs" href={team.url}>{team.url}</Anchor> <br />
            {/*<Text>Namespace: {team.name}</Text>*/}
        </Paper>
    )
}