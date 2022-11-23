import React from "react";
import Login from "../Authentication/Login/Login"
import { isAuthenticated } from "../Authentication/AccessControl";
import Dashboard from "./Dashboard";

const Application = () => {

    if (!isAuthenticated()) {
        return <Login />
    }

    return (
        <Dashboard />
    )
}

export default Application;