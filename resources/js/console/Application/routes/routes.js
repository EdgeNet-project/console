import {
    createBrowserRouter,
} from "react-router-dom";
import RegistrationForm from "../../Authentication/Registration/RegistrationForm";
import UserProfile from "../../Profile/UserProfile";
import Application from "../index";
import NodeList from "../../Views/NodeList";
import Tokens from "../../Views/Tokens";
import JoinRequestsView from "../../Requests/JoinRequestsView";
import TenantUsers from "../../Views/TenantUsers";
import Dashboard from "../../Views/Dashboard";
import TeamView from "../../Teams/TeamView";
import WorkspaceView from "../../Workspace/WorkspaceView";

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
                element: <JoinRequestsView />,
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
                path: "/team/:team",
                element: <TeamView />,
            },
            {
                path: "/team/:team/:workspace",
                element: <WorkspaceView />,
            },
        ],
    },

]);

export default router;