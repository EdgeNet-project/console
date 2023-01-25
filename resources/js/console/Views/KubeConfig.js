import React, {useState} from "react";
import { useAuthentication } from "../Authentication";
import {Button, Group, Text} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function KubeConfig() {
    const [ cluster, setCluster ] = useState({})
    const { user } = useAuthentication();
    const navigate = useNavigate();

    const handleLogout = () => {

    }

    const getClusterInfo = () =>
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
    token: ` + user.api_token;

    return (
        <Group position="apart">
            <div>
                <Text size="lg" weight={500}>
                    {user.firstname} {user.lastname}
                </Text>
                <Text size="xs" color="dimmed">
                    {user.email}
                </Text>
            </div>

            <Button color="red" onClick={handleLogout}>Logout</Button>


        </Group>
    );
}