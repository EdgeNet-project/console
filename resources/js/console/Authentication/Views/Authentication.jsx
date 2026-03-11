import {
    SimpleGrid, Image, Stack
} from '@mantine/core';
import {Outlet} from "react-router-dom";
import React from "react";

import config from "../../../config";

export function Authentication() {

    return (
        <SimpleGrid cols={{ base: 1, sm: 2 }} h="100dvh">
            <Stack align="center"
                   justify="center"
                   gap="sm">
                    <div>
                        <Image src={config.logo.image}
                               alt={config.app.name}
                               h={config.logo.height}
                               w="auto"
                               fit="contain" />
                    </div>
                    <Outlet />
            </Stack>
            <Stack align="center" justify="center" bg="#EEFFEE">
                <Image src="/images/platforms.png"
                       alt={config.app.name} w={500} />
            </Stack>
        </SimpleGrid>
    );
}

export default Authentication;