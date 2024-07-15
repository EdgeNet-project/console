import {Anchor, Code, Text, Title} from "@mantine/core";
import React from "react";

export default () => {

    return (
        <>
            <Title mb="md" order={4}>
                Using kubectl with your configuration file
            </Title>
            <Text>
                To use EdgeNet download your configuraton file on your computer,
                On Linux and MacOs kubernetes config files are stored in your home
            </Text>
            <Code>
                mv edgenet-{user.authority}-{user.name}.yml $HOME/.kube
            </Code>
            <Text>
                Specify the configuration file path when using kubectl:
            </Text>
            <Code>
                kubectl get nodes --kubeconfig=$HOME/.kube/edgenet-{user.authority}-{user.name}.yml
            </Code>

            <Title my="md" order={4}>
                Merging your configurations files
            </Title>
            <Text>
                kubeconfig files are structured YAML files and $HOME/.kube/config is the default configuration file. <br />
                If you already have one or more cluster configurations you can use kubectl to merge your edgenet configuraton files. <br />
                As a first step make a backup of your current default configuration:
            </Text>
            <Code>
                cp $HOME/.kube/config $HOME/.kube/config.backup.$(date +%Y-%m-%d.%H:%M:%S)
            </Code>
            <Text>
                merge your default config with the edgenet configuration:
            </Text>
            <Code>
                KUBECONFIG=$HOME/.kube/config:$HOME/.kube/edgenet-{user.authority}-{user.name}.yml \ <br />
                &nbsp;&nbsp;&nbsp;&nbsp; kubectl config view --merge --flatten > ~/.kube/config
            </Code>
            <Text>
                When use kubectl you can now easily switch contexts to select the cluster you want to work on:
            </Text>
            <Code>
                kubectl get pods --context=edgenet
            </Code>
            <Text>
                If you don't want to merge the configuration files you can temporarily use the edgenet context in your shell
                session like so:
            </Text>
            <Code>
                export KUBECONFIG=$HOME/.kube/config:$HOME/.kube/edgenet-{user.authority}-{user.name}.yml
                <br /><br />
                kubectl get pods --context=edgenet
            </Code>

            <Text>
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
    )
}