import {
    createBrowserRouter,
} from "react-router-dom";
import RegistrationForm from "../../Authentication/Registration/RegistrationForm";
import UserProfile from "../../Profile/UserProfile";
import Application from "../index";
import NodeList from "../../Views/NodeList";
import Tokens from "../../Views/Tokens";
import RequestsView from "../../Requests/RequestsView";
import TenantUsers from "../../Views/TenantUsers";
import Index from "../../Dashboard";
import TeamView from "../../Teams/TeamView";
import WorkspaceView from "../../Workspace/WorkspaceView";
import TeamRegistration from "../../Teams/TeamRegistration";
import WorkspaceRegistration from "../../Workspace/WorkspaceRegistration";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Application />,
        loader: null,
        children: [
            {
                path: "/",
                element: <Index />,
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