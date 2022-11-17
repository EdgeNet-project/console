import React, {useEffect, useContext, useState} from "react";
import axios from "axios";
import { useHistory, useParams } from "react-router";

import { ConsoleContext } from "../../index";
import {Box, Text} from "grommet";
import {StatusGood, StatusDisabled, UserManager} from "grommet-icons";

import { User } from "../../resources";

const UserRow = ({resource}) => {
    const history = useHistory();
    const { name } = useParams();

    return (
        <Box pad="small" direction="row" justify="between"
             background={resource.metadata.name === name ? '#F8FAFE' : null}
             onClick={() => history.push('/admin/users/' + resource.metadata.namespace + '/' + resource.metadata.name)}>
            <Box gap="small">
                <User resource={resource}/>
                <Text size="small">

                </Text>

            </Box>

            <Box justify="between">
                <Box justify="end" direction="row" gap="xsmall" pad={{bottom: 'xsmall'}}>
                    {resource.status.type === 'admin' && <UserManager/>}
                    {resource.spec.active ? <StatusGood color="status-ok"/> : <StatusDisabled/>}
                </Box>
                <Box align="end">
                    <Text size="small">
                        UID: {resource.metadata.uid} <br/>
                        Name: {resource.metadata.name} <br/>
                        Namespace: {resource.metadata.namespace}
                    </Text>
                </Box>
            </Box>
        </Box>
    );
};



const UserList = () => {
    const [ resources, setResources ] = useState([]);
    const [ users, setUsers ] = useState([]);
    const [ loading, setLoading ] = useState(false);
    const { config } = useContext(ConsoleContext);

    useEffect(() => {
        loadResources();
        loadConsoleUsers();
    }, [])

    const loadResources = () => {
        axios.get('/apis/core.edgenet.io/v1alpha/acceptableusepolicies', {
            // params: { ...queryParams, page: current_page + 1 },
            // paramsSerializer: qs.stringify,
        })
            .then(({data}) => {
                if (data.items) {
                    setResources(data.items);
                }
                // this.setState({
                //     ...data, loading: false
                // });
            })
            .catch(error => {
                console.log(error)
            });
    }

    /*
        Local users DB that have access to the console
     */
    const loadConsoleUsers = () => {
        axios.get('/api/users', {
            // params: { ...queryParams, page: current_page + 1 },
            // paramsSerializer: qs.stringify,
        })
            .then(({data}) => {
                if (data.items) {
                    setUsers(data.items);
                }
                // this.setState({
                //     ...data, loading: false
                // });
            })
            .catch(error => {
                console.log(error)
            });
    }

    return (
        <Box overflow="auto" pad="small">

            {resources.map(resource =>
                <Box key={resource.metadata.name}
                    // onMouseEnter={() => this.setState({ isMouseOver: true })}
                    //  onMouseLeave={() => this.setState({ isMouseOver: false })}
                    //  onClick={() => onClick(item)}
                    //  background={background}
                     border={{side:'bottom', color:'light-3'}}
                     flex={false}>
                    <UserRow loading={loading} resource={resource} />
                </Box>
            )}
        </Box>

    )


}


export default UserList;
