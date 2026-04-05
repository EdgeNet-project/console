import {
    createBrowserRouter,
} from "react-router-dom";
import RegistrationForm from "../../Authentication/Registration/RegistrationForm";
import UserProfile from "../../Profile/UserProfile";
import Application from "../index";

import Dashboard from "../../Dashboard";
import TeamsView from "../../Teams";
import WorkspaceView from "../../Workspaces";

import NodeList from "../../Nodes/NodeList";
import NodeView from "../../Nodes";
import CreateNode from "../../Nodes/CreateNode.jsx";

import RequestsView from "../../Requests";

import Tokens from "../../Tokens";

import AdminTeams from "../../Admin/Console/Teams";
import AdminWorkspaces from "../../Admin/Console/Workspaces";
import AdminUsers from "../../Admin/Console/Users";
import AdminActivity from "../../Admin/Console/Activity";
import AdminNodes from "../../Admin/Cluster/Nodes";
import AdminAudit from "../../Admin/Cluster/Audit";
import AdminFlow from "../../Admin/Cluster/Flow";

import AdminConsole from "../../Admin/Console";
import AdminCluster from "../../Admin/Cluster";

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
                path: "/admin/console",
                element: <AdminConsole />,
                children: [
                    {
                        path: "teams",
                        element: <AdminTeams />,
                    },
                    {
                        path: "workspaces",
                        element: <AdminWorkspaces />,
                    },
                    {
                        path: "users",
                        element: <AdminUsers />,
                    },
                    {
                        path: "activity",
                        element: <AdminActivity />,
                    }
                ]
            },
            {
                path: "/admin/cluster",
                element: <AdminCluster />,
                children: [
                    {
                        path: "nodes",
                        element: <AdminNodes />,
                    },
                    {
                        path: "audit",
                        element: <AdminAudit />,
                    },
                    {
                        path: "flow",
                        element: <AdminFlow />,
                    },
                ]
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
            // {
            //     path: "/users",
            //     element: <TenantUsers />,
            // },
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