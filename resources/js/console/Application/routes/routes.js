import {
    createBrowserRouter,
} from "react-router-dom";
import RegistrationForm from "../../Authentication/Registration/RegistrationForm";
import UserProfile from "../../Profile/UserProfile";
import Application from "../index";
import Tokens from "../../Tokens";
import RequestsView from "../../Requests/RequestsView";
import TenantUsers from "../../Views/TenantUsers";
import Dashboard from "../../Dashboard";
import TeamView from "../../Teams/TeamView";
import WorkspaceView from "../../Workspace/WorkspaceView";
import TeamRegistration from "../../Teams/TeamRegistration";
import WorkspaceRegistration from "../../Workspace/WorkspaceRegistration";

import NodeList from "../../Node/NodeList";
import CreateNode from "../../Node/CreateNode";
import NodeView from "../../Node/NodeView";

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
                path: "/team/registration",
                element: <TeamRegistration />,
            },
            {
                path: "/team/join",
                element: <TeamView />,
            },
            {
                path: "/team/:team",
                element: <TeamView />,
            },

            {
                path: "/workspace/registration",
                element: <WorkspaceRegistration />,
            },

            {
                path: "/team/:team/:workspace",
                element: <WorkspaceView />,
            },
        ],
    },

]);

export default router;