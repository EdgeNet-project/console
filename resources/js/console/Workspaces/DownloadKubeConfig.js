import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import axios from "axios";
import {useForm} from "@mantine/form";
import {Button, Group, Stack, Text, Modal} from "@mantine/core";
import {IconFileSettings as IconKubeConfig} from "@tabler/icons";
import {useDisclosure} from "@mantine/hooks";

const DownloadKubeConfigDialog = ({onClose, workspace}) => {
    const [ loading, setLoading ] = useState(false);
    const [ cluster, setCluster ] = useState(null);
    const { user } = useAuthentication();

    useEffect(() => {
        axios.get('/api/cluster').then(({data}) => {
            setCluster(data);
        }).catch(error => {
            console.log(error)
        });
    }, []);

    const form = useForm({
        initialValues: {
            name: '',
        },

        validate: {
        },
    });

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
        <Stack>
            <Text size="sm">
                You can download a Kubernetes configuration file to use to access
                the EdgeNet cluster via kubectl.
            </Text>
            <Text size="sm">
                By downloading this configuration file you will invalidate the previous one, a new
                authentication token will be created that will supersede the previous one.
            </Text>
            <Text size="sm">

            </Text>
            <Group position="apart">
                <Button disabled={loading} color="gray" onClick={onClose}>
                    Cancel
                </Button>
                <Button disabled={loading} onClick={handleSubmit}>
                    Download Config
                </Button>
            </Group>
        </Stack>
    )

}

export default ({workspace}) => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Download KubeConfig">
                <DownloadKubeConfigDialog onClose={close} workspace={workspace} />
            </Modal>
            <Button leftIcon={<IconKubeConfig />} onClick={open}>
                Download KubeConfig
            </Button>
        </>
    )
}