import {ActionIcon, Divider, Group, Stack, Title} from "@mantine/core";
import {IconHelp} from "@tabler/icons-react";
import {useState} from "react";

export default ({children, title, icon, buttons, help}) => {
    const [showHelp, setShowHelp] = useState(false)

    return (
        <Stack justify="space-between" p="md" style={{backgroundColor:'white', borderRadius:'5px'}}>
            <Stack>
                <Group justify="space-between">
                    <Group justify="flex-start">
                        {icon}
                        <Title order={2} size="h4">{title}</Title>
                    </Group>
                    <ActionIcon onClick={() => setShowHelp(!showHelp)} variant="subtle" aria-label="Settings">
                        <IconHelp style={{ width: '60%', height: '60%' }} stroke={1.5} />
                    </ActionIcon>
                </Group>
                {showHelp && help}
                {children}
            </Stack>
            <Stack>
                <Divider />
                <Group justify="flex-end">
                    {buttons}
                </Group>
            </Stack>
        </Stack>
    )
}