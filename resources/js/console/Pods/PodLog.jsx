import React, {useEffect} from "react";
import {ActionIcon, Text, Modal, Stack} from "@mantine/core";
import {IconLogs} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
window.Pusher = Pusher;

// window.Echo = new Echo({
//     broadcaster: 'reverb',
//     key: import.meta.env.VITE_REVERB_APP_KEY,
//     wsHost: import.meta.env.VITE_REVERB_HOST,
//     wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
//     wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
//     forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
//     enabledTransports: ['ws', 'wss'],
// });

const Log = ({pod, onClose}) => {

    useEffect(() => {

    }, [])

    return (
        <Modal opened onClose={onClose} title={"Logs for "+pod.name}>
            <Stack>
                <Text size="sm">
                    LOGS
                </Text>
            </Stack>
        </Modal>
    )
}
const PodLog = ({pod}) => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            {opened && <Log pod={pod} onClose={close} />}
            <ActionIcon onClick={open} size="xs" color="gray">
                <IconLogs />
            </ActionIcon>
        </>
    )
}

export default PodLog;