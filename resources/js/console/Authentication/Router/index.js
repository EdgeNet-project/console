import {
    createBrowserRouter,
} from "react-router-dom";

import Login from "../Login/Panel";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
        loader: null,
        action: null, // login
        children: [
            {
                path: "team",
                element: null,
                loader: null,
            },
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
]);

export default router;