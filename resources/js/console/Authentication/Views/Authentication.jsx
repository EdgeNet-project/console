import {
    SimpleGrid, Image, Container, Text, Group, Title,
} from '@mantine/core';
import {Outlet} from "react-router-dom";

const style = {
    display: 'flex',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
    height:'100vh'
};

export function Authentication() {

    return (
        <SimpleGrid cols={2}>
            <div style={style}>
                <Group sx={{ height: '100%' }} spacing="sm" pb="xl" position="start">
                    <div><Image src="/images/edgenet-logo.png" alt="EdgeNet" height={60} fit="contain" /></div>
                    <Title order={1} weight={400}>EdgeNet</Title>
                </Group>
                <div style={{width:'50%'}}>
                    <Outlet />
                </div>
            </div>
            <div style={style}>
                <img style={{width:'90%'}} src="/images/platforms.png" alt="EdgeNet" />
            </div>
        </SimpleGrid>
    );
}

export default Authentication;