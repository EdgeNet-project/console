import {
    createBrowserRouter,
} from "react-router-dom";
import RegistrationForm from "../../Authentication/Registration/RegistrationForm";
import UserProfile from "../../Profile/UserProfile";
import Application from "../index";
import TenantUsers from "../../Views/TenantUsers";

import Dashboard from "../../Dashboard";
import TeamsView from "../../Teams";
import WorkspaceView from "../../Workspaces";

import NodeList from "../../Nodes/NodeList";
import NodeView from "../../Nodes";
import CreateNode from "../../Nodes/CreateNode";

import RequestsView from "../../Requests";

import Tokens from "../../Tokens";


const router = createBrowserRouter([
    {
        path: "/",
        element: <Application />,
        loader: null,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "/profile",
                element: <UserProfile />,
            },
            {
                path: "registration",
                element: <RegistrationForm />,
                loader: null,
            },
            {
                path: "/tokens",
                element: <Tokens />,
            },
            {
                path: "/requests",
                element: <RequestsView />,
            },
            {
                path: "/users",
                element: <TenantUsers />,
            },
            {
                path: "/nodes",
                element: <NodeList />,
            },
            {
                path: "/nodes/create",
                element: <CreateNode />,
            },
            {
                path: "/nodes/:id",
                element: <NodeView />,
            },
            {
                path: "/teams/:id",
                element: <TeamsView />,
            },
            {
                path: "/workspaces/:id",
                element: <WorkspaceView />,
            },
        ],
    },

]);

export default router;