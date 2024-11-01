import React, {useEffect, useState} from "react";
import {useAuthentication} from "../Authentication";
import axios from "axios";
import {useForm} from "@mantine/form";
import {Button, Group, LoadingOverlay, Modal, Stack, Text, TextInput} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";

const CreateTokenDialog = ({title, onClose}) => {
    const [ loading, setLoading ] = useState(false);
    const [ cluster, setCluster ] = useState(null);
    const { user } = useAuthentication();
    const [ token, setToken ] = useState(null);

    useEffect(() => {
        axios.get('/api/cluster').then(({data}) => {
            setCluster(data);
        })
            .catch(error => {
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

    const downloadConfig = () => {
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
    namespace: ` + user.authority + `
    user: ` + user.email + `
current-context: edgenet
users:
- name: ` + user.email + `
  user:
    token: ` + token.plainTextToken;

        const element = document.createElement("a");
        const file = new Blob([config], {type: 'text/yaml'});
        element.href = URL.createObjectURL(file);
        element.download = "edgenet-" + user.authority + "-" + user.name + ".yml";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    }


    const handleSubmit = (values) => {
        setLoading(true)

        axios.post('/api/tokens', values)
            .then(({data: {token}}) => {
                setToken(token)
                console.log(token)
            })
            .catch(({message, response: {data: {errors}}}) => {
                // console.log(message)
                // setErrors(errors)
                //form.setErrors(errors);
            })
            .finally(() => {
                setLoading(false)
            })
    }

    if (token && token.plainTextToken) {
        return (
            <Stack>
                <Text size="sm" >
                    You can see below the newly created token. for security reasons this token will not
                    be stored on our server, you should copy and store it somewhere safe.
                </Text>
                <Text size="sm" >
                    Once you close this window you will not be able to retrieve this token anymore.
                </Text>
                <Text size="sm" >
                    You can also download a preconfigured Kubernetes config file already setup with this token.
                </Text>
                <Text block p="sm">{token.plainTextToken}</Text>
                <Group justify="flex-end" mt="sm">
                    <Button disabled={loading} color="gray" onClick={onClose}>
                        Close
                    </Button>
                    <Button disabled={loading} onClick={downloadConfig}>
                        Download Config
                    </Button>
                </Group>
            </Stack>
        )
    }

    return (
        <Modal opened onClose={onClose} title={title}>
            <LoadingOverlay visible={loading} />
            <form onSubmit={form.onSubmit(handleSubmit)}>
                <Stack>
                    <Text size="sm">
                        Please specify a name for the new token.
                    </Text>
                    <TextInput label="Name" placeholder="my-token-name"
                               {...form.getInputProps('name')} />

                    <Group justify="flex-end" mt="sm">
                        <Button color="gray" onClick={onClose} variant="light">
                            Cancel
                        </Button>
                        <Button disabled={loading} type="submit">
                            Submit
                        </Button>
                    </Group>
                </Stack>
            </form>
        </Modal>
    )
}

const CreateTokenButton = () => {
    const [opened, { open, close }] = useDisclosure(false);

    const title = "Create a new token";

    return (
        <>
            {opened && <CreateTokenDialog title={title} onClose={close} />}
            <Button size="xs" onClick={open}>
                {title}
            </Button>
        </>
    )
}

export {
    CreateTokenButton
}