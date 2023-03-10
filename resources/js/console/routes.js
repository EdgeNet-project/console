import {
    createBrowserRouter,
} from "react-router-dom";
import RegistrationForm from "./Authentication/Registration/RegistrationForm";
import UserProfile from "./Views/UserProfile";
import Application from "./Application";
import NodeList from "./Views/NodeList";
import Tokens from "./Views/Tokens";
import RoleRequests from "./Views/RoleRequests";
import TenantUsers from "./Views/TenantUsers";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Application />,
        loader: null,
        children: [
            {
                path: "/",
                element: 'dash',
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
                element: <RoleRequests />,
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