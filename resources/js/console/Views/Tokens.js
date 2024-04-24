import React, {useEffect, useState} from "react";
import { useAuthentication } from "../Authentication";
import {
    Anchor,
    Button,
    Code,
    Group,
    Box,
    Text,
    Title,
    Modal,
    TextInput,
    Stack,
    Table, Paper, ActionIcon
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import {IconBuilding, IconDownload, IconKey, IconTrash} from "@tabler/icons";
import {useForm} from "@mantine/form";

const CreateToken = ({onClose}) => {
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
                <Group position="apart">
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
        <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack>
                <TextInput label="Name" placeholder="my-token-name"
                           {...form.getInputProps('name')} />
                <Button disabled={loading} type="submit" fullWidth>
                    Submit
                </Button>
            </Stack>
        </form>
    )
}

const DeleteToken = ({token, onClose}) => {

    const deleteToken = (name) => {
        axios.delete('/api/tokens/' + token.name)
            .then(({data}) => {
                console.log(data)
                // this.setState({
                //     ...data, loading: false
                // });
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                onClose()
            });
    }

    return (
        <>
            <Text size="sm">Are you sure you want to delete the following token?</Text>
            <Code block>{token.name}</Code>
            <Group position="apart" mt="sm">
                <Button onClick={onClose} color="gray">Cancel</Button>
                <Button onClick={deleteToken} color="red">Delete</Button>
            </Group>
        </>
    )
}

export default function Tokens() {
    const [ tokens, setTokens ] = useState([])
    const [ deleteToken, setDeleteToken ] = useState(null)
    const { user } = useAuthentication();
    const [opened, { open, close }] = useDisclosure(false);
    const [deleteOpened, deleteDialogHandlers] = useDisclosure(false);
    const navigate = useNavigate();

    useEffect(() => {
        refreshTokens()
    }, [opened, deleteOpened]);

    useEffect(() => {
        if (deleteToken) {
            deleteDialogHandlers.open()
        }
    }, [deleteToken])

    const refreshTokens = () => {
        axios.get('/api/tokens', {
            // params: { ...queryParams, page: current_page + 1 },
            // paramsSerializer: qs.stringify,
        })
        .then(({data}) => {
            console.log(data)
            setTokens(data);
            // this.setState({
            //     ...data, loading: false
            // });
        })
        .catch(error => {
            console.log(error)
        });
    }

    return (
        <>
            <Modal opened={opened}
                   closeOnClickOutside={false}
                   closeOnEscape={false}
                   onClose={close} title="Create a new Token" centered>
                <CreateToken onClose={close} />
            </Modal>

            <Modal opened={deleteOpened} onClose={deleteDialogHandlers.close} title="Delete Token" centered>
                <DeleteToken token={deleteToken}
                             onClose={deleteDialogHandlers.close} />
            </Modal>

            <Title order={2} mb="sm">
                <IconKey size={22} /> Access Tokens
            </Title>
            <Paper shadow="xs" p="md">
                <Table sx={{ minWidth: 800 }} verticalSpacing="sm">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Abilities</th>
                        <th>Created</th>
                        <th>Expires</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {tokens.map((token) => <tr key={token.id}>
                        <td>{token.name}</td>
                        <td>{token.abilities}</td>
                        <td>{token.created_at}</td>
                        <td>{token.expires_at}</td>
                        <td>
                            <ActionIcon variant="filled" color="red" onClick={() => setDeleteToken(token)}>
                                <IconTrash size="1rem" />
                            </ActionIcon>
                        </td>
                    </tr>)}
                    </tbody>
                </Table>
            </Paper>

            <Box sx={{margin:'25px 0'}}>
                <Button onClick={open}>Create Token</Button>
                {/*<Button leftIcon={<IconDownload size={16} />} onClick={downloadConfig}>Download Configuration</Button>*/}
            </Box>

            <Title sx={{borderTop:'solid 1px gray', paddingTop:'10px', marginTop:'25px'}} order={4}>
                Using kubectl with your configuration file
            </Title>
            <Text sx={{margin:'25px 0'}}>
                To use EdgeNet download your configuraton file on your computer,
                On Linux and MacOs kubernetes config files are stored in your home
            </Text>
            <Code>
                mv edgenet-{user.authority}-{user.name}.yml $HOME/.kube
            </Code>
            <Text sx={{margin:'25px 0'}}>
                Specify the configuration file path when using kubectl:
            </Text>
            <Code>
                kubectl get nodes --kubeconfig=$HOME/.kube/edgenet-{user.authority}-{user.name}.yml
            </Code>

            <Title sx={{borderTop:'solid 1px gray', paddingTop:'10px', marginTop:'25px'}} order={4}>
                Merging your configurations files
            </Title>
            <Text sx={{margin:'25px 0'}}>
                kubeconfig files are structured YAML files and $HOME/.kube/config is the default configuration file. <br />
                If you already have one or more cluster configurations you can use kubectl to merge your edgenet configuraton files. <br />
                As a first step make a backup of your current default configuration:
            </Text>
            <Code>
                cp $HOME/.kube/config $HOME/.kube/config.backup.$(date +%Y-%m-%d.%H:%M:%S)
            </Code>
            <Text sx={{margin:'25px 0'}}>
                merge your default config with the edgenet configuration:
            </Text>
            <Code>
                KUBECONFIG=$HOME/.kube/config:$HOME/.kube/edgenet-{user.authority}-{user.name}.yml \ <br />
                &nbsp;&nbsp;&nbsp;&nbsp; kubectl config view --merge --flatten > ~/.kube/config
            </Code>
            <Text sx={{margin:'25px 0'}}>
                When use kubectl you can now easily switch contexts to select the cluster you want to work on:
            </Text>
            <Code>
                kubectl get pods --context=edgenet
            </Code>
            <Text sx={{margin:'25px 0'}}>
                If you don't want to merge the configuration files you can temporarily use the edgenet context in your shell
                session like so:
            </Text>
            <Code>
                export KUBECONFIG=$HOME/.kube/config:$HOME/.kube/edgenet-{user.authority}-{user.name}.yml
                <br /><br />
                kubectl get pods --context=edgenet
            </Code>

            <Text sx={{margin:'25px 0'}}>
                You will find more information about kubectl at the following links:
                <ul>
                    <li>
                        <Anchor target="_blank" href="https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/">
                            Organizing Cluster Access Using kubeconfig Files
                        </Anchor>
                    </li>
                    <li>

                        <Anchor target="_blank" href="https://kubernetes.io/docs/reference/kubectl/kubectl/">
                            kubectl CLI
                        </Anchor>
                    </li>
                    <li>
                        <Anchor target="_blank" href="https://kubernetes.io/docs/reference/kubectl/cheatsheet/">
                            kubectl Cheat Sheet
                        </Anchor>
                    </li>
                </ul>

            </Text>


        </>

    );
}