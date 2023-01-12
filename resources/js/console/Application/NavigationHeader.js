import {Group, Header, Image, Text} from "@mantine/core";

export default function NavigationHeader() {

    return (
        <Header height={60}>
            <Group sx={{ height: '100%' }} spacing="sm" px={20} position="start">
                {/*<Logo colorScheme={null} />*/}
                <div><Image src="/images/edgenet-logo.png" alt="EdgeNet" height={28} fit="contain" /></div>
                <Text fw={500} fz="lg">EdgeNet</Text>
                {/*<ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>*/}
                {/*    {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoonStars size={16} />}*/}
                {/*</ActionIcon>*/}
            </Group>
        </Header>
    )
}