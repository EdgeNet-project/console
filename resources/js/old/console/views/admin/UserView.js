import React, {useEffect, useContext, useState} from "react";
import { useParams } from "react-router";
import axios from "axios";
import {Box, Text, Button} from "grommet";
import {Console} from "grommet-icons";
import {ConsoleContext} from "../../index";
import {User} from "../../resources";
import {StatusDisabled, StatusGood, UserManager} from "grommet-icons";


const UserView = () => {
    const [ resource, setResource ] = useState(null);
    const [ user, setUser ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const { config } = useContext(ConsoleContext);
    const { namespace, name } = useParams();

    useEffect(() => {
        loadResource();
    }, [name])

    // useEffect(() => {
    //     if (resource && resource.metadata.name) {
    //         loadUser();
    //     } else {
    //         setUser(false);
    //         setLoading(false)
    //     }
    // }, [resource])

    const loadResource = () => {
        setLoading(true);

        axios.get('/apis/core.edgenet.io/v1alpha/acceptableusepolicies/' + name)
            .then(({data}) => {
                if (data) {
                    setResource(data);
                }
            })
            .catch(error => {
                console.log(error)
                setResource(false)
            })
            .finally(loadUser);
    }

    /*
        Local users DB that have access to the console
     */
    const loadUser = () => {
        axios.get('/api/users/' + name)
            .then(({data}) => setUser(data))
            .catch(() => setUser(false))
            .finally(() => setLoading(false));
    }

    const consoleAccess = () => {
        axios.post('/api/users', {
            name: resource.metadata.name,
            authority: resource.metadata.namespace.substring(10),
            email: resource.spec.email,
            firstname: resource.spec.firstname,
            lastname: resource.spec.lastname,
        })
            .then(({data}) => setUser(data))
            .catch(error => {
                console.log(error)
            });
    }

    if (loading) {
        return null;
    }

    if (!resource) {
        return null;
    }

    return (
        <Box pad="medium">
            <Box justify="start" direction="row" gap="xsmall" pad={{bottom: 'medium'}}>
                {resource.spec.active ? <StatusGood color="status-ok"/> : <StatusDisabled/>}
                {resource.status.type === 'admin' && <UserManager/>}
                {user && <Console />}
            </Box>
            <User resource={resource} />
            <Text size="small" margin={{top:'medium'}}>
                UID: {resource.metadata.uid} <br/>
                Name: {resource.metadata.name} <br/>
                Namespace: {resource.metadata.namespace}
            </Text>
            <Box align="start"
                 border={{side:'top', color:'light-3'}} pad={{vertical:'small'}} margin={{vertical:'small'}}>
                {!loading && !user && <Button plain icon={<Console />} label="Create console user" onClick={consoleAccess} />}
            </Box>
        </Box>

    )


}


export default UserView;
