import {useParams} from "react-router";
import axios from "axios";
import { Stack } from "@mantine/core";

import React, {useEffect, useState} from "react";
import TeamWorkspaces from "./TeamWorkspaces";
import TeamUsers from "./TeamUsers";
import TeamInfo from "./components/TeamInfo";
import PanelGrid from "../Components/PanelGrid";
import PanelTitle from "../Components/PanelTitle.jsx";


export default () => {
    const { id } = useParams()
    const [ team, setTeam ] = useState(null)

    const [ users, setUsers ] = useState([])
    const [ workspaces, setWorkspaces ] = useState([])

    // console.log('wp',workspace)

    useEffect(() => {
        axios.get('/api/tenants/' + id)
            .then(({data}) => {
                console.log(data)
                setTeam(data)
            })
    }, [id])

    // useEffect(() => {
    //     axios.get('/api/tenants/' + id + '/users')
    //         .then(({data}) => {
    //             console.log('users',data)
    //             setUsers(data)
    //         })
    // }, [team])
    //
    // useEffect(() => {
    //     axios.get('/api/tenants/' + id + '/subnamespaces')
    //         .then(({data}) => {
    //             console.log('workspaces',data)
    //             setWorkspaces(data)
    //         })
    // }, [team])

    if (!team) {
        return null;
    }

    return (
        <>
            <PanelTitle title={["Team", team.fullname]}/>
            <Stack py="md">
                <TeamInfo team={team} />
            </Stack>
            <PanelGrid>
                <TeamWorkspaces team={team} />
                <TeamUsers team={team} />
            </PanelGrid>
        </>
    )
}