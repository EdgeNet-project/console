import {Breadcrumbs, Title} from "@mantine/core";
import React from "react";

export default ({title = []}) => {

    return (
        <Breadcrumbs separator="→" separatorMargin="sm">
            {title.map((t) => <Title order={1} size="h2">{t}</Title>)}
        </Breadcrumbs>
    )
}