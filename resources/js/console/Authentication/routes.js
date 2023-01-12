import {
    createBrowserRouter,
} from "react-router-dom";

import Login from "./Login/Panel";
import UserRegistrationForm from "./Registration/UserRegistrationForm";
import EmailVerification from "./Registration/EmailVerification";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        loader: null,
        action: null, // login
        children: [

        ],
    },
    {
        path: "/registration",
        element: <UserRegistrationForm />,
        loader: null,
    },
    {
        path: "/email/verify/:id/:hash",
        element: <EmailVerification />,
    },
    {
        path: "/password",
        element: null,
        loader: null,
        action: null, // forgot password
        children: [
            // {
            //     path: "team",
            //     element: null,
            //     loader: null,
            // },
        ],
    },

]);

export default router;