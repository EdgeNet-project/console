import {
    createBrowserRouter,
} from "react-router-dom";
import RegistrationForm from "../../Authentication/Registration/RegistrationForm";
import UserProfile from "../../Profile/UserProfile";
import Application from "../index";
import NodeList from "../../Node/NodeList";
import Tokens from "../../Views/Tokens";
import JoinRequestsView from "../../Requests/JoinRequestsView";
import TenantUsers from "../../Views/TenantUsers";
import Index from "../../Dashboard";

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
        ],
    },

]);

export default router;