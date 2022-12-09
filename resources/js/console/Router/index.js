import {
    createBrowserRouter,
} from "react-router-dom";

const router = createBrowserRouter([
    {
        path: "/",
        element: null,
        loader: null,
        children: [
            {
                path: "team",
                element: null,
                loader: null,
            },
        ],
    },
]);

export default router;