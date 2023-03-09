import {
    createBrowserRouter,
} from "react-router-dom";

import Login from "./Login/LoginForm";
import UserRegistration from "./Registration/UserRegistration";
import EmailVerification from "./Registration/EmailVerification";
import PasswordResetLink from "./Login/PasswordResetLink";
import PasswordResetForm from "./Login/PasswordResetForm";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        loader: null,
        action: null, // login
        children: [
            {
                path: "/registration",
                element: <UserRegistration />,
                loader: null,
            },
            {
                path: "/email/verify/:id/:hash",
                element: <EmailVerification />,
            },
            {
                path: "/password",
                element: <PasswordResetLink />,
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
            {
                path: "/password/reset/:id/:signature",
                element: <PasswordResetForm />,
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
        ],
    },



]);

export default router;