import React, {useEffect, useState} from "react";
import { useAuthentication } from "../Authentication";
import {Anchor, Button, Code, CopyButton, Group, Box, Text, Title} from "@mantine/core";
import { Prism } from '@mantine/prism';

import { useNavigate } from "react-router-dom";
import axios from "axios";
import {IconDownload} from "@tabler/icons";

export default function Tokens() {
    const [ cluster, setCluster ] = useState({})
    const { user, token } = useAuthentication();
    const navigate = useNavigate();

    useEffect(() => {
            axios.get('/api/cluster', {
                // params: { ...queryParams, page: current_page + 1 },
                // paramsSerializer: qs.stringify,
            })
            .then(({data}) => {
                    console.log(data)
                    setCluster(data);
                    // this.setState({
                    //     ...data, loading: false
                    // });
                })
                .catch(error => {
                    console.log(error)
                });
    }, []);

    const copyToClipboard = () => {
        // textareaEl.current.focus();
        textareaEl.current.select()
        document.execCommand("copy")
    }

    const downloadConfig = () => {
        const element = document.createElement("a");
        const file = new Blob([config], {type: 'text/yaml'});
        element.href = URL.createObjectURL(file);
        element.download = "edgenet-" + user.authority + "-" + user.name + ".yml";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
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
    namespace: authority-` + user.authority + `
    user: ` + user.email + `
current-context: edgenet
users:
- name: ` + user.email + `
  user:
    token: ` + token;

    return (
        <div>
            <Title order={2}>
                EdgeNet configuration
            </Title>
            <Prism language="yaml">
                {config}
            </Prism>

            <Box sx={{margin:'25px 0'}}>
                <Button leftIcon={<IconDownload size={16} />} onClick={downloadConfig}>Download Configuration</Button>
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


        </div>

    );
}