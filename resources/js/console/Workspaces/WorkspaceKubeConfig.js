import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import axios from "axios";
import {Button, Group, Stack, Text, Modal, Alert} from "@mantine/core";
import {IconFileSettings as IconKubeConfig, IconInfoCircle} from "@tabler/icons";
import {useDisclosure} from "@mantine/hooks";

const DownloadKubeConfigDialog = ({onClose, workspace, user}) => {
    const [ loading, setLoading ] = useState(false);
    const [ cluster, setCluster ] = useState(null);

    useEffect(() => {
        setLoading(true)
        axios.get('/api/cluster').then(({data}) => {
            setCluster(data);
        }).catch(error => {
            console.log(error)
        }).finally(() => setLoading(false));
    }, []);



    const downloadKubeConfig = (token) => {
        if (!token.plainTextToken) {
            return
        }

        const config = `apiVersion: v1
kind: Config
clusters:
- name: edgenet-cluster
  cluster:
    certificate-authority-data: ` + cluster.ca + `
    server: ` + cluster.server + `
contexts:
- name: edgenet
  context:
    cluster: edgenet-cluster
    namespace: ` + workspace.name + `
    user: ` + user.email + `
current-context: edgenet
users:
- name: ` + user.email + `
  user:
    token: ` + token.plainTextToken;

        const element = document.createElement("a");
        const file = new Blob([config], {type: 'text/yaml'});
        element.href = URL.createObjectURL(file);
        element.download = "edgenet-" + workspace.name + "-" + user.email + ".yaml";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }


    const handleSubmit = () => {
        setLoading(true)

        axios.post('/api/tokens', {
            name: workspace.name, overwrite: true
        })
            .then(({data: {token}}) => {
                downloadKubeConfig(token)
            })
            .catch(({message, response: {data: {errors}}}) => {
                // console.log(message)
                // setErrors(errors)
                //form.setErrors(errors);
            })
            .finally(() => {
                onClose()
            })
    }

    return (
        <Modal opened onClose={onClose} title={"Download "+workspace.name+" KubeConfig"}>
            <Stack>
                <Text size="sm">
                    You can download a Kubernetes configuration file to use to access
                    your workspace <b>{workspace.name}</b> on the EdgeNet cluster via kubectl.
                </Text>
                <Alert icon={<IconInfoCircle size="1rem"/>} color="orange" size="sm">
                    By downloading this configuration file you will invalidate any previous configuration that
                    had been downloaded. <br />
                    A new authentication token will be created that will supersede the previous one.
                </Alert>
                <Text size="sm">

                </Text>
                <Group justify="flex-end">
                    <Button disabled={loading} color="gray" variant="light" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button disabled={loading} onClick={handleSubmit}>
                        Download Config
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )

}

export default ({workspace}) => {
    const [opened, { open, close }] = useDisclosure(false);
    const { user } = useAuthentication();

    if (!user.workspaces.find(w => w.name === workspace.name)) {
        return null;
    }

    return (
        <>
            {opened && <DownloadKubeConfigDialog onClose={close}
                                                 user={user}
                                                 workspace={workspace} />}
            <Button leftSection={<IconKubeConfig />} onClick={open}>
                Download {workspace.name} KubeConfig
            </Button>
        </>
    )
}