import React, {useEffect} from "react";
import {useFetch} from "../Fetch";

const Dashboard = () => {
    const { get } = useFetch()

    useEffect(() => {
        get('kubernetes/config')
            .then(data => console.log(data))
    }, [])

    return (
        <div>
            Dashboard
        </div>
    )
}

export default Dashboard;