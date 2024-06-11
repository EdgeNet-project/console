import {IconInfoCircle} from "@tabler/icons";
import {Alert, Code, Group, Select, Text} from "@mantine/core";
import { CopyButton, ActionIcon, Tooltip, rem } from '@mantine/core';
import { IconCopy, IconCheck } from '@tabler/icons-react';

export default ({node}) => {

    if (node.status && node.status !== 'to install') {
        return null;
    }

    const cmd = "curl -s " + node.installation_url + " | bash";

    return (
        <Alert icon={<IconInfoCircle size="1rem"/>} title="Start the node installation" color="blue">
            <Text my="md">
                Your node is not installed, to start the installation execute the following
                command directly on your node via ssh:
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


        </Alert>
    )
}