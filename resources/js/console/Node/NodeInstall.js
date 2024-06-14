import {IconDownload, IconInfoCircle, IconTerminal2} from "@tabler/icons";
import {Alert, Button, Code, Container, Divider, Group, Paper, Select, Stack, Text, Title} from "@mantine/core";
import { CopyButton, ActionIcon, Tooltip, rem } from '@mantine/core';
import {IconCopy, IconCheck, IconDeviceUsb} from '@tabler/icons-react';

export default ({node}) => {


    const cmd = "curl -s " + node.installation_url + " | bash";

    return (

        <>
            <Stack gap="md">

                <Stack my="lg">
                    <Group justify="space-between">
                        <Title order={1}>Node installation</Title>
                    </Group>
                    <Text>

                    </Text>
                </Stack>



                <Paper shadow="xs" p="md">
                    <Stack>
                        <Group justify="flex-start">
                            <IconTerminal2 />
                            <Text size="sm">Install from terminal</Text>
                        </Group>
                        <Text my="md">
                            Your node is already installed and you have access to a shell
                            (SSH or console) as root or with sudo privileges.
                            <br />
                            You can execute this command directly on your node:
                        </Text>
                        <Code block>
                            <Group justify="space-between" align="center">
                                {cmd}
                                <CopyButton value={cmd} timeout={2000}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? 'Copied' : 'Copy'} withArrow position="right">
                                            <ActionIcon color={copied ? 'teal' : 'gray'} variant="subtle" onClick={copy}>
                                                {copied ? (
                                                    <IconCheck style={{ width: rem(16) }} />
                                                ) : (
                                                    <IconCopy style={{ width: rem(16) }} />
                                                )}
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </Group>

                        </Code>
                    </Stack>
                </Paper>

                <Paper shadow="xs" p="md">
                    <Stack>
                        <Group justify="flex-start">
                            <IconDeviceUsb />
                            <Text size="sm">Install from USB stick</Text>
                        </Group>
                        <Text my="md">
                            Your node is not installed and you have access to the machine and can
                            boot it with a USB key to start the installation .
                            <br />
                            You can download the following image and use it for the setup of the node:
                        </Text>
                        <Group>
                            <Button rightSection={<IconDownload size={14} />}>Download</Button>
                        </Group>
                        <Alert icon={<IconInfoCircle size="1rem"/>} title="Start the node installation" my="md" color="blue">
                            Please use a tool like Balena Etcher etc. to write this image to a USB key.
                        </Alert>
                    </Stack>
                </Paper>
            </Stack>
        </>


    )
}