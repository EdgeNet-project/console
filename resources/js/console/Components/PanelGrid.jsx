import {SimpleGrid, Stack} from "@mantine/core";
import React from "react";
import {useMediaQuery} from "@mantine/hooks";

export default ({children}) => {
    const medium = useMediaQuery('(min-width: 801px)');
    const large = useMediaQuery('(min-width: 1600px)');

    return (
        <SimpleGrid py="xl" cols={medium ? large ? 3 : 2 : 1}>
            <Stack>
                {children.filter((((panel, i) => i % 2 === 0)))}
            </Stack>
            <Stack>
                {children.filter((((panel, i) => i % 2 === 1)))}
            </Stack>
        </SimpleGrid>
    )
}