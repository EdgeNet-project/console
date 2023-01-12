import {
    createBrowserRouter,
} from "react-router-dom";
import UserRegistrationForm from "./Authentication/Registration/UserRegistrationForm";
import UserProfile from "./Views/UserProfile";
import Application from "./Application";

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
        ],
    },

]);

export default router;