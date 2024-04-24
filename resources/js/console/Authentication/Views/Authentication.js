import {
    SimpleGrid, Image, Container, Text, Group, Title,
} from '@mantine/core';
import {Outlet} from "react-router-dom";

export function Authentication() {

    return (
        <SimpleGrid cols={1} breakpoints={[
            { minWidth: 'sm', cols: 2, spacing: 0 },
        ]}>
            <div>
                <Group sx={{ height: '100%' }} spacing="sm" pb="xl" position="start">
                    <div><Image src="/images/edgenet-logo.png" alt="EdgeNet" height={60} fit="contain" /></div>
                    <Title order={1} weight={400}>EdgeNet</Title>
                </Group>
                <Outlet />
            </div>
            <div></div>
        </SimpleGrid>
    );
}

export default Authentication;