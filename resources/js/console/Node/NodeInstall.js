import {IconDownload, IconInfoCircle} from "@tabler/icons";
import {Alert, Button, Code, Container, Divider, Group, Select, Text, Title} from "@mantine/core";
import { CopyButton, ActionIcon, Tooltip, rem } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

export default ({node}) => {


    const cmd = "curl -s " + node.installation_url + " | bash";

    return (

        <Container>
            <Title order={1}>Node installation</Title>

            <Text my="md">
                Your node is already installed and you have access to a shell (SSH or console) as root or with sudo provileges.
               <br />
               You can execute this command directly on your node:
            </Text>

            <Code block>
                <Group justify="flex-end" align="start">
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
                {cmd}
            </Code>
            <Alert icon={<IconInfoCircle size="1rem"/>} title="Start the node installation" my="md" color="blue">
                Additional information...
            </Alert>

            <Divider my="md" />

            <Text my="md">
                Your node is not installed and you have access to the machine and can boot it with a USB key to start the installation .
                <br />
                You can download the following image and use it for the setup of the node:
            </Text>

            <Button rightSection={<IconDownload size={14} />}>Download</Button>

            <Alert icon={<IconInfoCircle size="1rem"/>} title="Start the node installation" my="md" color="blue">
                Please use a tool like Balena Etcher etc. to write this image to a USB key.
            </Alert>
        </Container>


    )
}