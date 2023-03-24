import {Group, Header, Image, Text, Select} from "@mantine/core";
import {useAuthentication} from "../Authentication";
import {useWorkspace} from "./Workspace";

const NavigationNamespaceSelect = () => {
    const { user } = useAuthentication()
    const { namespace, setNamespace } = useWorkspace()

    return (
        <Group spacing="sm" position="start">
            <Text size="sm">Your current workspace:</Text>
            <Select
                onChange={(value) => setNamespace(value)}
                value={namespace}
                data={user.tenants.map(tenant => {
                    return {label: tenant.fullname, value: tenant.name}
                })}
            />
        </Group>

    )
}
export default function NavigationHeader() {

    return (
        <Header height={60}>
            <Group sx={{ height: '100%' }} spacing="sm" px={20} position="apart">
                {/*<Logo colorScheme={null} />*/}
                <Group spacing="sm" position="start">
                    <div><Image src="/images/edgenet-logo.png" alt="EdgeNet" height={28} fit="contain" /></div>
                    <Text fw={500} fz="lg">EdgeNet</Text>
                </Group>

                {/*<ActionIcon variant="default" onClick={() => toggleColorScheme()} size={30}>*/}
                {/*    {colorScheme === 'dark' ? <IconSun size={16} /> : <IconMoonStars size={16} />}*/}
                {/*</ActionIcon>*/}
                <NavigationNamespaceSelect />
            </Group>
        </Header>
    )
}