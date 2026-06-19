import {Breadcrumbs, Title} from "@mantine/core";
import React from "react";

export default ({title = []}) => {

    return (
        <Breadcrumbs separator="→" separatorMargin="sm" mb="md">
            {title.map((t,k) => <Title order={1} key={k} id={t} size="h4">{t}</Title>)}
        </Breadcrumbs>
    )
}