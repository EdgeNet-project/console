import {
    createBrowserRouter,
} from "react-router-dom";

import Login from "../Login/Panel";
import {UserRegistrationForm} from "../Registration/UserRegistrationForm";

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
    {
        path: "/registration",
        element: <UserRegistrationForm />,
        loader: null,
    },
]);

export default router;