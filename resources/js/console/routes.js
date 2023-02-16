import {
    createBrowserRouter,
} from "react-router-dom";
import UserRegistrationForm from "./Authentication/Registration/UserRegistrationForm";
import UserProfile from "./Views/UserProfile";
import Application from "./Application";
import NodeList from "./Views/NodeList";
import Tokens from "./Views/Tokens";
import Requests from "./Views/Requests";

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
                element: <UserRegistrationForm />,
                loader: null,
            },
            {
                path: "/tokens",
                element: <Tokens />,
            },
            {
                path: "/requests",
                element: <Requests />,
            },
            {
                path: "/nodes",
                element: <NodeList />,
            },
        ],
    },

]);

export default router;