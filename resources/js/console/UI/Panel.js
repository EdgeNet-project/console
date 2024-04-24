import {
    Grid,
    Image,
    Container
} from '@mantine/core';

export default function Panel({children}) {


    return (
        <Grid grow>
            <Grid.Col span={2}>
                <Container size={400}>
                    <Image src="/images/edgenet.png" alt="EdgeNet" height={100} fit="contain" my="xl"/>
                    {children}
                </Container>
            </Grid.Col>
            <Grid.Col span={2} ></Grid.Col>
        </Grid>
    );
}